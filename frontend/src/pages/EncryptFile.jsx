import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FileKey, Lock, Unlock, Upload, Download, Key, Hash, Loader2, Copy, Check, AlertTriangle, CheckCircle2, File, ShieldCheck, Info } from 'lucide-react'

const EncryptFile = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [file, setFile] = useState(null)
  const [action, setAction] = useState('encrypt')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [key, setKey] = useState('')
  const [iv, setIv] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedIv, setCopiedIv] = useState(false)

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

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const copyValue = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'key') {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } else {
      setCopiedIv(true)
      setTimeout(() => setCopiedIv(false), 2000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500/15 to-teal-600/15 rounded-2xl border border-emerald-500/20 mb-5">
          <FileKey className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">File Encryption Tool</span>
        </h1>
        <p className="text-gray-400 text-lg">Secure your files with AES-256 encryption</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
        {/* Drag & Drop File Zone */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
            <Upload className="w-4 h-4 text-emerald-400" />
            Select File
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              dragOver
                ? 'border-emerald-400 bg-emerald-500/10'
                : file
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/15 bg-white/5 hover:border-emerald-500/30 hover:bg-white/8'
            }`}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              required
            />
            {file ? (
              <div className="flex flex-col items-center">
                <div className="p-3 bg-emerald-500/15 rounded-xl mb-3">
                  <File className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-emerald-300 font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white/5 rounded-xl mb-3">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-300 font-medium">Drop your file here or click to browse</p>
                <p className="text-gray-500 text-sm mt-1">Supports any file type</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Action
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAction('encrypt')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 ${
                action === 'encrypt'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Lock className="w-5 h-5" />
              Encrypt
            </button>
            <button
              type="button"
              onClick={() => setAction('decrypt')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 ${
                action === 'decrypt'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Unlock className="w-5 h-5" />
              Decrypt
            </button>
          </div>
        </div>

        {/* Decrypt Fields */}
        {action === 'decrypt' && (
          <div className="mb-6 space-y-4 animate-fade-in">
            <div>
              <label className="flex items-center gap-2 text-white mb-2 font-semibold text-sm">
                <Key className="w-4 h-4 text-blue-400" />
                Encryption Key
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter the encryption key (hex)"
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-white mb-2 font-semibold text-sm">
                <Hash className="w-4 h-4 text-blue-400" />
                Initialization Vector (IV)
              </label>
              <input
                type="text"
                value={iv}
                onChange={(e) => setIv(e.target.value)}
                placeholder="Enter the IV (hex)"
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full text-white font-semibold py-3.5 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 ${
            action === 'encrypt'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/25'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 hover:shadow-blue-500/25'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {action === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              <span>{action.charAt(0).toUpperCase() + action.slice(1)} File</span>
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6 animate-fade-in flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Result</span>
          </h2>

          <div className="space-y-4">
            {/* Message */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
              <Info className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-white"><span className="text-gray-400 font-medium">Message:</span> {result.message}</p>
            </div>

            {/* File */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
              <File className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-white"><span className="text-gray-400 font-medium">File:</span> {result.file}</p>
            </div>

            {/* Download */}
            {(result.dataUrl || result.downloadUrl) && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <Download className="w-5 h-5 text-emerald-400" />
                  <p className="text-white font-semibold">Download Processed File</p>
                </div>
                <a
                  href={result.dataUrl || `http://localhost:5000${result.downloadUrl}`}
                  download={result.file}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  <Download className="w-4 h-4" />
                  Download {result.file}
                </a>
              </div>
            )}

            {/* Key with Copy */}
            {result.key && (
              <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-400" />
                    <p className="text-white font-semibold">Encryption Key</p>
                  </div>
                  <button
                    onClick={() => copyValue(result.key, 'key')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      copiedKey
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30'
                    }`}
                  >
                    {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-gray-300 font-mono text-sm break-all bg-black/20 p-3 rounded-lg border border-white/5">{result.key}</p>
              </div>
            )}

            {/* IV with Copy */}
            {result.iv && (
              <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-amber-400" />
                    <p className="text-white font-semibold">Initialization Vector (IV)</p>
                  </div>
                  <button
                    onClick={() => copyValue(result.iv, 'iv')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      copiedIv
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30'
                    }`}
                  >
                    {copiedIv ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedIv ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-gray-300 font-mono text-sm break-all bg-black/20 p-3 rounded-lg border border-white/5">{result.iv}</p>
              </div>
            )}

            {/* Warning */}
            {action === 'encrypt' && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mt-4">
                <p className="text-amber-200 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
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
