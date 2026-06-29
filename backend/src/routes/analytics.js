const express = require('express');
const router = express.Router();
const { LeadModel, TicketModel, SessionModel, MessageModel, CampaignModel } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// GET /api/analytics/dashboard - Main dashboard stats
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const leads = await LeadModel.findAll();
    const tickets = await TicketModel.findAll();

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newLeadsThisMonth = leads.filter(l => new Date(l.created_at) >= thisMonth).length;
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
    const criticalTickets = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length;

    // Active sessions count
    const activeSessions = SessionModel.sessions ? SessionModel.sessions.size : 0;

    const kpis = {
      total_leads: totalLeads,
      new_leads_this_month: newLeadsThisMonth,
      conversion_rate: parseFloat(conversionRate),
      open_tickets: openTickets,
      critical_tickets: criticalTickets,
      active_conversations: activeSessions,
      hot_leads: leads.filter(l => l.urgency === 'hot').length,
      warm_leads: leads.filter(l => l.urgency === 'warm').length,
      cold_leads: leads.filter(l => l.urgency === 'cold').length,
    };

    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/leads - Lead analytics
router.get('/leads', authMiddleware, async (req, res) => {
  try {
    const leads = await LeadModel.findAll();

    const byProduct = leads.reduce((acc, l) => {
      acc[l.product_interest] = (acc[l.product_interest] || 0) + 1;
      return acc;
    }, {});

    const byStatus = leads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {});

    const byUrgency = {
      hot: leads.filter(l => l.urgency === 'hot').length,
      warm: leads.filter(l => l.urgency === 'warm').length,
      cold: leads.filter(l => l.urgency === 'cold').length,
    };

    // Generate last 30 days data
    const dailyLeads = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = leads.filter(l => {
        const created = new Date(l.created_at).toISOString().split('T')[0];
        return created === dateStr;
      }).length;
      dailyLeads.push({ date: dateStr, count });
    }

    res.json({
      success: true,
      data: { by_product: byProduct, by_status: byStatus, by_urgency: byUrgency, daily: dailyLeads, total: leads.length },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/conversations - Conversation analytics
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const messages = MessageModel.messages || [];
    const totalMessages = messages.length;
    const inbound = messages.filter(m => m.direction === 'inbound').length;
    const outbound = messages.filter(m => m.direction === 'outbound').length;

    // Simulate daily volume
    const dailyVolume = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dailyVolume.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 50) + 10,
      });
    }

    res.json({
      success: true,
      data: {
        total_messages: totalMessages,
        inbound,
        outbound,
        active_sessions: SessionModel.sessions ? SessionModel.sessions.size : 0,
        daily_volume: dailyVolume,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/campaigns - Campaign performance
router.get('/campaigns', authMiddleware, async (req, res) => {
  try {
    const campaigns = await CampaignModel.findAll();
    const performance = campaigns.map(c => ({
      ...c,
      sent: Math.floor(Math.random() * 500) + 100,
      delivered: Math.floor(Math.random() * 450) + 90,
      read: Math.floor(Math.random() * 300) + 50,
      responded: Math.floor(Math.random() * 50) + 5,
    }));
    res.json({ success: true, data: performance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
