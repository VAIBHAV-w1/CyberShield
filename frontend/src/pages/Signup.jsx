import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  RefreshCw,
  CheckCircle
} from 'lucide-react'

const Signup = () => {
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // OTP state
  const [step, setStep] = useState(1) // 1 = form, 2 = OTP
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Resend OTP countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  // Auto-focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpRefs[0].current?.focus()
      }, 400)
    }
  }, [step])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleOtpChange = useCallback((index, value) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)
    if (value && index < 5) otpRefs[index + 1].current?.focus()
  }, [otpValues])

  const handleOtpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current?.focus()
    }
  }, [otpValues])

  const handleOtpPaste = useCallback((e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasteData.length > 0) {
      const newOtp = [...otpValues]
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasteData[i] || ''
      }
      setOtpValues(newOtp)
      const focusIndex = Math.min(pasteData.length, 5)
      otpRefs[focusIndex].current?.focus()
    }
  }, [otpValues])

  // Step 1: Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      setSuccess(response.data.message || 'OTP sent to your email!')
      setStep(2)
      setResendTimer(60)
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const otp = otpValues.join('')
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-signup-otp', {
        email: formData.email,
        otp
      })

      // Store token and user data
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      setSuccess('Account verified successfully! Redirecting...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed')
      setOtpValues(['', '', '', '', '', ''])
      otpRefs[0].current?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      setSuccess(response.data.message || 'OTP resent successfully!')
      setResendTimer(60)
      setOtpValues(['', '', '', '', '', ''])
      otpRefs[0].current?.focus()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <Shield className="h-10 w-10 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {step === 1 ? 'Create Account' : 'Verify Identity'}
          </h2>
          <p className="text-gray-400">
            {step === 1
              ? 'Join CyberShield for advanced security tools'
              : `Enter the 6-digit code sent to ${formData.email}`}
          </p>
        </div>

        {/* Main card with animated gradient border */}
        <div className="relative group">
          {/* Gradient border glow */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 opacity-60 blur-sm group-hover:opacity-80 transition-opacity duration-500" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20" />

          {/* Card content */}
          <div className="relative rounded-2xl bg-[#0d1224]/90 backdrop-blur-xl p-8 border border-white/[0.08]">

            {/* Step 1: Registration Form */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                step === 1
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 hidden'
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all duration-300"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error alert */}
                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5">
                    <div className="w-1 h-8 bg-red-500 rounded-full shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Success alert */}
                {success && (
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <p className="text-emerald-300 text-sm">{success}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Step 2: OTP Verification */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                step === 2
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 hidden'
              }`}
            >
              <div className="text-center mb-6">
                <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <KeyRound className="h-7 w-7 text-cyan-400" />
                </div>
                <p className="text-sm text-gray-400">
                  A verification code has been sent to your email.
                  <br />
                  Please enter it below.
                </p>
              </div>

              {/* OTP Input boxes */}
              <div className="flex justify-center gap-3 mb-6" onPaste={handleOtpPaste}>
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-white/[0.04] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 caret-cyan-400"
                  />
                ))}
              </div>

              {/* Error alert */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 mb-4">
                  <div className="w-1 h-8 bg-red-500 rounded-full shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Success alert */}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 mb-4">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-emerald-300 text-sm">{success}</p>
                </div>
              )}

              {/* Verify button */}
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otpValues.join('').length !== 6}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Verify & Create Account</span>
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : 'Resend OTP'}
                </button>
              </div>

              {/* Back to form */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setStep(1)
                    setError('')
                    setSuccess('')
                    setOtpValues(['', '', '', '', '', ''])
                  }}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  ← Back to registration
                </button>
              </div>
            </div>

            {/* Sign in link */}
            <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-gray-600">
            <Lock className="h-3 w-3" />
            <span>Protected by 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
