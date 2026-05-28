import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ShieldCheck, Lock, Smartphone, RefreshCw, AlertTriangle, ShieldAlert, FileText, CheckCircle2, ChevronRight, Activity, Zap, Search, KeyRound } from 'lucide-react'

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
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: 'Use Strong Passwords',
      description: 'Create passwords with at least 12 characters, mixing letters, numbers, and symbols.'
    },
    {
      icon: <Smartphone className="w-6 h-6 text-blue-400" />,
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your accounts with 2FA whenever possible.'
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-cyan-400" />,
      title: 'Keep Software Updated',
      description: 'Regularly update your operating system and applications to patch security vulnerabilities.'
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      title: 'Be Careful with Links',
      description: 'Don\'t click on suspicious links in emails or messages. Verify URLs before clicking.'
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
      title: 'Use Antivirus Software',
      description: 'Install and maintain reputable antivirus software to protect against malware.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: 'Lock Your Devices',
      description: 'Always lock your computer and phone when not in use to prevent unauthorized access.'
    }
  ]

  const recentNews = [
    {
      title: 'New Phishing Campaign Targets Banking Apps',
      date: '2 days ago',
      summary: 'Cybercriminals are using fake banking apps to steal login credentials. Always download apps from official stores.',
      tag: 'Phishing',
      tagColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      link: 'https://www.cisa.gov/news-events/cybersecurity-advisories'
    },
    {
      title: 'Password Manager Security Best Practices',
      date: '1 week ago',
      summary: 'Using a password manager is great, but remember to use a strong master password and enable biometric login.',
      tag: 'Best Practices',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      link: 'https://www.cisa.gov/secure-our-world/use-strong-passwords'
    },
    {
      title: 'Social Media Privacy Settings Update',
      date: '2 weeks ago',
      summary: 'Major social platforms have updated their privacy settings. Review and adjust yours to protect your personal information.',
      tag: 'Privacy',
      tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      link: 'https://www.cisa.gov/secure-our-world/social-media-privacy-settings'
    }
  ]

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
          <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Security Center</h2>
        <p className="text-gray-400">Fetching latest threats and updates...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-2xl border border-cyan-500/20 mb-5">
          <Activity className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Threat Intelligence Dashboard</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Stay informed and protected with essential cybersecurity updates and best practices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Security Score */}
        <div className="lg:col-span-1 bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 text-center flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="inline-flex p-4 bg-emerald-500/10 rounded-full mb-6 ring-4 ring-emerald-500/20">
              <ShieldCheck className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Security Posture</h2>
            <div className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              85<span className="text-4xl">%</span>
            </div>
            <p className="text-gray-300 mb-6 text-sm">Good! You're doing well, but there's room for improvement.</p>
            
            <div className="w-full bg-black/40 rounded-full h-3 mb-2 overflow-hidden border border-white/5">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full relative" style={{width: '85%'}}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-30"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Overall Protection Level</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Quick Security Actions</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/password-tool"
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 text-white font-semibold py-5 px-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 group hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="p-3 bg-purple-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <KeyRound className="w-7 h-7 text-purple-400" />
              </div>
              <span>Test Password</span>
            </Link>

            <Link
              to="/data-leak-check"
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 text-white font-semibold py-5 px-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 group hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <Unlock className="w-7 h-7 text-blue-400" />
              </div>
              <span>Check Leaks</span>
            </Link>

            <Link
              to="/phishing-check"
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-white font-semibold py-5 px-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 group hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7 text-cyan-400" />
              </div>
              <span>Check URL</span>
            </Link>
          </div>
          
          {/* Daily Checklist */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Security Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-gray-300 text-sm">Check for software updates</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-gray-300 text-sm">Review account activity</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="w-5 h-5 rounded-full border-2 border-amber-500/50 flex items-center justify-center shrink-0"></div>
                <span className="text-gray-300 text-sm">Backup important files</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="w-5 h-5 rounded-full border-2 border-amber-500/50 flex items-center justify-center shrink-0"></div>
                <span className="text-gray-300 text-sm">Change old passwords</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Security Tips */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Best Practices</span>
          </h2>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {securityTips.map((tip, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-black/30 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1.5">{tip.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security News */}
        <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Security Briefings</span>
          </h2>

          <div className="space-y-4">
            {recentNews.map((news, index) => (
              <a
                key={index}
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 rounded-xl p-5 border border-white/5 hover:bg-white/10 hover:border-white/15 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 block cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${news.tagColor}`}>
                    {news.tag}
                  </span>
                  <span className="text-gray-500 text-xs font-medium">{news.date}</span>
                </div>
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-blue-400 transition-colors">{news.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{news.summary}</p>
                <div className="flex items-center text-blue-400 text-sm font-medium">
                  Read more <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreatDashboard
