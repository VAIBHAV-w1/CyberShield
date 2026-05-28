import React from 'react'
import { Link } from 'react-router-dom'

const ToolCard = ({ title, link, icon }) => {
  return (
    <Link to={link} className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col h-full">
      <div className="flex flex-col items-center justify-center text-center h-full gap-4">
        <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
          {title}
        </h3>
      </div>
    </Link>
  )
}

export default ToolCard
