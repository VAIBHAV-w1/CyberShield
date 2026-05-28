CyberShield — Comprehensive Cybersecurity Toolkit & Threat Monitoring
Short Description
A comprehensive, AI-powered cybersecurity toolkit built with Node.js and React. Designed to enhance digital safety through intelligent phishing detection, robust password management, an AI cybersecurity advisor, and a real-time threat dashboard with honeypot monitoring.

Features
AI-Powered Chatbot: Intelligent cybersecurity advisor for instant threat analysis and security recommendations.
Phishing Detection: Real-time URL scanning and analysis to detect malicious or fraudulent links.
Password Toolkit: Advanced password strength checking and secure password generation.
Threat Dashboard: Real-time monitoring interface with active honeypot deployment and analysis.
Secure Authentication: JWT-based user authentication integrated with email-delivered OTP verification.

Tech Stack
Backend: Node.js, Express.js, JWT, bcryptjs, nodemailer
Frontend: React 18, Vite, React Router, Axios, Tailwind CSS
Database: MongoDB with Mongoose

Project Structure
CyberShield/
├── backend/
│   ├── models/                 # Database schemas
│   ├── routes/                 # API endpoints
│   ├── utils/                  # Helper functions
│   ├── server.js               # Express server entry point
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment configuration
└── frontend/
    ├── src/
    │   ├── components/         # Reusable React components
    │   ├── pages/              # Main application views
    │   ├── App.jsx             # Root component
    │   ├── main.jsx            # React entry point
    │   └── index.css           # Global Tailwind styles
    ├── index.html              # Main HTML template
    ├── package.json            # Frontend dependencies
    └── vite.config.js          # Vite bundler configuration

Installation
git clone https://github.com/VAIBHAV-w1/CyberShield.git

# Backend Setup
cd CyberShield/backend
npm install
# Create .env file with MONGODB_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS, PORT
npm run dev

# Frontend Setup
cd ../frontend
npm install
npm run dev

Screenshots
Threat Dashboard: Real-time monitoring metrics, honeypot alerts, and system health status.
Phishing Scanner: URL input interface with instant threat analysis results and safety indicators.
AI Cybersecurity Advisor: Interactive chat interface for personalized security recommendations.
Authentication Portal: Secure login and registration flows with OTP verification inputs.

Future Improvements
Automated malware signature scanning for uploaded files.
Integration with global threat intelligence feeds for live updates.
Multi-factor authentication (MFA) via authenticator apps (TOTP).

Author
Vaibhav S Wandkar
