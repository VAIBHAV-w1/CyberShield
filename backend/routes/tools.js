const express = require('express');
const OpenAI = require('openai');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Configure OpenAI (optional - will be used if API key is available)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });



// Get all honeypots
router.get('/honeypots', verifyToken, async (req, res) => {
  try {
    // Return mock data since authentication is removed
    const mockHoneypots = [
      {
        _id: 'dev-honeypot-1',
        name: 'Web Honeypot',
        type: 'web',
        configuration: { port: 8080, path: '/admin' },
        logs: [
          {
            timestamp: new Date(Date.now() - 3600000),
            attackerIp: '192.168.1.100',
            action: 'login_attempt',
            details: { username: 'admin', password: 'password123' }
          }
        ],
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        _id: 'dev-honeypot-2',
        name: 'SSH Honeypot',
        type: 'ssh',
        configuration: { port: 2222 },
        logs: [
          {
            timestamp: new Date(Date.now() - 7200000),
            attackerIp: '10.0.0.50',
            action: 'brute_force',
            details: { attempts: 15 }
          }
        ],
        createdAt: new Date(Date.now() - 172800000)
      }
    ];
    res.json(mockHoneypots);
  } catch (error) {
    console.error('Honeypots fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Phishing URL Detector
router.post('/phishing', verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    let status = 'Safe';
    let confidence = 0;
    const indicators = [];
    const recommendations = [];

    // Extract URL if embedded in text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const extractedUrls = url.match(urlRegex) || [url];
    const targetUrl = extractedUrls[0];

    try {
      const urlObj = new URL(targetUrl);

      // Check for HTTPS
      if (!targetUrl.startsWith('https://')) {
        confidence += 0.3;
        indicators.push('Not using HTTPS encryption');
        recommendations.push('Always look for HTTPS (padlock icon) in the address bar');
      }

      // Check for suspicious TLDs
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', '.online', '.site', '.icu', '.work', '.click'];
      if (suspiciousTlds.some(tld => urlObj.hostname.endsWith(tld))) {
        confidence += 0.4;
        indicators.push('Suspicious top-level domain (TLD)');
        recommendations.push('Be cautious with uncommon domain extensions');
      }

      // Check for URL shortening services
      const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'shorturl.at'];
      if (shorteners.some(shortener => urlObj.hostname.includes(shortener))) {
        confidence += 0.3;
        indicators.push('URL shortening service detected');
        recommendations.push('Hover over shortened links to see the real destination before clicking');
      }

      // Check for suspicious keywords in URL
      const suspiciousKeywords = ['verify', 'account', 'urgent', 'click', 'confirm', 'bank', 'login', 'secure', 'update', 'password', 'signin', 'paypal', 'amazon', 'facebook', 'google', 'apple', 'microsoft', 'netflix', 'instagram'];
      const lowerUrl = targetUrl.toLowerCase();
      let keywordMatches = 0;
      suspiciousKeywords.forEach(keyword => {
        if (lowerUrl.includes(keyword)) {
          keywordMatches++;
          if (keywordMatches <= 3) { // Limit to top 3 keywords
            indicators.push(`Contains suspicious keyword: "${keyword}"`);
          }
        }
      });

      if (keywordMatches >= 4) confidence += 0.4;
      else if (keywordMatches >= 2) confidence += 0.25;
      else if (keywordMatches >= 1) confidence += 0.15;

      // Check for excessive subdomains
      const subdomainCount = urlObj.hostname.split('.').length - 2;
      if (subdomainCount > 3) {
        confidence += 0.25;
        indicators.push('Excessive subdomains');
        recommendations.push('Legitimate sites rarely have more than 2-3 subdomains');
      }

      // Check for IP address instead of domain
      const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      if (ipRegex.test(urlObj.hostname)) {
        confidence += 0.35;
        indicators.push('IP address instead of domain name');
        recommendations.push('Legitimate websites use domain names, not IP addresses');
      }

      // Check for unusual characters
      if (/[^a-zA-Z0-9.-]/.test(urlObj.hostname)) {
        confidence += 0.2;
        indicators.push('Unusual characters in domain');
        recommendations.push('Domain names should only contain letters, numbers, hyphens, and periods');
      }

      // Check for homograph attacks (similar looking characters)
      const homoglyphs = /[а-яё]/i; // Cyrillic characters that look like Latin
      if (homoglyphs.test(urlObj.hostname)) {
        confidence += 0.3;
        indicators.push('Potential homograph attack (similar-looking characters)');
        recommendations.push('Check for characters that look similar but are from different alphabets');
      }

      // Check for suspicious patterns
      if (urlObj.hostname.includes('--') || urlObj.hostname.includes('..')) {
        confidence += 0.2;
        indicators.push('Suspicious domain pattern');
      }

      // Check for very long domain names
      if (urlObj.hostname.length > 50) {
        confidence += 0.15;
        indicators.push('Unusually long domain name');
      }

      // Determine status based on confidence
      if (confidence >= 0.8) {
        status = 'High Risk Phishing';
        recommendations.unshift('🚨 DO NOT click this link! This appears to be a phishing attempt.');
      } else if (confidence >= 0.5) {
        status = 'Suspicious';
        recommendations.unshift('⚠️ Exercise caution with this link. Verify the sender and destination.');
      } else if (confidence >= 0.25) {
        status = 'Potentially Suspicious';
        recommendations.unshift('🤔 This link has some unusual characteristics. Double-check before proceeding.');
      } else {
        status = 'Safe';
        recommendations.push('✅ This link appears safe, but always stay vigilant online.');
      }

      res.json({
        url: targetUrl,
        status,
        confidence: Math.round(confidence * 100),
        indicators: indicators.slice(0, 6),
        recommendations: recommendations.slice(0, 4),
        analysis: {
          https: targetUrl.startsWith('https://'),
          domain: urlObj.hostname,
          tld: urlObj.hostname.split('.').pop(),
          subdomainCount,
          length: urlObj.hostname.length
        }
      });

    } catch (urlError) {
      // Invalid URL format
      res.json({
        url: targetUrl,
        status: 'Invalid URL',
        confidence: 100,
        indicators: ['Invalid URL format'],
        recommendations: ['Please check the URL format and try again'],
        analysis: {
          https: false,
          domain: 'Invalid',
          tld: 'Invalid',
          subdomainCount: 0,
          length: targetUrl.length
        }
      });
    }
  } catch (error) {
    console.error('Phishing analysis error:', error);
    res.status(500).json({ message: 'Error analyzing URL' });
  }
});

// Password Strength Analyzer
router.post('/password-check', verifyToken, async (req, res) => {
  try {
    const { password } = req.body;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let strength = 'Weak';
    if (score >= 4) strength = 'Strong';
    else if (score >= 3) strength = 'Medium';

    res.json({ password: password.replace(/./g, '*'), strength, score });
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing password' });
  }
});

// File Encryption/Decryption
router.post('/encrypt-file', verifyToken, async (req, res) => {
  try {
    // Handle file upload with error handling
    await new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) {
          console.error('Multer upload error:', err);
          reject(new Error('File upload failed'));
        } else {
          resolve();
        }
      });
    });

    const file = req.file;
    const action = req.body.action; // 'encrypt' or 'decrypt'
    const providedKey = req.body.key;
    const providedIv = req.body.iv;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    let key, iv;
    if (action === 'encrypt') {
      const keyIv = require('../utils/encrypt').generateKeyAndIV();
      key = keyIv.key;
      iv = keyIv.iv;
    } else if (action === 'decrypt') {
      if (!providedKey || !providedIv) {
        return res.status(400).json({ message: 'Key and IV required for decryption' });
      }
      try {
        key = Buffer.from(providedKey, 'hex');
        iv = Buffer.from(providedIv, 'hex');
      } catch (error) {
        return res.status(400).json({ message: 'Invalid key or IV format. Must be valid hex strings.' });
      }
    }

    const { encryptFile, decryptFile } = require('../utils/encrypt');
    const input = fs.readFileSync(file.path);

    let processedBuffer;
    if (action === 'encrypt') {
      processedBuffer = encryptFile(input, key, iv);
    } else if (action === 'decrypt') {
      processedBuffer = decryptFile(input, key, iv);
    }

    // Generate download filename
    const originalName = file.originalname;
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const extension = originalName.substring(originalName.lastIndexOf('.') + 1);
    const downloadName = action === 'encrypt' ? `${baseName}_encrypted.${extension}` : `${baseName}_decrypted.${extension}`;

    // Save processed file with download name
    const downloadPath = `uploads/${downloadName}`;
    fs.writeFileSync(downloadPath, processedBuffer);

    res.json({
      message: `${action}ed successfully`,
      key: key.toString('hex'),
      iv: iv.toString('hex'),
      file: downloadName,
      downloadUrl: `/uploads/${downloadName}` // Frontend can use this to download
    });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
});

