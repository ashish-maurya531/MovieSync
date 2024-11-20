import React from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const ParticipantCard = ({ participant, isHost, onRemove, isCreator }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          {/* {participant.username[0].toUpperCase()} */}
        </div>
        <div>
          {/* <p className="font-medium">{participant.username}</p> */}
          <p className="text-sm text-gray-400">{isHost ? 'Host' : 'Participant'}</p>
        </div>
      </div>
      {isCreator && !isHost && (
        <Button variant="ghost" size="sm" className="text-red-400" onClick={() => onRemove(participant.username)}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default ParticipantCard