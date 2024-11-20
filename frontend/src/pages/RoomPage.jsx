import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import Peer from 'simple-peer/simplepeer.min.js'; // Use browser-friendly build

import Header from '../components/Header'
import VideoPlayer from '../components/VideoPlayer'
import ParticipantVideo from '../components/ParticipantVideo'
import JoinRequestModal from '../components/JoinRequestModal'
import ChatSection from '../components/ChatSection'

const CHUNK_SIZE = 1024 * 1024 // 1MB chunks

export default function RoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [socket, setSocket] = useState(null)
  const [peers, setPeers] = useState({})
  const [isHost, setIsHost] = useState(false)
  const [videoFile, setVideoFile] = useState(null)
  const [videoChunks, setVideoChunks] = useState([])
  const [participants, setParticipants] = useState([])
  const [joinRequests, setJoinRequests] = useState([])
  const [roomStartTime, setRoomStartTime] = useState(undefined)
  const peersRef = useRef({})
  const streamRef = useRef(location.state?.stream)

  useEffect(() => {
    const username = localStorage.getItem('username')
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'],
      upgrade: false
    })
    setSocket(newSocket)

    if (streamRef.current) {
      newSocket.emit('join_video_room', { roomId, username })
    }

    newSocket.on('room_update', (data) => {
      setParticipants(data.participants)
      setIsHost(data.host === username)
      setRoomStartTime(data.startTime)
    })

    newSocket.on('join_request', (request) => {
      if (isHost) {
        setJoinRequests(prev => [...prev, request])
      }
    })

    // WebRTC peer connections
    newSocket.on('user_joined', ({ userId, username }) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: streamRef.current
      })

      peer.on('signal', signal => {
        newSocket.emit('sending_signal', { userId, signal })
      })

      peer.on('stream', stream => {
        peersRef.current[userId] = { peer, stream, username }
        setPeers(prev => ({ ...prev, [userId]: { stream, username } }))
      })
    })

    newSocket.on('receiving_signal', ({ signal, userId }) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: streamRef.current
      })

      peer.on('signal', signal => {
        newSocket.emit('returning_signal', { signal, userId })
      })

      peer.on('stream', stream => {
        peersRef.current[userId] = { peer, stream, username: '' }
        setPeers(prev => ({ ...prev, [userId]: { stream, username: '' } }))
      })

      peer.signal(signal)
    })

    // Video streaming
    newSocket.on('video_chunk', ({ chunk, metadata }) => {
      if (!isHost) {
        setVideoChunks(prev => [...prev, chunk])
        if (metadata.isLastChunk) {
          const blob = new Blob(videoChunks, { type: metadata.type })
          setVideoFile(URL.createObjectURL(blob))
        }
      }
    })

    return () => {
      Object.values(peersRef.current).forEach(({ peer }) => peer.destroy())
      newSocket.disconnect()
    }
  }, [roomId, isHost, location.state])

  const handleFileChange = async (event) => {
    if (isHost && event.target.files?.[0]) {
      const file = event.target.files[0]
      const chunks = []
      const reader = new FileReader()
      let offset = 0

      reader.onload = async (e) => {
        const chunk = e.target.result
        chunks.push(chunk)
        socket.emit('video_chunk', {
          roomId,
          chunk,
          metadata: {
            type: file.type,
            isLastChunk: offset >= file.size,
            timestamp: Date.now()
          }
        })

        if (offset < file.size) {
          offset += CHUNK_SIZE
          readNextChunk()
        } else {
          const blob = new Blob(chunks, { type: file.type })
          setVideoFile(URL.createObjectURL(blob))
        }
      }

      const readNextChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE)
        reader.readAsArrayBuffer(slice)
      }

      readNextChunk()
    }
  }

  const handleAcceptRequest = (username) => {
    socket.emit('accept_request', { roomId, username })
    setJoinRequests(prev => prev.filter(req => req.username !== username))
  }

  const handleRejectRequest = (username) => {
    socket.emit('reject_request', { roomId, username })
    setJoinRequests(prev => prev.filter(req => req.username !== username))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header
        roomId={roomId}
        roomName={`${participants.find(p => p.isHost)?.username || ''}'s Room`}
        onLeave={() => navigate('/')}
        showRoomInfo={true}
        startTime={roomStartTime}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            {isHost && (
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="mb-4"
              />
            )}
            {videoFile && (
              <VideoPlayer
                url={videoFile}
                socket={socket}
                roomId={roomId}
              />
            )}
          </div>

          {/* Participants Video Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(peers).map(([userId, { stream, username }]) => (
                <ParticipantVideo
                  key={userId}
                  stream={stream}
                  username={username}
                />
              ))}
            </div>
            <ChatSection
              socket={socket}
              roomId={roomId}
              username={localStorage.getItem('username') || ''}
            />
          </div>
        </div>
      </main>

      {/* Join Request Modals */}
      {joinRequests.map((request) => (
        <JoinRequestModal
          key={request.username}
          request={request}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      ))}
    </div>
  )
}