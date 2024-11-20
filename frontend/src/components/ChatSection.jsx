import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import Button from './Button'

const ChatSection = ({ isOpen, onToggle, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
    }
  }

  if (!isOpen) {
    return (
      <Button variant="ghost" onClick={onToggle} className="fixed bottom-4 right-4">
        <MessageCircle size={24} />
      </Button>
    )
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 text-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chat</h2>
        <Button variant="ghost" onClick={onToggle}>
          <X size={24} />
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{msg.username}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <Button onClick={handleSend} className="rounded-l-none">
          <Send size={20} />
        </Button>
      </div>
    </div>
  )
}

export default ChatSection