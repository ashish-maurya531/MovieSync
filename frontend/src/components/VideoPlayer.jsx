import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import Button from './Button'

const VideoPlayer = ({ blob, onPlay, onPause }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (videoRef.current && blob) {
      videoRef.current.src = URL.createObjectURL(blob)
    }
  }, [blob])

  const handlePlay = () => {
    videoRef.current.play()
    setIsPlaying(true)
    onPlay()
  }

  const handlePause = () => {
    videoRef.current.pause()
    setIsPlaying(false)
    onPause()
  }

  const handleSeek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime)
  }

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        className="w-full rounded-lg"
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="flex justify-center items-center mt-4 space-x-4">
        <Button variant="ghost" onClick={() => handleSeek(-10)}>
          <SkipBack size={24} />
        </Button>
        <Button variant="ghost" onClick={isPlaying ? handlePause : handlePlay}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </Button>
        <Button variant="ghost" onClick={() => handleSeek(10)}>
          <SkipForward size={24} />
        </Button>
      </div>
    </div>
  )
}

export default VideoPlayer