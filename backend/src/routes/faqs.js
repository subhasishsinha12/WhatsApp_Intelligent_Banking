const express = require('express');
const router = express.Router();
const { FAQModel } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { validate, schemas } = require('../utils/validators');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const faqs = await FAQModel.findAll(category);
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, language } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    const faqs = await FAQModel.search(q, language || 'en');
    res.json({ success: true, data: faqs, total: faqs.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { valid, errors, value } = validate(schemas.faq, req.body);
    if (!valid) return res.status(400).json({ success: false, errors });
    const faq = await FAQModel.create(value);
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const faq = await FAQModel.update(req.params.id, req.body);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await FAQModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
