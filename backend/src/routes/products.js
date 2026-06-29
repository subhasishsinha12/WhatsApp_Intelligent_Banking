const express = require('express');
const router = express.Router();
const { ProductModel } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const products = await ProductModel.findAll(category);
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const products = await ProductModel.findAll(req.params.category);
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authMiddleware, requireRole('branch_head', 'admin'), async (req, res) => {
  try {
    const { valid, errors, value } = validate(schemas.product, req.body);
    if (!valid) return res.status(400).json({ success: false, errors });
    const product = await ProductModel.create(value);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', authMiddleware, requireRole('branch_head', 'admin'), async (req, res) => {
  try {
    const product = await ProductModel.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
