const express = require('express');
const router = express.Router();
const { TicketModel } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    const tickets = await TicketModel.findAll(filters);
    res.json({ success: true, data: tickets, total: tickets.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { valid, errors, value } = validate(schemas.ticket, req.body);
    if (!valid) return res.status(400).json({ success: false, errors });
    const ticket = await TicketModel.create(value);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updateData = req.body;
    if (updateData.status === 'resolved') updateData.resolved_at = new Date();
    const ticket = await TicketModel.update(req.params.id, updateData);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
