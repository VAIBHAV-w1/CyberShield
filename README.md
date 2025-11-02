# CyberShield

A comprehensive cybersecurity toolkit built with Node.js backend and React frontend.

## Features

- User authentication with JWT
- Phishing URL detection
- Password strength checking and generation
- AI-powered chatbot for cybersecurity advice
- Threat dashboard with honeypot monitoring
- OTP-based verification

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- nodemailer for email services

### Frontend
- React 18
- Vite for build tooling
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd CyberShield/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/cybershield
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   PORT=5000
   ```

4. Start MongoDB service

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd CyberShield/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP

### Tools
- `POST /api/tools/phishing-check` - Check URL for phishing
- `POST /api/tools/password-strength` - Check password strength
- `GET /api/tools/honeypots` - Get user's honeypots
- `POST /api/tools/honeypots` - Create new honeypot

## Project Structure

```
CyberShield/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.
