const Joi = require('joi');

const validateMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const leadSchema = Joi.object({
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  name: Joi.string().min(2).max(100).required(),
  product_interest: Joi.string().required(),
  urgency: Joi.string().valid('hot', 'warm', 'cold').default('cold'),
  status: Joi.string().valid('new', 'contacted', 'qualified', 'converted', 'lost').default('new'),
  notes: Joi.string().max(500).optional(),
  assigned_rm: Joi.string().optional(),
  branch_code: Joi.string().optional(),
});

const ticketSchema = Joi.object({
  customer_id: Joi.string().optional(),
  category: Joi.string().required(),
  description: Joi.string().min(10).max(1000).required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
});

const staffSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('branch_head', 'officer', 'rm', 'admin').required(),
  branch_code: Joi.string().required(),
});

const productSchema = Joi.object({
  category: Joi.string().valid('loans', 'deposits', 'cards', 'insurance', 'nri').required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  interest_rate: Joi.number().optional(),
  features: Joi.object().optional(),
  is_active: Joi.boolean().default(true),
});

const faqSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
  category: Joi.string().required(),
  language: Joi.string().valid('en', 'hi', 'gu').default('en'),
  keywords: Joi.array().items(Joi.string()).optional(),
});

const campaignSchema = Joi.object({
  name: Joi.string().required(),
  message_template: Joi.string().required(),
  target_segment: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  is_active: Joi.boolean().default(true),
});

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    return { valid: false, errors: messages, value: null };
  }
  return { valid: true, errors: [], value };
};

module.exports = {
  validateMobile,
  validateOTP,
  validateEmail,
  validate,
  schemas: {
    lead: leadSchema,
    ticket: ticketSchema,
    staff: staffSchema,
    product: productSchema,
    faq: faqSchema,
    campaign: campaignSchema,
  },
};
