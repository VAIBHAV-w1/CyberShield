import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Settings, BookOpen, Phone, Mail, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  }, [location])

  return (
    <footer className="bg-[#0a0f1d] text-white py-12 mt-12 animate-fade-in border-t border-white/10 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-slide-in">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              CyberShield
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm pr-4">
              Your comprehensive cybersecurity toolkit for staying safe online.
              Protect yourself from digital threats with our advanced security tools.
            </p>
          </div>
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-200">
              <Settings className="w-5 h-5 text-cyan-400" />
              Tools
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/phishing-check" className="hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500 rounded-full"></span> Phishing Detection</Link></li>
              <li><Link to="/password-tool" className="hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500 rounded-full"></span> Password Security</Link></li>
              <li><Link to="/encrypt-file" className="hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500 rounded-full"></span> File Encryption</Link></li>
              <li><Link to="/deepfake" className="hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500 rounded-full"></span> Deepfake Analysis</Link></li>
              <li><Link to="/threat-dashboard" className="hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500 rounded-full"></span> Threat Monitoring</Link></li>
              <li><Link to="/chatbot" className="hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500 rounded-full"></span> AI Assistant</Link></li>
            </ul>
          </div>
          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-200">
              <BookOpen className="w-5 h-5 text-violet-400" />
              Resources
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/threat-dashboard" className="hover:text-violet-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-violet-500 rounded-full"></span> Security Guides</Link></li>
              <li><Link to="/threat-dashboard" className="hover:text-violet-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-violet-500 rounded-full"></span> Latest Threats</Link></li>
              <li><Link to="/chatbot" className="hover:text-violet-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-violet-500 rounded-full"></span> Tutorials</Link></li>
              <li><Link to="/dashboard" className="hover:text-violet-300 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 bg-violet-500 rounded-full"></span> Statistics</Link></li>
            </ul>
          </div>
          <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-200">
              <Phone className="w-5 h-5 text-emerald-400" />
              Contact
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              For support or inquiries, please reach out to our team.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:support@cybershield.com" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300 text-gray-400">
                <Mail className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-300 text-gray-400">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-400 transition-all duration-300 text-gray-400">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">
          <p className="text-sm">
            &copy; 2026 CyberShield. All rights reserved.
            {isLoggedIn && user && (
              <>
                <span className="mx-2">•</span>
                <span>Logged in as: <Link to="/profile" className="text-cyan-400 hover:text-cyan-300 transition-all font-semibold hover:underline">{user.name}</Link></span>
              </>
            )}
            <span className="mx-2">•</span>
            <a href="https://www.cisa.gov/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors duration-300 cursor-pointer">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="https://www.cisa.gov/terms-use" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors duration-300 cursor-pointer">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