// Data Leak Checker
router.post('/data-leak-check', verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Mock data leak check (in production, integrate with services like Have I Been Pwned)
    const mockBreaches = [
      {
        name: 'Adobe Breach 2013',
        domain: 'adobe.com',
        date: '2013-10-04',
        records: 152445165,
        description: 'Adobe Systems account information including email addresses and encrypted passwords was compromised.',
        dataClasses: ['Email addresses', 'Passwords', 'Usernames']
      },
      {
        name: 'LinkedIn Breach 2012',
        domain: 'linkedin.com',
        date: '2012-06-05',
        records: 167370000,
        description: 'LinkedIn member data including email addresses and hashed passwords was leaked.',
        dataClasses: ['Email addresses', 'Passwords', 'Names']
      },
      {
        name: 'Yahoo Breach 2013',
        domain: 'yahoo.com',
        date: '2013-08-29',
        records: 3000000000,
        description: 'Yahoo user account data including email addresses and passwords was compromised.',
        dataClasses: ['Email addresses', 'Passwords', 'Phone numbers', 'Dates of birth']
      }
    ];

    // Simulate checking if email is in breaches (random for demo)
    const emailHash = crypto.createHash('sha1').update(email.toLowerCase()).digest('hex');
    const foundBreaches = mockBreaches.filter(() => Math.random() > 0.7); // 30% chance of finding breaches

    res.json({
      email: email,
      leaks: foundBreaches,
      totalBreaches: foundBreaches.length,
      checked: true,
      message: foundBreaches.length > 0 ?
        `Found ${foundBreaches.length} data breach${foundBreaches.length > 1 ? 'es' : ''} containing this email` :
        'No known data breaches found for this email'
    });
  } catch (error) {
    console.error('Data leak check error:', error);
    res.status(500).json({ message: 'Error checking data leaks' });
  }
});

