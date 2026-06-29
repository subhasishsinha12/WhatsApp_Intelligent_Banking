const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { processMessage, getOrCreateSession, resetSession } = require('../services/conversationService');
const { SessionModel } = require('../models');
const { chatLimiter } = require('../middleware/rateLimiter');

// POST /api/chat/simulate - Main chat endpoint for frontend simulator
router.post('/simulate', chatLimiter, async (req, res) => {
  try {
    const { message, session_id, mobile } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const effectiveMobile = mobile || 'demo_' + (session_id || 'user');
    let effectiveSessionId = session_id;

    if (!effectiveSessionId) {
      const session = await getOrCreateSession(effectiveMobile);
      effectiveSessionId = session.id;
    }

    const responses = await processMessage(effectiveSessionId, message, effectiveMobile);

    // Get updated session info
    const session = await SessionModel.findById(effectiveSessionId);

    res.json({
      success: true,
      session_id: effectiveSessionId,
      responses,
      session_state: session ? session.state : 'WELCOME',
      language: session ? session.language : 'en',
    });
  } catch (err) {
    console.error('[Chat] Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
});

// POST /api/chat/reset - Reset conversation
router.post('/reset', async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }

    await resetSession(session_id);
    res.json({ success: true, message: 'Session reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chat/session/:id - Get session info
router.get('/session/:id', async (req, res) => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/chat/new-session - Create new session
router.post('/new-session', async (req, res) => {
  try {
    const { mobile } = req.body;
    const effectiveMobile = mobile || `demo_${Date.now()}`;
    const session = await getOrCreateSession(effectiveMobile);
    res.json({ success: true, session_id: session.id, mobile: effectiveMobile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
