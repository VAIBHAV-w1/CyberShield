import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, LayoutDashboard, Search, KeyRound, FileKey, Unlock, Mail, Image as ImageIcon, Bot, AlertTriangle, LogOut, Menu, X, User } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  // Redirect to login if not authenticated and not on auth pages
  useEffect(() => {
    const token = localStorage.getItem('token')
    const authPages = ['/login', '/signup']
    const isAuthPage = authPages.includes(location.pathname)

    if (!token && !isAuthPage && location.pathname !== '/') {
      navigate('/login')
    }
  }, [location, navigate])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/phishing-check', label: 'Phishing Check', icon: <Search className="w-4 h-4" /> },
    { path: '/password-tool', label: 'Password Tool', icon: <KeyRound className="w-4 h-4" /> },
    { path: '/encrypt-file', label: 'File Encryption', icon: <FileKey className="w-4 h-4" /> },
    { path: '/data-leak-check', label: 'Data Leak', icon: <Unlock className="w-4 h-4" /> },
    { path: '/spam-check', label: 'Spam Check', icon: <Mail className="w-4 h-4" /> },
    { path: '/deepfake', label: 'Deepfake', icon: <ImageIcon className="w-4 h-4" /> },
    { path: '/chatbot', label: 'AI Chatbot', icon: <Bot className="w-4 h-4" /> },
    { path: '/threat-dashboard', label: 'Threats', icon: <AlertTriangle className="w-4 h-4" /> }
  ]

  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(location.pathname)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#0d1326]/90 backdrop-blur-xl shadow-lg shadow-cyan-950/20 border-b border-white/5' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow duration-300 p-0.5">
                 <div className="w-full h-full bg-[#0d1326] rounded-md flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                   <Shield className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors duration-300" />
                 </div>
              </div>
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 opacity-0 blur group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight group-hover:to-cyan-400 transition-all duration-300">CyberShield</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                {navItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-semibold">{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium px-3 py-1.5 rounded-lg transition-all duration-300 text-xs border border-red-500/20 hover:border-red-500/30"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/login' ? 'text-cyan-400 bg-cyan-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-950/95 backdrop-blur-xl border-t border-white/5 animate-fade-in" id="mobile-menu">
          <div className="px-4 py-4 space-y-1">
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 mb-3 border-b border-white/10 hover:bg-white/5 rounded-lg">
                  <div className="p-1.5 bg-cyan-500/20 rounded-md">
                     <User className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Signed in as</span>
                    <span className="text-cyan-400 text-sm font-semibold">{user?.name}</span>
                  </div>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-cyan-500/15 text-cyan-300'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium px-3 py-2.5 rounded-lg transition-all duration-300 text-sm border border-red-500/20 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-gray-300 hover:text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
