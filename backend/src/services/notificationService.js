const axios = require('axios');

const sendWhatsAppMessage = async (to, message) => {
  // In production, this calls the WhatsApp Business API
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.log(`[WhatsApp Simulation] To: ${to}\nMessage: ${message}\n`);
    return { success: true, simulated: true };
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { success: true, message_id: response.data.messages[0].id };
  } catch (err) {
    console.error('[WhatsApp] Send failed:', err.response?.data || err.message);
    return { success: false, error: err.message };
  }
};

const sendCampaignMessage = async (recipients, campaignMessage) => {
  const results = [];
  for (const recipient of recipients) {
    const result = await sendWhatsAppMessage(recipient.mobile, campaignMessage);
    results.push({ mobile: recipient.mobile, ...result });
    // Rate limiting - 1 message per second in production
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return results;
};

const notifyRM = async (rm, lead) => {
  const message = `🔔 *New Lead Alert!*\n\nCustomer: ${lead.name}\nMobile: ${lead.mobile}\nProduct: ${lead.product_interest}\nUrgency: ${lead.urgency.toUpperCase()}\n\nPlease follow up within ${lead.urgency === 'hot' ? '1 hour' : lead.urgency === 'warm' ? '4 hours' : '24 hours'}.`;

  return sendWhatsAppMessage(rm.mobile, message);
};

module.exports = { sendWhatsAppMessage, sendCampaignMessage, notifyRM };
