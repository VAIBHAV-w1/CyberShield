import React, { useState } from 'react'
import axios from 'axios'

const Deepfake = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/api/tools/deepfake', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze file')
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.7) return 'text-red-400'
    if (confidence > 0.5) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getConfidenceBg = (confidence) => {
    if (confidence > 0.7) return 'bg-red-500/20 border-red-500/30'
    if (confidence > 0.5) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-green-500/20 border-green-500/30'
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">🤖 Deepfake Detector</h1>
        <p className="text-gray-200 text-lg">Analyze images for potential deepfake manipulation</p>
      </div>

      <form onSubmit={handleSubmit} className="card-gradient rounded-xl p-8 mb-8 border border-white/20 backdrop-blur-sm">
        <div className="mb-6">
          <label className="block text-white mb-3 font-semibold">🖼️ Select Image File</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            required
          />
          <p className="text-gray-300 text-sm mt-2">Supported formats: JPG, PNG, GIF</p>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
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
              <span>Analyze Image</span>
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
            <div className={`rounded-lg p-6 border ${getConfidenceBg(result.confidence)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Detection Result</h3>
                <div className={`text-2xl ${result.isDeepfake ? 'text-red-400' : 'text-green-400'}`}>
                  {result.isDeepfake ? '🚨' : '✅'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-300">📄</span>
                  <div>
                    <p className="text-white font-semibold">File</p>
                    <p className="text-gray-300 text-sm">{result.file}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-blue-300">🎯</span>
                  <div>
                    <p className="text-white font-semibold">Is Deepfake</p>
                    <p className={`font-bold ${result.isDeepfake ? 'text-red-400' : 'text-green-400'}`}>
                      {result.isDeepfake ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 md:col-span-2">
                  <span className="text-blue-300">📈</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Confidence Level</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex-1 bg-white/20 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${result.confidence > 0.7 ? 'bg-red-500' : result.confidence > 0.5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Details */}
            {result.analysis && (
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">🔬</span>
                  Analysis Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-300">📏</span>
                    <div>
                      <p className="text-white font-semibold">File Size</p>
                      <p className="text-gray-300">{result.analysis.fileSize}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-green-300">🎨</span>
                    <div>
                      <p className="text-white font-semibold">Format</p>
                      <p className="text-gray-300">{result.analysis.format}</p>
                    </div>
                  </div>
                </div>

                {result.analysis.indicators && result.analysis.indicators.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white font-semibold mb-2">⚠️ Indicators Found:</p>
                    <ul className="space-y-1">
                      {result.analysis.indicators.map((indicator, index) => (
                        <li key={index} className="text-yellow-300 text-sm flex items-center">
                          <span className="mr-2">•</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-200 text-sm flex items-start">
                <span className="mr-2 mt-0.5">ℹ️</span>
                <span><strong>Note:</strong> This analysis uses basic image processing techniques. For professional deepfake detection, consider using specialized forensic tools or consulting experts.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deepfake
