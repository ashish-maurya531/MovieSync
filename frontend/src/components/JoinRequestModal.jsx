import React from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const JoinRequestModal = ({ request, onAccept, onReject, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Join Request</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="mb-6">
          <span className="font-semibold">{request.username}</span> wants to join your room
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="ghost" onClick={() => onReject(request.username)}>
            Reject
          </Button>
          <Button onClick={() => onAccept(request.username)}>
            Allow
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JoinRequestModal