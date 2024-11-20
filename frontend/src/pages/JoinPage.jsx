import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import Header from '../components/Header'
import Button from '../components/Button'

const JoinPage = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [roomInfo, setRoomInfo] = useState(null)
  const [status, setStatus] = useState('idle')
  const [socket, setSocket] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'],
      upgrade: false
    })
    setSocket(newSocket)

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected')
    })

    newSocket.on('room_info', (info) => {
      setRoomInfo(info)
    })

    newSocket.on('request_accepted', () => {
      setStatus('accepted')
      localStorage.setItem('username', username)
      // Initialize WebRTC after acceptance
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          newSocket.emit('join_video_room', { roomId, username, stream: true })
          navigate(`/room/${roomId}`, { state: { stream } })
        })
        .catch(err => {
          console.error('Failed to get media devices:', err)
          navigate(`/room/${roomId}`)
        })
    })

    newSocket.on('request_rejected', () => {
      setStatus('rejected')
      setError('Your request was rejected by the host')
    })

    // Cleanup
    return () => {
      newSocket.disconnect()
    }
  }, [roomId, username, navigate])

  useEffect(() => {
    // Fetch initial room info
    if (socket) {
      socket.emit('get_room_info', roomId)
    }
  }, [socket, roomId])

  const handleJoinRequest = () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setStatus('pending')
    setError(null)
    
    // Send join request through socket
    socket.emit('join_request', {
      roomId,
      username,
      timestamp: Date.now()
    })

    // Add timeout for request
    setTimeout(() => {
      if (status === 'pending') {
        setStatus('idle')
        setError('Request timed out. Please try again.')
      }
    }, 30000) // 30 second timeout
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header showRoomInfo={false} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Join Room</h1>
          {roomInfo && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400">
                Host: {roomInfo.host}
                <br />
                Room ID: {roomId}
                <br />
                Participants: {roomInfo.participants?.length || 0}/7
              </p>
            </div>
          )}
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={status !== 'idle'}
          />
          
          <Button
            onClick={handleJoinRequest}
            className="w-full"
            disabled={status !== 'idle' || !username.trim()}
          >
            {status === 'idle' && 'Send Join Request'}
            {status === 'pending' && (
              <div className="flex items-center justify-center">
                <span className="mr-2">Request Pending...</span>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
              </div>
            )}
            {status === 'accepted' && 'Joining Room...'}
            {status === 'rejected' && 'Request Rejected'}
          </Button>

          {error && (
            <p className="mt-4 text-red-400 text-center">
              {error}
            </p>
          )}

          {status === 'pending' && (
            <p className="mt-4 text-gray-400 text-center">
              Waiting for host approval...
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default JoinPage