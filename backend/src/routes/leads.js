const express = require('express');
const router = express.Router();
const { LeadModel } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');
const { getLeadAnalytics } = require('../services/leadService');

// GET /api/leads - Get all leads (with filters)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { urgency, status, assigned_rm } = req.query;
    const filters = {};
    if (urgency) filters.urgency = urgency;
    if (status) filters.status = status;

    // RMs can only see their own leads
    if (req.user.role === 'rm') {
      filters.assigned_rm = req.user.id;
    } else if (assigned_rm) {
      filters.assigned_rm = assigned_rm;
    }

    const leads = await LeadModel.findAll(filters);
    res.json({ success: true, data: leads, total: leads.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/leads/analytics - Lead analytics
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const analytics = await getLeadAnalytics();
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/leads/export — download leads as CSV
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const leads = await LeadModel.findAll();

    const headers = ['ID','Name','Mobile','Product Interest','Urgency','Status','Assigned RM','Branch','Created At','Notes'];
    const rows = leads.map(l => [
      l.id, l.name, l.mobile, l.product_interest, l.urgency,
      l.status, l.assigned_rm || '', l.branch_code || '',
      new Date(l.created_at).toLocaleDateString('en-IN'),
      (l.notes || '').replace(/,/g, ';')
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/leads/:id - Get single lead
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await LeadModel.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/leads - Create lead
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { valid, errors, value } = validate(schemas.lead, req.body);
    if (!valid) return res.status(400).json({ success: false, errors });

    const lead = await LeadModel.create({ ...value, branch_code: req.user.branch_code });
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await LeadModel.update(req.params.id, req.body);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
