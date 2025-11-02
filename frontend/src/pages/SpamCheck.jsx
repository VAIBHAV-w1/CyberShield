import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SpamCheck = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])
  const [text, setText] = useState('')
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
      const response = await axios.post('http://localhost:5000/api/tools/spam-check', { text }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze text')
    } finally {
      setLoading(false)
    }
  }

  const getClassificationColor = (classification) => {
    return classification.toLowerCase() === 'spam' ? 'text-red-400' : 'text-green-400'
  }

  const getClassificationBg = (classification) => {
    return classification.toLowerCase() === 'spam' ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30'
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">📧 Spam Detection Tool</h1>
        <p className="text-gray-200 text-lg">Analyze text content for potential spam patterns</p>
      </div>

      <form onSubmit={handleCheck} className="card-gradient rounded-xl p-8 mb-8 border border-white/20 backdrop-blur-sm">
        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">📝 Enter text to analyze</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
            rows="8"
            placeholder="Paste the text content here..."
            required
          />
          <p className="text-gray-300 text-sm mt-2">Enter email content, messages, or any text to check for spam characteristics</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Check for Spam</span>
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
            <div className={`rounded-lg p-6 border ${getClassificationBg(result.classification)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Content Classification</h3>
                <div className={`text-2xl ${getClassificationColor(result.classification)}`}>
                  {result.classification.toLowerCase() === 'spam' ? '🚨' : '✅'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-300 mt-1">📝</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Analyzed Text</p>
                    <p className="text-gray-200 leading-relaxed bg-white/5 rounded-lg p-3 mt-1 max-h-32 overflow-y-auto">
                      {result.text}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-blue-300">🏷️</span>
                  <div>
                    <p className="text-white font-semibold">Classification</p>
                    <p className={`font-bold text-lg ${getClassificationColor(result.classification)}`}>
                      {result.classification}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spam Indicators */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🔍</span>
                Common Spam Indicators Checked
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Excessive capitalization',
                  'Too many exclamation marks',
                  'Urgent language',
                  'Suspicious links',
                  'Generic greetings',
                  'Money-related keywords',
                  'Unusual sender patterns'
                ].map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    <span className="text-yellow-400">•</span>
                    <span className="text-sm">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-200 text-sm flex items-start">
                <span className="mr-2 mt-0.5">ℹ️</span>
                <span><strong>Note:</strong> This tool uses basic pattern recognition. For advanced spam detection, consider using professional email filtering services or machine learning-based solutions.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpamCheck
