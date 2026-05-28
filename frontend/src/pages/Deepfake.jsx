import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Image, Search, AlertTriangle, ShieldCheck, ShieldAlert, Loader2, Info, Upload, File, BarChart2 } from 'lucide-react'

const Deepfake = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

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

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) setFile(droppedFile)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.7) return 'text-red-400'
    if (confidence > 0.5) return 'text-amber-400'
    return 'text-emerald-400'
  }

  const getConfidenceBg = (confidence) => {
    if (confidence > 0.7) return 'bg-red-500'
    if (confidence > 0.5) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500/15 to-purple-600/15 rounded-2xl border border-indigo-500/20 mb-5">
          <Image className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Deepfake Detector</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">Analyze images for potential deepfake manipulation and AI generation</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-3 font-semibold text-sm">
            <Upload className="w-4 h-4 text-indigo-400" />
            Select Image
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              dragOver
                ? 'border-indigo-400 bg-indigo-500/10'
                : file
                  ? 'border-indigo-500/30 bg-indigo-500/5'
                  : 'border-white/15 bg-white/5 hover:border-indigo-500/30 hover:bg-white/8'
            }`}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              required
            />
            {file ? (
              <div className="flex flex-col items-center">
                <div className="p-3 bg-indigo-500/15 rounded-xl mb-3">
                  <File className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-indigo-300 font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white/5 rounded-xl mb-3">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-300 font-medium">Drop your image here or click to browse</p>
                <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG, GIF</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold py-3.5 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Analyze Image</span>
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
            <BarChart2 className="w-6 h-6 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Analysis Result</span>
          </h2>

          <div className={`rounded-xl p-6 border ${result.isDeepfake ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-white">Detection Result</h3>
              {result.isDeepfake ? <ShieldAlert className="w-8 h-8 text-red-400" /> : <ShieldCheck className="w-8 h-8 text-emerald-400" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center space-x-3 bg-black/20 p-4 rounded-xl border border-white/5">
                <File className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm mb-0.5">Analyzed File</p>
                  <p className="text-white font-medium truncate max-w-[200px]">{result.file}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-black/20 p-4 rounded-xl border border-white/5">
                <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm mb-0.5">Deepfake Probability</p>
                  <p className={`font-bold ${result.isDeepfake ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.isDeepfake ? 'High (Manipulated)' : 'Low (Authentic)'}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-400 text-sm">Confidence Score</p>
                  <p className={`font-bold ${getConfidenceColor(result.confidence)}`}>
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${getConfidenceBg(result.confidence)}`}
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {result.analysis && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                Analysis Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400">📏</span>
                  <div>
                    <p className="text-gray-400 text-sm">File Size</p>
                    <p className="text-white">{result.analysis.fileSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400">🎨</span>
                  <div>
                    <p className="text-gray-400 text-sm">Format</p>
                    <p className="text-white">{result.analysis.format}</p>
                  </div>
                </div>
              </div>

              {result.analysis.indicators && result.analysis.indicators.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white font-medium mb-3">⚠️ Irregularities Detected:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {result.analysis.indicators.map((indicator, index) => (
                      <div key={index} className="flex items-center space-x-2.5 text-amber-300/90 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <span className="text-sm">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
             <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
               <Info className="w-5 h-5" />
               Note
             </h4>
             <p className="text-blue-200/80 text-sm">
               This analysis uses basic image processing techniques. For professional deepfake detection, consider using specialized forensic tools or consulting experts.
             </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deepfake
