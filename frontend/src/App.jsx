import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PhishingCheck from './pages/PhishingCheck'
import PasswordTool from './pages/PasswordTool'
import EncryptFile from './pages/EncryptFile'
import DataLeakCheck from './pages/DataLeakCheck'
import SpamCheck from './pages/SpamCheck'
import Deepfake from './pages/Deepfake'
import Chatbot from './pages/Chatbot'
import ThreatDashboard from './pages/ThreatDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/phishing-check" element={<PhishingCheck />} />
            <Route path="/password-tool" element={<PasswordTool />} />
            <Route path="/encrypt-file" element={<EncryptFile />} />
            <Route path="/data-leak-check" element={<DataLeakCheck />} />
            <Route path="/spam-check" element={<SpamCheck />} />
            <Route path="/deepfake" element={<Deepfake />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/threat-dashboard" element={<ThreatDashboard />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
