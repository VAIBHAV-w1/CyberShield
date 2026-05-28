const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendOtp = require('../utils/sendOtp');

const router = express.Router();

// Generate a 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup route - Step 1: Validate and send OTP
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', { name: req.body.name, email: req.body.email });
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate and store OTP
    const otp = generateOtp();
    global.otpStore = global.otpStore || {};
    global.otpStore[email] = {
      otp,
      name,
      password,
      type: 'signup',
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    console.log(`Signup OTP for ${email}: ${otp}`);

    // Send OTP email
    await sendOtp(email, otp, 'verification');

    res.status(200).json({
      message: 'OTP sent to your email',
      requiresOtp: true
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup route - Step 2: Verify OTP and create account
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('Verify signup OTP request:', { email, otp });

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    global.otpStore = global.otpStore || {};
    const storedData = global.otpStore[email];

    if (!storedData || storedData.type !== 'signup') {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (Date.now() > storedData.expiresAt) {
      delete global.otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified - create the user
    const hashedPassword = await bcrypt.hash(storedData.password, 12);
    console.log('Password hashed successfully');

    const user = await User.create({
      name: storedData.name,
      email,
      password: hashedPassword,
      isVerified: true
    });
    console.log('User created:', { id: user.id, name: user.name, email: user.email });

    // Clean up OTP
    delete global.otpStore[email];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT token generated');

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Verify signup OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route - Step 1: Validate credentials and send OTP
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate and store OTP
    const otp = generateOtp();
    global.otpStore = global.otpStore || {};
    global.otpStore[email] = {
      otp,
      userId: user.id,
      userName: user.name,
      type: 'login',
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    console.log(`Login OTP for ${email}: ${otp}`);

    // Send OTP email
    await sendOtp(email, otp, 'login');

    res.status(200).json({
      message: 'OTP sent to your email',
      requiresOtp: true
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route - Step 2: Verify OTP and return token
router.post('/verify-login-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('Verify login OTP request:', { email, otp });

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    global.otpStore = global.otpStore || {};
    const storedData = global.otpStore[email];

    if (!storedData || storedData.type !== 'login') {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (Date.now() > storedData.expiresAt) {
      delete global.otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clean up OTP
    const userId = storedData.userId;
    const userName = storedData.userName;
    delete global.otpStore[email];

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        name: userName,
        email: email
      }
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend OTP route
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    global.otpStore = global.otpStore || {};
    const storedData = global.otpStore[email];

    if (!storedData) {
      return res.status(400).json({ message: 'No pending verification found. Please start over.' });
    }

    // Generate new OTP
    const otp = generateOtp();
    storedData.otp = otp;
    storedData.expiresAt = Date.now() + 10 * 60 * 1000;

    console.log(`Resend OTP for ${email}: ${otp}`);

    // Send OTP email
    await sendOtp(email, otp, storedData.type === 'login' ? 'login' : 'verification');

    res.status(200).json({
      message: 'OTP resent to your email'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.toJSON());
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
