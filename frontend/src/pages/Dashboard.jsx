import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ToolCard from '../components/ToolCard'
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  Lock, 
  Activity, 
  Zap, 
  FileKey, 
  KeyRound, 
  ShieldCheck,
  Unlock,
  Mail,
  Image as ImageIcon,
  Bot
} from 'lucide-react'

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
    { title: 'Phishing Check', description: 'Check URLs for phishing attempts', link: '/phishing-check', icon: <Search className="w-10 h-10" />, usage: stats.totalScans },
    { title: 'Password Tool', description: 'Check password strength and generate secure passwords', link: '/password-tool', icon: <KeyRound className="w-10 h-10" />, usage: 0 },
    { title: 'File Encryption', description: 'Encrypt and decrypt files securely', link: '/encrypt-file', icon: <FileKey className="w-10 h-10" />, usage: stats.filesSecured },
    { title: 'Data Leak Checker', description: 'Check if your email has been involved in data breaches', link: '/data-leak-check', icon: <Unlock className="w-10 h-10" />, usage: 0 },
    { title: 'Spam Detection', description: 'Analyze text for spam content', link: '/spam-check', icon: <Mail className="w-10 h-10" />, usage: 0 },

    { title: 'Deepfake Detector', description: 'Check files for deepfake manipulation', link: '/deepfake', icon: <ImageIcon className="w-10 h-10" />, usage: 0 },
    { title: 'Threat Dashboard', description: 'View security threats and alerts', link: '/threat-dashboard', icon: <AlertTriangle className="w-10 h-10" />, usage: 0 },
    { title: 'Chatbot', description: 'AI-powered cybersecurity assistant', link: '/chatbot', icon: <Bot className="w-10 h-10" />, usage: 0 },
  ]

  const recentActivities = [
    { action: 'Phishing URL scanned', time: '2 hours ago', status: 'safe' },
    { action: 'File encrypted successfully', time: '1 day ago', status: 'success' },
    { action: 'Password strength checked', time: '2 days ago', status: 'info' },
  ]

  const statCards = [
    {
      icon: Search,
      value: stats.totalScans,
      label: 'Total Scans',
      color: 'cyan',
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      glowColor: 'shadow-cyan-500/20',
      valueColor: 'text-cyan-400'
    },
    {
      icon: AlertTriangle,
      value: stats.threatsDetected,
      label: 'Threats Detected',
      color: 'red',
      gradient: 'from-red-500/20 to-red-500/5',
      borderColor: 'border-red-500/30',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
      glowColor: 'shadow-red-500/20',
      valueColor: 'text-red-400'
    },
    {
      icon: Lock,
      value: stats.filesSecured,
      label: 'Files Secured',
      color: 'emerald',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      glowColor: 'shadow-emerald-500/20',
      valueColor: 'text-emerald-400'
    },
    {
      icon: ShieldCheck,
      value: stats.totalScans > 0 ? `${Math.round((1 - stats.threatsDetected / stats.totalScans) * 100)}%` : '100%',
      label: 'Security Score',
      color: 'blue',
      gradient: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      glowColor: 'shadow-blue-500/20',
      valueColor: 'text-blue-400'
    }
  ]

  return (
    <div className="animate-fade-in pt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl border border-cyan-500/20">
              <Shield className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">CyberShield</span>
              <span className="text-white"> Dashboard</span>
            </h1>
          </div>
          {user && (
            <p className="text-lg text-gray-400 ml-1">
              Welcome back, <span className="text-cyan-400 font-semibold">{user.name}</span>!
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className={`relative bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-${card.color}-500/40 transition-all duration-500 group hover:scale-105 shadow-lg hover:shadow-xl hover:${card.glowColor}`}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              <div className="relative z-10 text-center">
                <div className={`inline-flex p-3 ${card.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>
                <div className={`text-3xl font-bold ${card.valueColor} mb-1`}>
                  {card.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">{card.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tools + Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Security Tools</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <ToolCard key={index} title={tool.title} link={tool.link} icon={tool.icon} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Recent Activity</span>
          </h3>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <Activity className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-300">No recent activity</p>
              <p className="text-gray-500 text-sm mt-2">Start using our security tools!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/15 hover:bg-white/8 transition-all duration-300 group cursor-default"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium group-hover:text-cyan-300 transition-colors duration-300">{activity.action}</p>
                      <p className="text-gray-500 text-xs mt-1.5">{activity.time}</p>
                    </div>
                    <div className="relative ml-3 mt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        activity.status === 'safe' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                        activity.status === 'success' ? 'bg-blue-400 shadow-lg shadow-blue-400/50' :
                        'bg-amber-400 shadow-lg shadow-amber-400/50'
                      }`}></div>
                      <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping ${
                        activity.status === 'safe' ? 'bg-emerald-400' :
                        activity.status === 'success' ? 'bg-blue-400' :
                        'bg-amber-400'
                      } opacity-30`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h3 className="text-2xl font-bold text-center mb-8 flex justify-center items-center gap-2">
          <Zap className="w-6 h-6 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Quick Security Check</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/phishing-check"
            className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 hover:border-cyan-400/50 text-white font-semibold py-5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
            <Search className="w-6 h-6 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">Check URL</span>
          </Link>

          <Link
            to="/password-tool"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 hover:border-purple-400/50 text-white font-semibold py-5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-600/0 group-hover:from-purple-500/10 group-hover:to-pink-600/10 transition-all duration-500"></div>
            <KeyRound className="w-6 h-6 text-purple-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">Test Password</span>
          </Link>

          <Link
            to="/encrypt-file"
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 hover:border-emerald-400/50 text-white font-semibold py-5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-600/0 group-hover:from-emerald-500/10 group-hover:to-teal-600/10 transition-all duration-500"></div>
            <FileKey className="w-6 h-6 text-emerald-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">Encrypt File</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
