import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ThreatDashboard = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    // Scroll to top when component mounts
    window.scrollTo(0, 0)

    return () => clearTimeout(timer)
  }, [])

  const securityTips = [
    {
      icon: '🔐',
      title: 'Use Strong Passwords',
      description: 'Create passwords with at least 12 characters, mixing letters, numbers, and symbols.'
    },
    {
      icon: '📱',
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your accounts with 2FA whenever possible.'
    },
    {
      icon: '🔄',
      title: 'Keep Software Updated',
      description: 'Regularly update your operating system and applications to patch security vulnerabilities.'
    },
    {
      icon: '🎣',
      title: 'Be Careful with Links',
      description: 'Don\'t click on suspicious links in emails or messages. Verify URLs before clicking.'
    },
    {
      icon: '🛡️',
      title: 'Use Antivirus Software',
      description: 'Install and maintain reputable antivirus software to protect against malware.'
    },
    {
      icon: '🔒',
      title: 'Lock Your Devices',
      description: 'Always lock your computer and phone when not in use to prevent unauthorized access.'
    }
  ]

  const recentNews = [
    {
      title: 'New Phishing Campaign Targets Banking Apps',
      date: '2 days ago',
      summary: 'Cybercriminals are using fake banking apps to steal login credentials. Always download apps from official stores.'
    },
    {
      title: 'Password Manager Security Best Practices',
      date: '1 week ago',
      summary: 'Using a password manager is great, but remember to use a strong master password and enable biometric login.'
    },
    {
      title: 'Social Media Privacy Settings Update',
      date: '2 weeks ago',
      summary: 'Major social platforms have updated their privacy settings. Review and adjust yours to protect your personal information.'
    }
  ]

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">🛡️ Security Center</h1>
          <p className="text-gray-300 text-lg">Loading security information...</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">🛡️ Security Center</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Stay informed and protected with essential cybersecurity tips and updates
        </p>
      </div>

      {/* Security Score */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-600 hover:bg-slate-700 transition-all duration-300 mb-8 text-center">
        <div className="text-6xl mb-4">🛡️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Security Score</h2>
        <div className="text-5xl font-bold text-green-400 mb-4">85%</div>
        <p className="text-gray-300 mb-4">Good! You're doing well, but there's room for improvement.</p>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div className="bg-green-400 h-3 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
        </div>
        <p className="text-sm text-gray-400">Based on your recent activity and security practices</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-600 hover:bg-slate-700 transition-all duration-300 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Security Check</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/password-tool"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105"
          >
            <span className="text-2xl">🔐</span>
            <span>Test Password</span>
          </Link>

          <Link
            to="/data-leak-check"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105"
          >
            <span className="text-2xl">🔓</span>
            <span>Check Data Leaks</span>
          </Link>

          <Link
            to="/phishing-check"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105"
          >
            <span className="text-2xl">🎣</span>
            <span>Check URL</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Security Tips */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-600 hover:bg-slate-700 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2">💡</span>
            Security Tips
          </h2>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {securityTips.map((tip, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm mb-1">{tip.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security News */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-600 hover:bg-slate-700 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2">📰</span>
            Security News
          </h2>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentNews.map((news, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white text-sm mb-2">{news.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">{news.summary}</p>
                <p className="text-gray-400 text-xs">{news.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Security Checklist */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-600 hover:bg-slate-700 transition-all duration-300">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Daily Security Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-300 text-sm">Check for software updates</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-300 text-sm">Review account activity</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">○</span>
            </div>
            <span className="text-gray-300 text-sm">Backup important files</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">○</span>
            </div>
            <span className="text-gray-300 text-sm">Change old passwords</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreatDashboard
