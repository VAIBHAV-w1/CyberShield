import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/phishing-check', label: 'Phishing Check' },
    { path: '/password-tool', label: 'Password Tool' },
    { path: '/encrypt-file', label: 'File Encryption' },

    { path: '/spam-check', label: 'Spam Check' },
    { path: '/deepfake', label: 'Deepfake Detector' },
    { path: '/chatbot', label: 'AI Chatbot' },
    { path: '/threat-dashboard', label: 'Threat Intelligence' }
  ]

  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(location.pathname)

  return (
    <nav className="bg-slate-800 shadow-lg border-b border-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CS</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">CyberShield</h1>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="hidden lg:block">
                  <div className="flex items-baseline space-x-2">
                    {navItems.slice(0, 4).map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`px-2 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
                          location.pathname === item.path
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="hidden md:block">
                    <span className="text-gray-300 text-xs">
                      Welcome, <span className="text-blue-400 font-semibold">{user?.name}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-danger text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 hover:scale-105 text-xs"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/login' ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`btn-primary text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-sm ${
                    location.pathname === '/signup' ? 'bg-blue-700' : ''
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
