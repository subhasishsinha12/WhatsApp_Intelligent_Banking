const express = require('express');
const router = express.Router();
const { processMessage, getOrCreateSession } = require('../services/conversationService');

// Webhook verification (GET)
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'whatsapp_banking_verify_token';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[WhatsApp] Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.json({ status: 'WhatsApp Webhook endpoint active', timestamp: new Date() });
  }
});

// Webhook handler (POST) - receives messages from WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') {
      return res.sendStatus(404);
    }

    // Process each message
    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        if (!value || !value.messages) continue;

        for (const message of value.messages) {
          const from = message.from;
          const text = message.type === 'text' ? message.text.body : message.type;

          const session = await getOrCreateSession(from);
          const responses = await processMessage(session.id, text, from);

          // In production, send responses via WhatsApp API
          console.log(`[WhatsApp] Processed message from ${from}:`, responses.length, 'responses');
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[WhatsApp Webhook] Error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
