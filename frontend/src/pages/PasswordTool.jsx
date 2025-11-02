import React, { useState, useEffect } from 'react'
import axios from 'axios'

const PasswordTool = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(null)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkStrength = async () => {
    if (!password) return

    setLoading(true)
    setError('')
    setStrength(null)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/api/tools/password-check', { password }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setStrength(response.data.strength)
    } catch (error) {
      setError('Error checking password strength')
      setStrength('Error')
    } finally {
      setLoading(false)
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setGeneratedPassword(result)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const getStrengthColor = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'weak': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'strong': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getStrengthBg = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'weak': return 'bg-red-500/20 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30'
      case 'strong': return 'bg-green-500/20 border-green-500/30'
      default: return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStrengthIcon = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'weak': return '❌'
      case 'medium': return '⚠️'
      case 'strong': return '✅'
      default: return '❓'
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">🔐 Password Security Tool</h1>
        <p className="text-gray-200 text-lg">Check password strength and generate secure passwords</p>
      </div>

      {/* Password Strength Checker */}
      <div className="card-gradient rounded-xl p-8 mb-8 border border-white/20 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
          <span className="mr-2">🛡️</span>
          Check Password Strength
        </h2>

        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">🔑 Enter password to check</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            placeholder="Enter password to check"
          />
        </div>

        <button
          onClick={checkStrength}
          disabled={!password || loading}
          className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Checking...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Check Strength</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-4 animate-slide-in">
            <p className="text-red-300 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          </div>
        )}

        {strength && !error && (
          <div className={`mt-6 rounded-lg p-6 border animate-slide-in ${getStrengthBg(strength)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Password Strength Analysis</h3>
              <div className={`text-2xl ${getStrengthColor(strength)}`}>
                {getStrengthIcon(strength)}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-blue-300">📊</span>
              <div>
                <p className="text-white font-semibold">Strength Level</p>
                <p className={`font-bold text-lg capitalize ${getStrengthColor(strength)}`}>
                  {strength}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Generator */}
      <div className="card-gradient rounded-xl p-8 border border-white/20 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
          <span className="mr-2">🎲</span>
          Generate Secure Password
        </h2>

        <button
          onClick={generatePassword}
          className="w-full btn-secondary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 mb-6"
        >
          <span>🔄</span>
          <span>Generate Password</span>
        </button>

        {generatedPassword && (
          <div className="bg-white/5 rounded-lg p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generated Password</h3>
              <button
                onClick={() => copyToClipboard(generatedPassword)}
                className="text-blue-300 hover:text-blue-200 transition-colors duration-300 flex items-center space-x-1"
              >
                <span>📋</span>
                <span className="text-sm">Copy</span>
              </button>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <p className="font-mono text-xl text-white break-all">{generatedPassword}</p>
            </div>

            <div className="mt-4 text-gray-300 text-sm">
              <p><strong>Length:</strong> 16 characters</p>
              <p><strong>Contains:</strong> Uppercase, lowercase, numbers, and special characters</p>
            </div>
          </div>
        )}

        {/* Password Tips */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mt-6">
          <h4 className="text-blue-200 font-semibold mb-2">💡 Password Best Practices:</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Use at least 12-16 characters</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Add numbers and special characters</li>
            <li>• Avoid using personal information</li>
            <li>• Use unique passwords for different accounts</li>
            <li>• Consider using a password manager</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PasswordTool
