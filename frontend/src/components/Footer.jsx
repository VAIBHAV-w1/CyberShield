import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-12 mt-12 animate-fade-in border-t border-slate-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-slide-in">
            <h3 className="text-xl font-bold mb-4 text-white">🛡️ CyberShield</h3>
            <p className="text-gray-200 leading-relaxed">
              Your comprehensive cybersecurity toolkit for staying safe online.
              Protect yourself from digital threats with our advanced security tools.
            </p>
          </div>
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4">🔧 Tools</h3>
            <ul className="space-y-3 text-gray-200">
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">🎣 Phishing Detection</li>
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">🔐 Password Security</li>
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">🔒 File Encryption</li>
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">🤖 Deepfake Analysis</li>
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">⚠️ Threat Monitoring</li>
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">💬 AI Assistant</li>
            </ul>
          </div>
          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4">📚 Resources</h3>
            <ul className="space-y-3 text-gray-200">
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">📖 Security Guides</li>
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">📰 Latest Threats</li>
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">🎓 Tutorials</li>
              <li className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">📊 Statistics</li>
            </ul>
          </div>
          <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold mb-4">📞 Contact</h3>
            <p className="text-gray-200 mb-4">
              For support or inquiries, please reach out to our team.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                <span className="text-lg">📧</span>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                <span className="text-lg">🐦</span>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                <span className="text-lg">💼</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-gray-300">
          <p className="text-sm">
            &copy; 2024 CyberShield. All rights reserved.
            <span className="mx-2">•</span>
            <span className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">Privacy Policy</span>
            <span className="mx-2">•</span>
            <span className="hover:text-blue-300 transition-colors duration-300 cursor-pointer">Terms of Service</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
