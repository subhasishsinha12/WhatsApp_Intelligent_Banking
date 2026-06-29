require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { initOpenAI } = require('./config/openai');
const { seedInMemory } = require('./models');
const { morganMiddleware } = require('./middleware/logger');
const { generalLimiter } = require('./middleware/rateLimiter');

// Routes
const whatsappRoutes = require('./routes/whatsapp');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const leadsRoutes = require('./routes/leads');
const ticketsRoutes = require('./routes/tickets');
const customersRoutes = require('./routes/customers');
const staffRoutes = require('./routes/staff');
const productsRoutes = require('./routes/products');
const faqsRoutes = require('./routes/faqs');
const campaignsRoutes = require('./routes/campaigns');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// Middleware
// ============================================================
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(generalLimiter);

// ============================================================
// Routes
// ============================================================
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development',
    demo: process.env.DEMO_MODE === 'true',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

// ============================================================
// Bootstrap
// ============================================================
const start = async () => {
  // Connect to services (gracefully fallback)
  await connectDB();
  await connectRedis();
  initOpenAI();

  // Seed in-memory store
  seedInMemory();

  app.listen(PORT, () => {
    console.log(`\n🚀 WhatsApp Banking Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`💬 Chat API: http://localhost:${PORT}/api/chat/simulate`);
    console.log(`🌐 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🎭 Demo Mode: ${process.env.DEMO_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
    if (process.env.DEMO_MODE === 'true') {
      console.log(`🔑 Demo Login: any-staff-email@bank.com / password123`);
      console.log(`📱 Demo OTP: 123456`);
      console.log(`📞 Demo Customer Mobile: 9876543210`);
    }
    console.log('');
  });
};

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
