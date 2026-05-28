import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Bot, User, Send, Loader2, Sparkles, MessageSquare, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react'

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
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

  const quickSuggestions = [
    { text: 'What is phishing?', icon: <AlertTriangle className="w-4 h-4" /> },
    { text: 'How to create strong passwords?', icon: <ShieldCheck className="w-4 h-4" /> },
    { text: 'What are SQL injection attacks?', icon: <MessageSquare className="w-4 h-4" /> },
    { text: 'How to detect malware?', icon: <HelpCircle className="w-4 h-4" /> }
  ]

  return (
    <div className="max-w-4xl mx-auto animate-fade-in flex flex-col h-[calc(100vh-8rem)]">
      <div className="text-center mb-6 shrink-0">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">CyberShield AI Assistant</span>
        </h1>
        <p className="text-gray-400">Your intelligent cybersecurity companion</p>
      </div>

      <div className="flex-1 flex flex-col bg-[#0d1326]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-cyan-500/10">
        {/* Chat Header */}
        <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0d1326]"></div>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">CyberShield AI</h2>
              <p className="text-emerald-400 text-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Online & Ready
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="shrink-0 mt-auto">
                  {message.sender === 'user' ? (
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                      <Bot className="w-5 h-5 text-cyan-400" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`relative px-5 py-3.5 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-sm shadow-lg shadow-blue-500/20'
                    : message.error
                      ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl rounded-bl-sm'
                      : 'bg-white/10 border border-white/5 text-gray-200 rounded-2xl rounded-bl-sm'
                }`}>
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-[10px] mt-2 flex items-center justify-end ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-3 max-w-[75%]">
                <div className="shrink-0 mt-auto">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                    <Bot className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div className="bg-white/10 border border-white/5 rounded-2xl rounded-bl-sm px-5 py-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Generating response...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/5 border-t border-white/10 p-4 md:p-6 shrink-0">
          {/* Quick Suggestions */}
          {messages.length < 3 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion.text)}
                  className="flex items-center gap-2 text-sm bg-[#0d1326] border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                  disabled={loading}
                >
                  {suggestion.icon}
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}

          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-5 py-4 bg-[#0d1326] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
              placeholder="Ask a cybersecurity question..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
