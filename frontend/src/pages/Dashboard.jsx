import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ToolCard from '../components/ToolCard'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalScans: 0,
    threatsDetected: 0,
    filesSecured: 0,
    lastActivity: null
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)

    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) {
      navigate('/login')
      return
    }
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load user stats from localStorage or initialize
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const tools = [
    { title: 'Phishing Check', description: 'Check URLs for phishing attempts', link: '/phishing-check', icon: '🔍', usage: stats.totalScans },
    { title: 'Password Tool', description: 'Check password strength and generate secure passwords', link: '/password-tool', icon: '🔐', usage: 0 },
    { title: 'File Encryption', description: 'Encrypt and decrypt files securely', link: '/encrypt-file', icon: '🔒', usage: stats.filesSecured },
    { title: 'Data Leak Checker', description: 'Check if your email has been involved in data breaches', link: '/data-leak-check', icon: '🔓', usage: 0 },
    { title: 'Spam Detection', description: 'Analyze text for spam content', link: '/spam-check', icon: '📧', usage: 0 },

    { title: 'Deepfake Detector', description: 'Check files for deepfake manipulation', link: '/deepfake', icon: '🎭', usage: 0 },
    { title: 'Threat Dashboard', description: 'View security threats and alerts', link: '/threat-dashboard', icon: '⚠️', usage: 0 },
    { title: 'Chatbot', description: 'AI-powered cybersecurity assistant', link: '/chatbot', icon: '🤖', usage: 0 },
  ]

  const recentActivities = [
    { action: 'Phishing URL scanned', time: '2 hours ago', status: 'safe' },
    { action: 'File encrypted successfully', time: '1 day ago', status: 'success' },
    { action: 'Password strength checked', time: '2 days ago', status: 'info' },
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">🛡️ CyberShield Dashboard</h1>
          {user && <p className="text-xl text-gray-300">Welcome back, <span className="text-blue-400 font-semibold">{user.name}</span>!</p>}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 text-center hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
          <div className="text-4xl mb-3 animate-pulse">🔍</div>
          <div className="text-3xl font-bold text-white">{stats.totalScans}</div>
          <div className="text-gray-300">Total Scans</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 text-center hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
          <div className="text-4xl mb-3 animate-pulse">⚠️</div>
          <div className="text-3xl font-bold text-red-400">{stats.threatsDetected}</div>
          <div className="text-gray-300">Threats Detected</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 text-center hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
          <div className="text-4xl mb-3 animate-pulse">🔒</div>
          <div className="text-3xl font-bold text-green-400">{stats.filesSecured}</div>
          <div className="text-gray-300">Files Secured</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 text-center hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
          <div className="text-4xl mb-3 animate-pulse">🛡️</div>
          <div className="text-3xl font-bold text-blue-400">
            {stats.totalScans > 0 ? `${Math.round((1 - stats.threatsDetected / stats.totalScans) * 100)}%` : '100%'}
          </div>
          <div className="text-gray-300">Security Score</div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-white mb-6">Security Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <ToolCard key={index} title={tool.title} link={tool.link} icon={tool.icon} />
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 hover:bg-slate-700 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Recent Activity
          </h3>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-300">No recent activity</p>
              <p className="text-gray-400 text-sm mt-2">Start using our security tools!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'safe' ? 'bg-green-400' :
                      activity.status === 'success' ? 'bg-blue-400' :
                      'bg-yellow-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-600 hover:bg-slate-700 transition-all duration-300">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Security Check</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/phishing-check"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl animate-pulse">🔍</span>
            <span>Check URL</span>
          </Link>

          <Link
            to="/password-tool"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl animate-pulse">🔐</span>
            <span>Test Password</span>
          </Link>

          <Link
            to="/encrypt-file"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl animate-pulse">🔒</span>
            <span>Encrypt File</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
