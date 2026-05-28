import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Unlock, ShieldAlert, CheckCircle2, Shield, Info, AlertTriangle, Loader2 } from 'lucide-react'

const DataLeakCheck = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter an email address')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/api/tools/data-leak-check', {
        email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check data leaks')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-gradient-to-br from-blue-500/15 to-indigo-600/15 rounded-2xl border border-blue-500/20 mb-5">
          <Unlock className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Data Leak Checker</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Check if your email address has been involved in any known data breaches or leaks.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleCheck} className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
        <div className="mb-6">
          <label htmlFor="email" className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
            <Search className="w-4 h-4 text-blue-400" />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Check for Data Leaks</span>
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
        <div className="animate-fade-in space-y-6">
          {result.leaks.length === 0 ? (
            <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30 text-center">
              <div className="inline-flex p-4 bg-emerald-500/10 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h4 className="text-2xl font-bold text-emerald-400 mb-2">No Data Leaks Found</h4>
              <p className="text-emerald-200/80">
                Great news! Your email address was not found in any known data breaches.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <ShieldAlert className="w-8 h-8 text-red-400 mr-3" />
                  <h4 className="text-xl font-bold text-red-400">
                    {result.leaks.length} Data Breach{result.leaks.length > 1 ? 'es' : ''} Found
                  </h4>
                </div>
                <p className="text-red-200/80">
                  Your email was found in the following data breaches. Consider changing your passwords and enabling two-factor authentication.
                </p>
              </div>

              <div className="space-y-4">
                {result.leaks.map((leak, index) => (
                  <div key={index} className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-red-500/30 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{leak.name}</h5>
                      <span className="text-sm font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full">{leak.date}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="text-gray-400 block mb-1">Domain:</span>
                        <span className="text-white font-medium">{leak.domain}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className="text-gray-400 block mb-1">Records Compromised:</span>
                        <span className="text-white font-medium">{leak.records.toLocaleString()}</span>
                      </div>
                    </div>

                    {leak.description && (
                      <p className="text-gray-300 mt-4 text-sm leading-relaxed border-t border-white/10 pt-4">{leak.description}</p>
                    )}

                    {leak.dataClasses && leak.dataClasses.length > 0 && (
                      <div className="mt-4">
                        <span className="text-gray-400 text-sm block mb-2">Compromised Data Classes:</span>
                        <div className="flex flex-wrap gap-2">
                          {leak.dataClasses.map((dataClass, idx) => (
                            <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1.5 rounded-lg text-xs font-medium">
                              {dataClass}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Tips
        </h3>
        <ul className="space-y-2 text-blue-200/80 text-sm">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Use unique passwords for different accounts</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Enable two-factor authentication wherever possible</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Monitor your accounts regularly for suspicious activity</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Use a password manager to generate and store strong passwords</li>
        </ul>
      </div>
    </div>
  )
}

export default DataLeakCheck
