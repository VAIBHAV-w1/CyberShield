import React, { useState } from 'react'
import axios from 'axios'

const SqlCheck = () => {
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
      const response = await axios.post('http://localhost:5000/api/tools/sql-check', { url }, {
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

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">💉 SQL Injection Checker</h1>
        <p className="text-gray-200 text-lg">Detect potential SQL injection vulnerabilities in URLs</p>
      </div>

      <form onSubmit={handleCheck} className="card-gradient rounded-xl p-8 mb-8 border border-white/20 backdrop-blur-sm">
        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">🔗 Enter URL to check</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            placeholder="https://example.com/search?q=test"
            required
          />
          <p className="text-gray-300 text-sm mt-2">Enter a URL with query parameters to check for SQL injection patterns</p>
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
              <span>Check for SQL Injection</span>
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
            <div className={`rounded-lg p-6 border ${result.vulnerable ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Vulnerability Assessment</h3>
                <div className={`text-2xl ${result.vulnerable ? 'text-red-400' : 'text-green-400'}`}>
                  {result.vulnerable ? '🚨' : '✅'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-300">🔗</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold">URL</p>
                    <p className="text-gray-300 text-sm break-all">{result.url}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-blue-300">🛡️</span>
                  <div>
                    <p className="text-white font-semibold">Vulnerable</p>
                    <p className={`font-bold ${result.vulnerable ? 'text-red-400' : 'text-green-400'}`}>
                      {result.vulnerable ? 'Yes - Potential Risk' : 'No - Appears Safe'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-blue-300 mt-1">💬</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Analysis</p>
                    <p className="text-gray-200 leading-relaxed">{result.message}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common SQL Injection Patterns */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🔍</span>
                Common SQL Injection Patterns Checked
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["'", '"', ' OR ', ' AND ', '--', '#', '/*', '*/', 'UNION', 'SELECT'].map((pattern, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    <span className="text-yellow-400">•</span>
                    <code className="bg-black/30 px-2 py-1 rounded text-sm font-mono">{pattern}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-200 text-sm flex items-start">
                <span className="mr-2 mt-0.5">ℹ️</span>
                <span><strong>Recommendation:</strong> This tool performs basic pattern matching. For comprehensive security testing, use professional penetration testing tools and follow OWASP guidelines for secure coding practices.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SqlCheck
