const { LeadModel, StaffModel } = require('../models');
const { scoreLead } = require('./aiService');

const assignRM = async (branch_code = 'MumbaiMain') => {
  const rms = await StaffModel.getRMs(branch_code);
  if (!rms || rms.length === 0) {
    return { id: '3', name: 'Amit Patel', mobile: '9876500003' };
  }
  // Simple round-robin assignment
  const idx = Math.floor(Math.random() * rms.length);
  return rms[idx];
};

const createLeadFromChat = async (data) => {
  const { mobile, name, product_interest, notes, branch_code = 'MumbaiMain' } = data;

  const urgency = await scoreLead({ product_interest, notes });
  const rm = await assignRM(branch_code);

  const lead = await LeadModel.create({
    mobile,
    name,
    product_interest,
    urgency,
    status: 'new',
    notes: notes || `Lead captured via WhatsApp Banking. Product: ${product_interest}`,
    assigned_rm: rm.id,
    branch_code,
  });

  console.log(`[Lead Service] New lead created: ${lead.id} | ${name} | ${product_interest} | Urgency: ${urgency} | Assigned to: ${rm.name}`);

  return { lead, rm, urgency };
};

const updateLeadStatus = async (leadId, status, notes) => {
  const updateData = { status };
  if (notes) updateData.notes = notes;
  if (status === 'converted') updateData.converted_at = new Date();
  return LeadModel.update(leadId, updateData);
};

const getLeadAnalytics = async () => {
  return LeadModel.getAnalytics();
};

const getLeadsForRM = async (rmId) => {
  return LeadModel.findAll({ assigned_rm: rmId });
};

module.exports = {
  createLeadFromChat,
  updateLeadStatus,
  getLeadAnalytics,
  getLeadsForRM,
  assignRM,
};
