const express = require('express');
const router = express.Router();
const { CampaignModel } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { active } = req.query;
    const campaigns = await CampaignModel.findAll(active === 'true');
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const campaign = await CampaignModel.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authMiddleware, requireRole('branch_head', 'admin'), async (req, res) => {
  try {
    const { valid, errors, value } = validate(schemas.campaign, req.body);
    if (!valid) return res.status(400).json({ success: false, errors });
    const campaign = await CampaignModel.create(value);
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', authMiddleware, requireRole('branch_head', 'admin'), async (req, res) => {
  try {
    const campaign = await CampaignModel.update(req.params.id, req.body);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
