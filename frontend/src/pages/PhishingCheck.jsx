import React, { useState, useEffect } from 'react'
import axios from 'axios'

const PhishingCheck = () => {
  useEffect(() => {
    // Scroll to top when component mounts
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
      default: return 'text-green-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'Phishing': return 'bg-red-500/20 border-red-500/30'
      case 'Suspicious': return 'bg-yellow-500/20 border-yellow-500/30'
      default: return 'bg-green-500/20 border-green-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Phishing': return '🚨'
      case 'Suspicious': return '⚠️'
      default: return '✅'
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">🎣 Phishing URL Checker</h1>
        <p className="text-gray-200 text-lg">Detect suspicious URLs and phishing attempts</p>
      </div>

      <form onSubmit={handleCheck} className="card-gradient rounded-xl p-8 mb-8 border border-white/20 backdrop-blur-sm">
        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">🔗 Enter text to check for phishing</label>
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
            placeholder="Paste suspicious text or URL here..."
            rows="6"
            required
          />
          <p className="text-gray-300 text-sm mt-2">Enter URLs, email content, or any text containing links to check for phishing indicators</p>
        </div>

        <button
          type="submit"
          disabled={loading}
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
              <span>Check URL</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 animate-slide-in">
          <p className="text-red-300 flex items-center">
            <span className="mr-2">❌</span>
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="card-gradient rounded-xl p-8 border border-white/20 backdrop-blur-sm animate-slide-in">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <span className="mr-2">📊</span>
            Analysis Result
          </h2>

          <div className="space-y-6">
            {/* Main Result */}
            <div className={`rounded-lg p-6 border ${getStatusBg(result.status)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Security Assessment</h3>
                <div className={`text-2xl ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-300 mt-1">📝</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Analyzed Content</p>
                    <p className="text-gray-200 leading-relaxed bg-white/5 rounded-lg p-3 mt-1 max-h-32 overflow-y-auto">
                      {result.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-blue-300">🛡️</span>
                  <div>
                    <p className="text-white font-semibold">Status</p>
                    <p className={`font-bold text-lg ${getStatusColor(result.status)}`}>
                      {result.status}
                    </p>
                  </div>
                </div>

                {result.details && (
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-300 mt-1">💬</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Details</p>
                      <p className="text-gray-200 leading-relaxed">{result.details}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phishing Indicators */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🔍</span>
                Common Phishing Indicators Checked
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Suspicious domain names',
                  'URL shortening services',
                  'HTTPS certificate issues',
                  'Typosquatting attempts',
                  'Urgent language patterns',
                  'Request for personal information',
                  'Unusual sender addresses'
                ].map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    <span className="text-yellow-400">•</span>
                    <span className="text-sm">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-200 font-semibold mb-2">🛡️ Safety Tips:</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Always verify URLs before clicking</li>
                <li>• Look for HTTPS and valid certificates</li>
                <li>• Be cautious of unsolicited requests for personal information</li>
                <li>• Use antivirus software with real-time protection</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhishingCheck
