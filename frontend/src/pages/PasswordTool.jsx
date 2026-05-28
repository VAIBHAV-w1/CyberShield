import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { KeyRound, Shield, ShieldCheck, ShieldAlert, AlertTriangle, Copy, Check, RefreshCw, Loader2, Lock, Sparkles, Info, Eye, EyeOff } from 'lucide-react'

const PasswordTool = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(null)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    setCopied(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStrengthColor = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'weak': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'strong': return 'text-emerald-400'
      default: return 'text-gray-400'
    }
  }

  const getStrengthBg = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'weak': return 'bg-red-500/10 border-red-500/30'
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'strong': return 'bg-emerald-500/10 border-emerald-500/30'
      default: return 'bg-gray-500/10 border-gray-500/30'
    }
  }

  const getStrengthIcon = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'weak': return <AlertTriangle className="w-8 h-8 text-red-400" />
      case 'medium': return <ShieldAlert className="w-8 h-8 text-yellow-400" />
      case 'strong': return <ShieldCheck className="w-8 h-8 text-emerald-400" />
      default: return <Shield className="w-8 h-8 text-gray-400" />
    }
  }

  const getStrengthBarWidth = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'weak': return '33%'
      case 'medium': return '66%'
      case 'strong': return '100%'
      default: return '0%'
    }
  }

  const getStrengthBarColor = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'weak': return 'from-red-500 to-red-400'
      case 'medium': return 'from-yellow-500 to-amber-400'
      case 'strong': return 'from-emerald-500 to-green-400'
      default: return 'from-gray-500 to-gray-400'
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-gradient-to-br from-purple-500/15 to-pink-600/15 rounded-2xl border border-purple-500/20 mb-5">
          <KeyRound className="w-10 h-10 text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Password Security Tool</span>
        </h1>
        <p className="text-gray-400 text-lg">Check password strength and generate secure passwords</p>
      </div>

      {/* Password Strength Checker */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-400" />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Check Password Strength</span>
        </h2>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
            <Lock className="w-4 h-4 text-purple-400" />
            Enter password to check
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 pr-12"
              placeholder="Enter password to check"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          onClick={checkStrength}
          disabled={!password || loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold py-3.5 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              <span>Check Strength</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-fade-in">
            <p className="text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {error}
            </p>
          </div>
        )}

        {strength && !error && (
          <div className={`mt-6 rounded-xl p-6 border animate-fade-in ${getStrengthBg(strength)}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Password Strength Analysis</h3>
              {getStrengthIcon(strength)}
            </div>

            {/* Strength Meter Bar */}
            <div className="mb-5">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getStrengthBarColor(strength)} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: getStrengthBarWidth(strength) }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Weak</span>
                <span>Medium</span>
                <span>Strong</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${
                strength?.toLowerCase() === 'weak' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                strength?.toLowerCase() === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                <span className="capitalize">{strength}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Generator */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Generate Secure Password</span>
        </h2>

        <button
          onClick={generatePassword}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2 mb-6"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Generate Password</span>
        </button>

        {generatedPassword && (
          <div className="bg-white/5 rounded-xl p-6 animate-fade-in border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Generated Password</h3>
              <button
                onClick={() => copyToClipboard(generatedPassword)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <p className="font-mono text-xl text-cyan-300 break-all tracking-wider">{generatedPassword}</p>
            </div>

            <div className="mt-4 flex gap-4 text-gray-400 text-sm">
              <p><span className="text-gray-300 font-medium">Length:</span> 16 characters</p>
              <p><span className="text-gray-300 font-medium">Contains:</span> Mixed case, numbers, symbols</p>
            </div>
          </div>
        )}

        {/* Password Tips */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 mt-6">
          <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Password Best Practices
          </h4>
          <ul className="text-purple-200/80 text-sm space-y-1.5">
            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-400 rounded-full"></span> Use at least 12-16 characters</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-400 rounded-full"></span> Include uppercase and lowercase letters</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-400 rounded-full"></span> Add numbers and special characters</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-400 rounded-full"></span> Avoid using personal information</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-400 rounded-full"></span> Use unique passwords for different accounts</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-400 rounded-full"></span> Consider using a password manager</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PasswordTool
