import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Shield, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink, Info, Loader2, Globe, CheckCircle2, XCircle, Eye } from 'lucide-react'

const PhishingCheck = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/api/tools/phishing', { url }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check URL')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Phishing': return 'text-red-400'
      case 'Suspicious': return 'text-yellow-400'
      default: return 'text-emerald-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'Phishing': return 'bg-red-500/10 border-red-500/30'
      case 'Suspicious': return 'bg-yellow-500/10 border-yellow-500/30'
      default: return 'bg-emerald-500/10 border-emerald-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Phishing': return <XCircle className="w-8 h-8 text-red-400" />
      case 'Suspicious': return <AlertTriangle className="w-8 h-8 text-yellow-400" />
      default: return <CheckCircle2 className="w-8 h-8 text-emerald-400" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Phishing': return 'bg-red-500/20 text-red-300 border-red-500/40'
      case 'Suspicious': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-2xl border border-cyan-500/20 mb-5">
          <Globe className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Phishing URL Checker</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">Detect suspicious URLs and phishing attempts with AI-powered analysis</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCheck} className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            Enter text to check for phishing
          </label>
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
            placeholder="Paste suspicious text or URL here..."
            rows="5"
            required
          />
          <p className="text-gray-500 text-sm mt-2">Enter URLs, email content, or any text containing links to check for phishing indicators</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scanning URL...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Analyze for Phishing</span>
            </>
          )}
        </button>
      </form>

      {/* Loading Animation */}
      {loading && (
        <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-cyan-500/20">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
              <Eye className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-cyan-300 font-medium">Scanning for phishing indicators...</p>
            <div className="w-48 h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6 animate-fade-in flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 animate-fade-in space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Analysis Result</span>
          </h2>

          {/* Main Result Card */}
          <div className={`rounded-xl p-6 border ${getStatusBg(result.status)}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-white">Security Assessment</h3>
              {getStatusIcon(result.status)}
            </div>

            <div className="space-y-5">
              {/* Analyzed Content */}
              <div className="flex items-start space-x-3">
                <ExternalLink className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm mb-1.5">Analyzed Content</p>
                  <p className="text-gray-300 leading-relaxed bg-black/20 rounded-lg p-3 text-sm max-h-32 overflow-y-auto border border-white/5">
                    {result.url}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getStatusBadge(result.status)}`}>
                    {result.status}
                  </span>
                </div>
              </div>

              {/* Details */}
              {result.details && (
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm mb-1">Details</p>
                    <p className="text-gray-300 leading-relaxed text-sm">{result.details}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Phishing Indicators */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Indicators Checked</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {[
                'Suspicious domain names',
                'URL shortening services',
                'HTTPS certificate issues',
                'Typosquatting attempts',
                'Urgent language patterns',
                'Request for personal information',
                'Unusual sender addresses'
              ].map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2.5 text-gray-300 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  <span className="text-sm">{indicator}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5">
            <h4 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Safety Tips
            </h4>
            <ul className="text-cyan-200/80 text-sm space-y-1.5">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-cyan-400 rounded-full"></span> Always verify URLs before clicking</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-cyan-400 rounded-full"></span> Look for HTTPS and valid certificates</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-cyan-400 rounded-full"></span> Be cautious of unsolicited requests for personal information</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-cyan-400 rounded-full"></span> Use antivirus software with real-time protection</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhishingCheck
