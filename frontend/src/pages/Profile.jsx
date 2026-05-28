import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, ShieldCheck, Activity, LogOut, Clock, Zap, Settings, CreditCard, Bell } from 'lucide-react'

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '' })
  const [stats, setStats] = useState({ totalScans: 0, threatsDetected: 0, filesSecured: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

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

  const securityScore = stats.totalScans > 0 
    ? Math.round((1 - stats.threatsDetected / stats.totalScans) * 100) 
    : 100

  const recentActivity = [
    { action: 'Logged in securely', time: 'Just now', icon: <LockIcon />, color: 'emerald' },
    { action: 'Phishing scan completed', time: '2 hours ago', icon: <ActivityIcon />, color: 'cyan' },
    { action: 'File encrypted successfully', time: '1 day ago', icon: <FileIcon />, color: 'purple' },
    { action: 'Password strength checked', time: '3 days ago', icon: <KeyIcon />, color: 'blue' }
  ]

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pt-6">
      
      {/* Header Profile Section */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 p-1">
              <div className="w-full h-full bg-[#0d1326] rounded-full flex items-center justify-center border-4 border-[#0d1326]">
                <User className="w-12 h-12 text-cyan-400" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0d1326] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">{user.name || 'User Profile'}</h1>
            <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-6">
              <Mail className="w-4 h-4 text-cyan-400" />
              {user.email || 'user@example.com'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 font-semibold">Pro Member</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Security Score Badge */}
          <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">Security Score</p>
            <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {securityScore}<span className="text-2xl">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column: Stats & Settings */}
        <div className="space-y-8">
          {/* Lifetime Stats */}
          <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Lifetime Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Zap className="w-5 h-5 text-blue-400" /></div>
                  <span className="text-gray-300">Total Scans</span>
                </div>
                <span className="text-white font-bold text-lg">{stats.totalScans}</span>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg"><Shield className="w-5 h-5 text-red-400" /></div>
                  <span className="text-gray-300">Threats Blocked</span>
                </div>
                <span className="text-white font-bold text-lg">{stats.threatsDetected}</span>
              </div>

              <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg"><ShieldCheck className="w-5 h-5 text-purple-400" /></div>
                  <span className="text-gray-300">Files Encrypted</span>
                </div>
                <span className="text-white font-bold text-lg">{stats.filesSecured}</span>
              </div>
            </div>
          </div>

          {/* Account Settings Menu */}
          <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-violet-400" />
              Settings
            </h3>
            
            <div className="space-y-2">
              <button className="w-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl p-4 flex items-center justify-between text-gray-300 hover:text-white transition-all group">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  Personal Information
                </div>
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl p-4 flex items-center justify-between text-gray-300 hover:text-white transition-all group">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  Security Preferences
                </div>
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl p-4 flex items-center justify-between text-gray-300 hover:text-white transition-all group">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  Notifications
                </div>
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl p-4 flex items-center justify-between text-gray-300 hover:text-white transition-all group">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  Subscription
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Recent Activity Log
              </h3>
              <span className="text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium">View All</span>
            </div>

            <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pl-8">
              {recentActivity.map((activity, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[41px] bg-[#0d1326] p-1 rounded-full`}>
                    <div className={`w-4 h-4 rounded-full bg-${activity.color}-500/20 border-2 border-${activity.color}-400 flex items-center justify-center`}></div>
                  </div>
                  
                  <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-2xl p-5">
                    <p className="text-white font-medium mb-1">{activity.action}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Load more indicator */}
              <div className="relative">
                 <div className={`absolute -left-[41px] bg-[#0d1326] p-1 rounded-full`}>
                    <div className="w-4 h-4 rounded-full bg-gray-500/20 border-2 border-gray-500 flex items-center justify-center"></div>
                  </div>
                  <p className="text-gray-500 text-sm font-medium pt-1">End of recent history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper icons for the activity list since we can't map components easily without importing them all
const LockIcon = () => <Shield className="w-4 h-4" />
const ActivityIcon = () => <Activity className="w-4 h-4" />
const FileIcon = () => <ShieldCheck className="w-4 h-4" />
const KeyIcon = () => <Zap className="w-4 h-4" />

export default Profile