// Spam Email Classifier
router.post('/spam-check', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    let spamScore = 0;
    const indicators = [];
    const recommendations = [];

    // Enhanced spam detection patterns
    const spamPatterns = {
      urgent: ['urgent', 'immediate action', 'time sensitive', 'act now', 'deadline', 'expires soon'],
      money: ['free', 'win', 'prize', 'lottery', 'inheritance', 'million dollars', 'cash prize'],
      threats: ['account suspended', 'security alert', 'unauthorized access', 'verify account'],
      generic: ['dear customer', 'dear user', 'hello friend', 'valued member'],
      links: ['click here', 'visit link', 'sign up now', 'register today', 'learn more'],
      personal: ['confirm password', 'update payment', 'billing information', 'credit card']
    };

    const lowerText = text.toLowerCase();

    // Check for excessive capitalization (more than 30% caps)
    const capsCount = (text.match(/[A-Z]/g) || []).length;
    const totalLetters = (text.match(/[a-zA-Z]/g) || []).length;
    if (totalLetters > 10 && (capsCount / totalLetters) > 0.3) {
      spamScore += 0.3;
      indicators.push('Excessive capitalization (shouting)');
      recommendations.push('Legitimate emails rarely use ALL CAPS');
    }

    // Check for excessive exclamation marks
    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      spamScore += 0.2;
      indicators.push('Excessive exclamation marks');
      recommendations.push('Multiple exclamation marks are common in spam');
    }

    // Check for spam patterns
    Object.entries(spamPatterns).forEach(([category, keywords]) => {
      let categoryMatches = 0;
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          categoryMatches++;
          if (categoryMatches <= 2) { // Limit indicators per category
            indicators.push(`Contains "${keyword}" (${category} indicator)`);
          }
        }
      });

      // Score based on category matches
      if (categoryMatches >= 2) spamScore += 0.25;
      else if (categoryMatches >= 1) spamScore += 0.15;
    });

    // Check for suspicious URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    if (urls.length > 2) {
      spamScore += 0.2;
      indicators.push('Multiple URLs detected');
      recommendations.push('Be cautious of emails with many links');
    }

    // Check for phone numbers (common in scam emails)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    if (phoneRegex.test(text)) {
      spamScore += 0.1;
      indicators.push('Contains phone number');
    }

    // Check for very short content
    if (text.length < 50) {
      spamScore += 0.1;
      indicators.push('Unusually short message');
    }

    // Determine classification
    let classification = 'Not Spam';
    let confidence = 'Low';

    if (spamScore >= 0.8) {
      classification = 'High Confidence Spam';
      confidence = 'High';
      recommendations.unshift('🚨 This appears to be spam. Delete immediately.');
    } else if (spamScore >= 0.5) {
      classification = 'Likely Spam';
      confidence = 'Medium';
      recommendations.unshift('⚠️ This message shows spam characteristics. Verify sender.');
    } else if (spamScore >= 0.25) {
      classification = 'Potentially Spam';
      confidence = 'Low';
      recommendations.unshift('🤔 This message has some spam-like features. Exercise caution.');
    } else {
      classification = 'Not Spam';
      confidence = 'High';
      recommendations.push('✅ This message appears legitimate, but stay vigilant.');
    }

    res.json({
      text: text.length > 150 ? text.substring(0, 150) + '...' : text,
      classification,
      confidence,
      spamScore: Math.round(spamScore * 100),
      indicators: indicators.slice(0, 5),
      recommendations: recommendations.slice(0, 3),
      analysis: {
        length: text.length,
        urls: urls.length,
        capsRatio: totalLetters > 0 ? Math.round((capsCount / totalLetters) * 100) : 0,
        exclamationCount
      }
    });
  } catch (error) {
    console.error('Spam check error:', error);
    res.status(500).json({ message: 'Error classifying text' });
  }
});

// Deepfake Detector
router.post('/deepfake', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const sharp = require('sharp');
    const fs = require('fs');
    const path = require('path');

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      return res.status(400).json({ message: 'Unsupported file format. Please upload an image.' });
    }

    const imageBuffer = fs.readFileSync(file.path);

    // Use Sharp for advanced image analysis
    const metadata = await sharp(imageBuffer).metadata();
    let confidence = 0.5; // Base confidence
    let isDeepfake = false;
    const indicators = [];

    // Analyze image properties
    const { width, height, channels, format, size } = metadata;

    // Check file size (deepfakes often have unusual sizes)
    if (size < 1000) {
      confidence += 0.1;
      indicators.push('Very small file size');
    }
    if (size > 5000000) {
      confidence -= 0.1;
      indicators.push('Very large file size');
    }

    // Check aspect ratio (deepfakes might have unusual ratios)
    const aspectRatio = width / height;
    if (aspectRatio < 0.5 || aspectRatio > 2.0) {
      confidence += 0.15;
      indicators.push('Unusual aspect ratio');
    }

    // Check for common deepfake indicators in filename
    const filename = file.originalname.toLowerCase();
    const suspiciousNames = ['deepfake', 'fake', 'ai_generated', 'generated', 'synthetic'];
    if (suspiciousNames.some(name => filename.includes(name))) {
      confidence += 0.3;
      indicators.push('Suspicious filename');
    }

    // Analyze pixel statistics using Sharp
    const stats = await sharp(imageBuffer).stats();
    const { channels: channelStats } = stats;

    // Check for uniform colors (potential manipulation)
    let uniformScore = 0;
    channelStats.forEach(channel => {
      const { mean, stdev } = channel;
      if (stdev < 10) { // Low variance indicates uniform color
        uniformScore += 0.1;
      }
    });
    if (uniformScore > 0.2) {
      confidence += uniformScore;
      indicators.push('High uniform color areas detected');
    }

    // Check for compression artifacts (common in deepfakes)
    const { entropy } = stats;
    if (entropy && entropy < 6.5) { // Low entropy might indicate heavy compression
      confidence += 0.1;
      indicators.push('Low image entropy (possible compression artifacts)');
    }

    // Analyze edges and sharpness
    const edgeStats = await sharp(imageBuffer)
      .greyscale()
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
      })
      .stats();

    const edgeVariance = edgeStats.channels[0].stdev;
    if (edgeVariance < 20) {
      confidence += 0.1;
      indicators.push('Low edge sharpness');
    }

    // Random factor to simulate ML uncertainty (±10%)
    confidence += (Math.random() - 0.5) * 0.2;
    confidence = Math.max(0, Math.min(1, confidence));

    isDeepfake = confidence > 0.6;

    res.json({
      file: file.filename,
      isDeepfake,
      confidence: parseFloat(confidence.toFixed(3)),
      analysis: {
        fileSize: `${(size / 1024).toFixed(2)} KB`,
        dimensions: `${width}x${height}`,
        format: format.toUpperCase(),
        channels,
        indicators: indicators.length > 0 ? indicators : ['No suspicious indicators found']
      }
    });
  } catch (error) {
    console.error('Deepfake analysis error:', error);
    res.status(500).json({ message: 'Error analyzing file' });
  }
});

// Helper function for basic pixel analysis
function analyzePixels(buffer) {
  let score = 0;
  const indicators = [];

  // Check for uniform colors (potential manipulation)
  const sampleSize = Math.min(1000, buffer.length);
  let uniformCount = 0;
  for (let i = 0; i < sampleSize - 3; i += 3) {
    if (buffer[i] === buffer[i+1] && buffer[i+1] === buffer[i+2]) {
      uniformCount++;
    }
  }
  const uniformRatio = uniformCount / (sampleSize / 3);
  if (uniformRatio > 0.8) {
    score += 0.2;
    indicators.push('High uniform color ratio');
  }

  // Check for repetitive patterns
  const patterns = {};
  for (let i = 0; i < Math.min(100, buffer.length - 4); i += 4) {
    const pattern = buffer.slice(i, i + 4).toString('hex');
    patterns[pattern] = (patterns[pattern] || 0) + 1;
  }
  const maxPattern = Math.max(...Object.values(patterns));
  if (maxPattern > 10) {
    score += 0.15;
    indicators.push('Repetitive pixel patterns detected');
  }

  return { score, indicators };
}

// Threat Intelligence Dashboard
router.get('/threats', verifyToken, async (req, res) => {
  try {
    // Fetch real threat intelligence data
    // Using a free API or generating realistic mock data based on current threats
    const threats = await fetchThreatData();
    res.json(threats);
  } catch (error) {
    console.error('Threat fetch error:', error);
    // Fallback to enhanced mock data
    const fallbackThreats = [
      {
        id: 1,
        type: 'Phishing Campaign',
        domain: 'fakebank-support.com',
        severity: 'High',
        description: 'New phishing campaign targeting banking customers',
        date: new Date(Date.now() - 86400000), // 1 day ago
        source: 'Phishing Database'
      },
      {
        id: 2,
        type: 'Malware Distribution',
        domain: 'malicious-download.net',
        severity: 'Medium',
        description: 'Ransomware distribution site detected',
        date: new Date(Date.now() - 172800000), // 2 days ago
        source: 'Malware Analysis'
      },
      {
        id: 3,
        type: 'Data Breach',
        domain: 'compromised-site.org',
        severity: 'High',
        description: 'Major data breach affecting millions of users',
        date: new Date(Date.now() - 259200000), // 3 days ago
        source: 'Breach Notification'
      },
      {
        id: 4,
        type: 'DDoS Attack',
        domain: 'targeted-website.com',
        severity: 'Low',
        description: 'Ongoing DDoS attack on commercial website',
        date: new Date(Date.now() - 3600000), // 1 hour ago
        source: 'Network Monitoring'
      },
      {
        id: 5,
        type: 'Zero-Day Exploit',
        domain: 'vulnerable-app.io',
        severity: 'Critical',
        description: 'New zero-day vulnerability in popular application',
        date: new Date(Date.now() - 7200000), // 2 hours ago
        source: 'Vulnerability Database'
      }
    ];
    res.json(fallbackThreats);
  }
});

