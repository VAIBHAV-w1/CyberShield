import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! I\'m your CyberShield AI assistant. How can I help you with cybersecurity today?', sender: 'bot', timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { text: input, sender: 'user', timestamp: new Date() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/api/tools/chat', { message: input }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const botResponse = response.data.reply
      setMessages([...newMessages, { text: botResponse, sender: 'bot', timestamp: new Date() }])
    } catch (error) {
      setMessages([...newMessages, {
        text: 'Sorry, I\'m having trouble connecting to the server. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        error: true
      }])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">🤖 CyberShield AI Chatbot</h1>
        <p className="text-gray-200 text-lg">Your intelligent cybersecurity assistant</p>
      </div>

      <div className="card-gradient rounded-xl border border-white/20 backdrop-blur-sm overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white/5 border-b border-white/10 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <div>
              <h2 className="text-white font-semibold">CyberShield Assistant</h2>
              <p className="text-gray-300 text-sm">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : message.error
                    ? 'bg-red-500/20 border border-red-500/30 text-red-200 rounded-bl-sm'
                    : 'bg-white/10 text-white rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="Ask me about cybersecurity, threats, or best practices..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="btn-primary text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
            >
              <span>📤</span>
              <span>Send</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'What is phishing?',
              'How to create strong passwords?',
              'What are SQL injection attacks?',
              'How to detect malware?'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1 rounded-full transition-colors duration-300"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-blue-200 font-semibold mb-2">💡 AI Assistant Features:</h3>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• Answer cybersecurity questions</li>
          <li>• Provide security best practices</li>
          <li>• Explain technical concepts</li>
          <li>• Help with threat analysis</li>
        </ul>
      </div>
    </div>
  )
}

export default Chatbot
