const express = require('express');
const router = express.Router();
const { UserModel } = require('../models');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await UserModel.findAll();
    res.json({ success: true, data: customers, total: customers.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await UserModel.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const customer = await UserModel.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
