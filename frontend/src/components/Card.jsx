import React from 'react'

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      {children}
    </div>
  )
}

export default Card