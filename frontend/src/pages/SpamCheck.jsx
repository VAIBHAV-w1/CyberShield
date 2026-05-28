import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Mail, Search, AlertTriangle, ShieldCheck, ShieldAlert, Loader2, Info } from 'lucide-react'

const SpamCheck = () => {
  useEffect(() => {
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

  const isSpam = result?.classification?.toLowerCase() === 'spam'

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-gradient-to-br from-amber-500/15 to-orange-600/15 rounded-2xl border border-amber-500/20 mb-5">
          <Mail className="w-10 h-10 text-amber-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Spam Detection</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">Analyze text content for potential spam patterns and phishing indicators</p>
      </div>

      <form onSubmit={handleCheck} className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
            <Search className="w-4 h-4 text-amber-400" />
            Enter text to analyze
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 resize-none"
            rows="8"
            placeholder="Paste the email content or message here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !text}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold py-3.5 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/25 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Analyze Content</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6 animate-fade-in flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 animate-fade-in space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Search className="w-6 h-6 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Analysis Result</span>
          </h2>

          <div className={`rounded-xl p-6 border ${isSpam ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-white">Classification</h3>
              {isSpam ? <ShieldAlert className="w-8 h-8 text-red-400" /> : <ShieldCheck className="w-8 h-8 text-emerald-400" />}
            </div>

            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm mb-1.5">Analyzed Text</p>
                  <p className="text-gray-300 leading-relaxed bg-black/20 rounded-lg p-3 text-sm max-h-32 overflow-y-auto border border-white/5">
                    {result.text}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${
                    isSpam ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {result.classification}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              Indicators Checked
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {[
                'Excessive capitalization',
                'Too many exclamation marks',
                'Urgent language',
                'Suspicious links',
                'Generic greetings',
                'Money-related keywords',
                'Unusual sender patterns'
              ].map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2.5 text-gray-300 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span className="text-sm">{indicator}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
             <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
               <Info className="w-5 h-5" />
               Note
             </h4>
             <p className="text-blue-200/80 text-sm">
               This tool uses basic pattern recognition. For advanced spam detection, consider using professional email filtering services or machine learning-based solutions.
             </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpamCheck
