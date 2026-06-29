const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StaffModel } = require('../models');
const { sendOTP, verifyOTP } = require('../services/otpService');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/login - Staff login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const staff = await StaffModel.findByEmail(email);
    if (!staff) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // In demo mode, accept password "password123"
    let isValid = false;
    if (process.env.DEMO_MODE === 'true' && password === 'password123') {
      isValid = true;
    } else {
      isValid = await bcrypt.compare(password, staff.password_hash);
    }

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: staff.id, email: staff.email, role: staff.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        branch_code: staff.branch_code,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/otp/send - Send OTP
router.post('/otp/send', authLimiter, async (req, res) => {
  try {
    const { mobile, purpose } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: 'Mobile number required' });

    const result = await sendOTP(mobile, purpose || 'login');
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/otp/verify - Verify OTP
router.post('/otp/verify', authLimiter, async (req, res) => {
  try {
    const { mobile, otp, purpose } = req.body;
    if (!mobile || !otp) return res.status(400).json({ success: false, message: 'Mobile and OTP required' });

    const isValid = await verifyOTP(mobile, otp, purpose || 'login');
    res.json({ success: isValid, verified: isValid, message: isValid ? 'OTP verified' : 'Invalid OTP' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