// Helper function to fetch threat data (enhanced implementation)
async function fetchThreatData() {
  try {
    // Try to fetch real threat data from APIs
    const axios = require('axios');

    // Example: Fetch from AbuseIPDB (you would need an API key)
    // const abuseIPDBResponse = await axios.get('https://api.abuseipdb.com/api/v2/check', {
    //   params: { ipAddress: '127.0.0.1' },
    //   headers: { 'Key': process.env.ABUSEIPDB_API_KEY }
    // });

    // For now, simulate API calls with enhanced realistic data
    const currentThreats = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Phishing Campaign',
        domain: 'secure-bank-login.net',
        severity: 'High',
        description: 'Massive phishing campaign targeting major banks with sophisticated email templates',
        date: new Date(),
        source: 'Phishing Initiative',
        affectedUsers: 15000,
        location: 'Global'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Ransomware',
        domain: 'file-recovery-service.com',
        severity: 'Critical',
        description: 'New Ryuk ransomware variant encrypting corporate networks',
        date: new Date(Date.now() - 3600000),
        source: 'CrowdStrike',
        affectedUsers: 5000,
        location: 'North America'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Data Breach',
        domain: 'compromised-retail-site.com',
        severity: 'High',
        description: 'Major retail chain breached, 10M+ customer records exposed',
        date: new Date(Date.now() - 7200000),
        source: 'Have I Been Pwned',
        affectedUsers: 10000000,
        location: 'Europe'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Malware Distribution',
        domain: 'fake-update-server.org',
        severity: 'Medium',
        description: 'Drive-by download attacks distributing banking trojans',
        date: new Date(Date.now() - 10800000),
        source: 'Malwarebytes',
        affectedUsers: 2500,
        location: 'Asia Pacific'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Zero-Day Exploit',
        domain: 'vulnerable-software.io',
        severity: 'Critical',
        description: 'Zero-day vulnerability in widely used PDF reader',
        date: new Date(Date.now() - 14400000),
        source: 'Zero Day Initiative',
        affectedUsers: 500000,
        location: 'Global'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'DDoS Attack',
        domain: 'targeted-financial-institution.com',
        severity: 'Medium',
        description: 'Ongoing DDoS attack disrupting online banking services',
        date: new Date(Date.now() - 1800000),
        source: 'Cloudflare',
        affectedUsers: 100000,
        location: 'United States'
      }
    ];

    // Add some randomization to make it feel more dynamic
    return currentThreats.map(threat => ({
      ...threat,
      id: Math.random().toString(36).substr(2, 9), // New ID each time
      date: new Date(threat.date.getTime() + (Math.random() - 0.5) * 3600000) // Slight time variation
    }));

  } catch (error) {
    console.error('Error fetching threat data:', error);
    // Fallback to basic mock data
    return [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Phishing',
        domain: 'paypal-secure-login.net',
        severity: 'High',
        description: 'Fake PayPal login page detected',
        date: new Date(),
        source: 'URLScan.io'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Malware',
        domain: 'free-software-download.com',
        severity: 'Medium',
        description: 'Site distributing trojan malware',
        date: new Date(Date.now() - 3600000),
        source: 'Malwarebytes'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'Ransomware',
        domain: 'encrypted-files-help.com',
        severity: 'High',
        description: 'Ransomware recovery scam site',
        date: new Date(Date.now() - 7200000),
        source: 'CERT'
      }
    ];
  }
}

// AI Chatbot
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    // Mock response for development (OpenAI quota exceeded)
    const responses = {
      'what is phishing': 'Phishing is a cyber attack where attackers try to trick you into giving sensitive information by pretending to be a trustworthy entity.',
      'how to protect from malware': 'Use antivirus software, keep your system updated, avoid suspicious downloads, and be cautious with email attachments.',
      'what is sql injection': 'SQL injection is a code injection technique that exploits vulnerabilities in an application\'s software by inserting malicious SQL statements.',
      'default': 'I\'m CyberBot, your AI security assistant. I can help with cybersecurity questions. Please ask me something specific about security threats or best practices.'
    };

    const lowerMessage = message.toLowerCase();
    let reply = responses.default;

    for (const key in responses) {
      if (lowerMessage.includes(key)) {
        reply = responses[key];
        break;
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error generating response' });
  }
});

module.exports = router;
