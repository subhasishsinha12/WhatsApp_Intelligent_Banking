const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { StaffModel } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const staff = await StaffModel.findAll();
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await StaffModel.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Staff not found' });
    const { password_hash, ...safe } = member;
    res.json({ success: true, data: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authMiddleware, requireRole('branch_head', 'admin'), async (req, res) => {
  try {
    const { valid, errors, value } = validate(schemas.staff, req.body);
    if (!valid) return res.status(400).json({ success: false, errors });

    const password = req.body.password || 'password123';
    const password_hash = await bcrypt.hash(password, 10);
    const staff = await StaffModel.create({ ...value, password_hash });
    const { password_hash: _, ...safe } = staff;
    res.status(201).json({ success: true, data: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', authMiddleware, requireRole('branch_head', 'admin'), async (req, res) => {
  try {
    const updated = await StaffModel.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Staff not found' });
    const { password_hash, ...safe } = updated;
    res.json({ success: true, data: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
