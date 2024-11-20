import React from 'react'

const Avatar = ({ src, alt, className = '' }) => {
  return (
    <img
      src={src || '/placeholder.svg?height=40&width=40'}
      alt={alt || 'User avatar'}
      className={`w-10 h-10 rounded-full object-cover ${className}`}
    />
  )
}

export default Avatar