import React, { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import Button from './Button'

const RoomLinkModal = ({ roomId, onClose }) => {
  const [copied, setCopied] = useState(false)
  const roomLink = `${window.location.origin}/join/${roomId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Room Link</h2>
          <Button variant="ghost" onClick={onClose}>
            <X size={24} />
          </Button>
        </div>
        <p className="mb-4">Share this link with up to 6 friends to join your room:</p>
        <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
          <input
            type="text"
            value={roomLink}
            readOnly
            className="flex-grow bg-transparent px-4 py-2 focus:outline-none"
          />
          <Button onClick={copyToClipboard} className="rounded-none">
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          Note: This room will automatically close after 3 hours.
        </p>
      </div>
    </div>
  )
}

export default RoomLinkModal