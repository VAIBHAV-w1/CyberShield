import React, { useState, useEffect } from 'react'
import axios from 'axios'

const DataLeakCheck = () => {
  useEffect(() => {
    // Scroll to top when component mounts
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
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🔓 Data Leak Checker</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Check if your email address has been involved in any known data breaches or leaks.
            Stay informed about potential security risks.
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-8 border border-slate-600 hover:bg-slate-700 transition-all duration-300">
          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🔍</span>
                  <span>Check for Data Leaks</span>
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-white mb-6">Results</h3>

              {result.leaks.length === 0 ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h4 className="text-xl font-semibold text-green-400 mb-2">No Data Leaks Found</h4>
                  <p className="text-green-300">
                    Great news! Your email address was not found in any known data breaches.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">⚠️</div>
                      <h4 className="text-xl font-semibold text-red-400">
                        {result.leaks.length} Data Breach{result.leaks.length > 1 ? 'es' : ''} Found
                      </h4>
                    </div>
                    <p className="text-red-300 mb-4">
                      Your email was found in the following data breaches. Consider changing your passwords and enabling two-factor authentication.
                    </p>
                  </div>

                  {result.leaks.map((leak, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="text-lg font-semibold text-white">{leak.name}</h5>
                        <span className="text-sm text-gray-400">{leak.date}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Domain:</span>
                          <span className="text-white ml-2">{leak.domain}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Records:</span>
                          <span className="text-white ml-2">{leak.records.toLocaleString()}</span>
                        </div>
                      </div>

                      {leak.description && (
                        <p className="text-gray-300 mt-4 text-sm">{leak.description}</p>
                      )}

                      {leak.dataClasses && leak.dataClasses.length > 0 && (
                        <div className="mt-4">
                          <span className="text-gray-400 text-sm">Compromised Data:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {leak.dataClasses.map((dataClass, idx) => (
                              <span key={idx} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs">
                                {dataClass}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-600 hover:bg-slate-700 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-4">🔒 Security Tips</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Use unique passwords for different accounts</li>
            <li>• Enable two-factor authentication wherever possible</li>
            <li>• Monitor your accounts regularly for suspicious activity</li>
            <li>• Use a password manager to generate and store strong passwords</li>
            <li>• Be cautious about sharing personal information online</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DataLeakCheck
