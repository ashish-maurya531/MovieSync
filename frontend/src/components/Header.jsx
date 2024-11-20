import React, { useState, useEffect } from 'react'
import { Copy } from 'lucide-react'
import Button from './Button'

export default function Header({ roomId, roomName, onLeave, showRoomInfo, startTime }) {
  const [timeRemaining, setTimeRemaining] = useState(3 * 60 * 60) // 3 hours in seconds

  useEffect(() => {
    if (startTime && showRoomInfo) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = Math.max(3 * 60 * 60 - elapsed, 0)
        setTimeRemaining(remaining)
        if (remaining === 0) {
          clearInterval(timer)
          if (onLeave) onLeave()
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [startTime, showRoomInfo, onLeave])

  const copyRoomLink = () => {
    if (roomId) {
      const link = `${window.location.origin}/join/${roomId}`
      navigator.clipboard.writeText(link)
    }
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <header className="bg-gray-900 text-white py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-500">MovieSync</h1>
        {showRoomInfo && roomId && roomName && (
          <>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Room: {roomName} (ID: {roomId})
              </span>
              <Button variant="ghost" size="sm" onClick={copyRoomLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Join Link
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">
                Time remaining: {formatTime(timeRemaining)}
              </span>
              {onLeave && (
                <Button variant="ghost" className="text-red-400 hover:text-red-300" onClick={onLeave}>
                  Leave Room
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}