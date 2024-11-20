import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Film } from 'lucide-react'
import Header from '../components/Header'
import Button from '../components/Button'

export default function LandingPage() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleCreateRoom = async () => {
    if (username.trim()) {
      try {
        const response = await fetch('http://localhost:3000/api/rooms/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        })
        const data = await response.json()
        localStorage.setItem('username', username)
        navigate(`/room/${data.roomId}`)
      } catch (error) {
        console.error('Failed to create room:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header showRoomInfo={false} />
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Film className="w-24 h-24 text-green-500 mx-auto mb-8" />
          <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Welcome to MovieSync
          </h1>
          <p className="text-2xl mb-12 text-gray-300">
            Watch movies together with friends, no matter where you are!
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button onClick={handleCreateRoom} className="w-full text-lg py-3">
            Create a Room
          </Button>
        </motion.div>
      </main>
    </div>
  )
}