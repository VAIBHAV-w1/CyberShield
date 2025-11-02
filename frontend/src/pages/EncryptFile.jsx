import React, { useState, useEffect } from 'react'
import axios from 'axios'

const EncryptFile = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])
  const [file, setFile] = useState(null)
  const [action, setAction] = useState('encrypt')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [key, setKey] = useState('')
  const [iv, setIv] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('action', action)
    if (action === 'decrypt' && key && iv) {
      formData.append('key', key)
      formData.append('iv', iv)
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/api/tools/encrypt-file', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">🔒 File Encryption Tool</h1>
        <p className="text-gray-200 text-lg">Secure your files with AES-256 encryption</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-600 hover:bg-slate-700 transition-all duration-300">
        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">📁 Select File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">⚙️ Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          >
            <option value="encrypt" className="bg-gray-800">🔐 Encrypt</option>
            <option value="decrypt" className="bg-gray-800">🔓 Decrypt</option>
          </select>
        </div>

        {action === 'decrypt' && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-white mb-2 font-semibold">🔑 Encryption Key</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter the encryption key (hex)"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2 font-semibold">🔢 Initialization Vector (IV)</label>
              <input
                type="text"
                value={iv}
                onChange={(e) => setIv(e.target.value)}
                placeholder="Enter the IV (hex)"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{action === 'encrypt' ? '🔐' : '🔓'}</span>
              <span>{action.charAt(0).toUpperCase() + action.slice(1)} File</span>
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
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-600 animate-slide-in hover:bg-slate-700 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <span className="mr-2">✅</span>
            Result
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-blue-300">💬</span>
              <p className="text-white"><strong>Message:</strong> {result.message}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-blue-300">📄</span>
              <p className="text-white"><strong>File:</strong> {result.file}</p>
            </div>
            {result.downloadUrl && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-green-300">⬇️</span>
                  <p className="text-white font-semibold">Download Processed File</p>
                </div>
                <a
                  href={`http://localhost:5000${result.downloadUrl}`}
                  download={result.file}
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Download {result.file}
                </a>
              </div>
            )}
            {result.key && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-green-300">🔑</span>
                  <p className="text-white font-semibold">Encryption Key</p>
                </div>
                <p className="text-gray-300 font-mono text-sm break-all">{result.key}</p>
              </div>
            )}
            {result.iv && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-green-300">🔢</span>
                  <p className="text-white font-semibold">Initialization Vector (IV)</p>
                </div>
                <p className="text-gray-300 font-mono text-sm break-all">{result.iv}</p>
              </div>
            )}
            {action === 'encrypt' && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mt-6">
                <p className="text-yellow-200 text-sm flex items-start">
                  <span className="mr-2 mt-0.5">⚠️</span>
                  <span><strong>Important:</strong> Save your encryption key and IV securely. You will need them to decrypt the file later.</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EncryptFile
