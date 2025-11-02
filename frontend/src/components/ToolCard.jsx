import React from 'react'
import { Link } from 'react-router-dom'

const ToolCard = ({ title, link, icon }) => {
  return (
    <Link to={link} className="tool-card group">
      <div className="flex flex-col items-center justify-center text-center h-full">
        <div className="text-4xl mb-2 group-hover:animate-pulse-custom transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
          {title}
        </h3>
      </div>
    </Link>
  )
}

export default ToolCard
