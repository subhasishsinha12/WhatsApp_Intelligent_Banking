const { v4: uuidv4 } = require('uuid');
const { isDBConnected, query, getInMemoryStore } = require('../config/database');

// ============================================================
// In-Memory Data Store (Seeded for Demo)
// ============================================================

const store = getInMemoryStore();

// Seed initial data
const seedInMemory = () => {
  if (store.staff.length > 0) return; // Already seeded

  store.staff = [
    { id: '1', name: 'Rajesh Kumar', mobile: '9876500001', email: 'rajesh.kumar@bank.com', role: 'branch_head', branch_code: 'MumbaiMain', is_active: true, password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' },
    { id: '2', name: 'Priya Sharma', mobile: '9876500002', email: 'priya.sharma@bank.com', role: 'admin', branch_code: 'MumbaiMain', is_active: true, password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' },
    { id: '3', name: 'Amit Patel', mobile: '9876500003', email: 'amit.patel@bank.com', role: 'rm', branch_code: 'MumbaiMain', is_active: true, password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' },
    { id: '4', name: 'Sunita Joshi', mobile: '9876500004', email: 'sunita.joshi@bank.com', role: 'rm', branch_code: 'MumbaiMain', is_active: true, password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' },
    { id: '5', name: 'Vikram Singh', mobile: '9876500005', email: 'vikram.singh@bank.com', role: 'officer', branch_code: 'MumbaiMain', is_active: true, password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' },
  ];

  store.users = [
    { id: 'u1', mobile: '9876543210', name: 'Ananya Mehta', account_number: 'ACC001234567890', language: 'en', is_authenticated: false, balance: 125430.50, created_at: new Date() },
    { id: 'u2', mobile: '9876543211', name: 'Suresh Iyer', account_number: 'ACC001234567891', language: 'hi', is_authenticated: false, balance: 87650.00, created_at: new Date() },
    { id: 'u3', mobile: '9876543212', name: 'Meena Gupta', account_number: 'ACC001234567892', language: 'gu', is_authenticated: false, balance: 234100.75, created_at: new Date() },
    { id: 'u4', mobile: '9876543213', name: 'Rahul Verma', account_number: 'ACC001234567893', language: 'en', is_authenticated: false, balance: 45230.00, created_at: new Date() },
    { id: 'u5', mobile: '9876543214', name: 'Kavitha Nair', account_number: 'ACC001234567894', language: 'en', is_authenticated: false, balance: 312450.25, created_at: new Date() },
    { id: 'u6', mobile: '9876543215', name: 'Deepak Jain', account_number: 'ACC001234567895', language: 'hi', is_authenticated: false, balance: 67890.50, created_at: new Date() },
    { id: 'u7', mobile: '9876543216', name: 'Pooja Agarwal', account_number: 'ACC001234567896', language: 'en', is_authenticated: false, balance: 189320.00, created_at: new Date() },
    { id: 'u8', mobile: '9876543217', name: 'Manoj Tiwari', account_number: 'ACC001234567897', language: 'hi', is_authenticated: false, balance: 56710.25, created_at: new Date() },
    { id: 'u9', mobile: '9876543218', name: 'Lakshmi Pillai', account_number: 'ACC001234567898', language: 'en', is_authenticated: false, balance: 423500.00, created_at: new Date() },
    { id: 'u10', mobile: '9876543219', name: 'Harish Desai', account_number: 'ACC001234567899', language: 'gu', is_authenticated: false, balance: 95430.75, created_at: new Date() },
  ];

  const now = new Date();
  const daysAgo = (d) => new Date(now - d * 86400000);

  store.leads = [
    { id: 'l1', mobile: '9876541001', name: 'Ravi Shankar', product_interest: 'Home Loan', urgency: 'hot', status: 'new', notes: 'Looking to buy a flat in 2 months', assigned_rm: '3', branch_code: 'MumbaiMain', created_at: daysAgo(1) },
    { id: 'l2', mobile: '9876541002', name: 'Geeta Rao', product_interest: 'Fixed Deposit', urgency: 'warm', status: 'contacted', notes: 'Has 10L to invest', assigned_rm: '4', branch_code: 'MumbaiMain', created_at: daysAgo(2) },
    { id: 'l3', mobile: '9876541003', name: 'Mohan Das', product_interest: 'Auto Loan', urgency: 'hot', status: 'new', notes: 'Buying car next week', assigned_rm: '3', branch_code: 'MumbaiMain', created_at: daysAgo(1) },
    { id: 'l4', mobile: '9876541004', name: 'Shalini Kapoor', product_interest: 'Education Loan', urgency: 'warm', status: 'qualified', notes: 'Child admitted to IIT', assigned_rm: '4', branch_code: 'MumbaiMain', created_at: daysAgo(5) },
    { id: 'l5', mobile: '9876541005', name: 'Vinod Kumar', product_interest: 'Personal Loan', urgency: 'cold', status: 'new', notes: 'General inquiry', assigned_rm: '3', branch_code: 'MumbaiMain', created_at: daysAgo(10) },
    { id: 'l6', mobile: '9876541006', name: 'Nalini Bhat', product_interest: 'NRI Savings', urgency: 'hot', status: 'new', notes: 'NRI returning from USA', assigned_rm: '4', branch_code: 'MumbaiMain', created_at: daysAgo(0) },
    { id: 'l7', mobile: '9876541007', name: 'Prakash Reddy', product_interest: 'Home Loan', urgency: 'warm', status: 'contacted', notes: 'Budget 50L', assigned_rm: '3', branch_code: 'MumbaiMain', created_at: daysAgo(3) },
    { id: 'l8', mobile: '9876541008', name: 'Anita Singh', product_interest: 'Health Insurance', urgency: 'cold', status: 'new', notes: 'Exploring options', assigned_rm: '4', branch_code: 'MumbaiMain', created_at: daysAgo(7) },
    { id: 'l9', mobile: '9876541009', name: 'Sunil Mehta', product_interest: 'Auto Loan', urgency: 'hot', status: 'qualified', notes: 'Approved in principle', assigned_rm: '3', branch_code: 'MumbaiMain', created_at: daysAgo(2) },
    { id: 'l10', mobile: '9876541010', name: 'Kamala Devi', product_interest: 'Fixed Deposit', urgency: 'warm', status: 'new', notes: 'Retired, looking for safe investment', assigned_rm: '4', branch_code: 'MumbaiMain', created_at: daysAgo(4) },
    { id: 'l11', mobile: '9876541011', name: 'Arjun Nair', product_interest: 'Home Loan', urgency: 'hot', status: 'converted', notes: 'Loan disbursed', assigned_rm: '3', branch_code: 'MumbaiMain', created_at: daysAgo(15) },
    { id: 'l12', mobile: '9876541012', name: 'Divya Pillai', product_interest: 'Education Loan', urgency: 'cold', status: 'new', notes: 'Exploring for next year', assigned_rm: '4', branch_code: 'MumbaiMain', created_at: daysAgo(12) },
    { id: 'l13', mobile: '9876541013', name: 'Ramesh Chand', product_interest: 'Personal Loan', urgency: 'warm', status: 'contacted', notes: 'Medical emergency', assigned_rm: '3', branch_code: 'MumbaiMain', created_at: daysAgo(1) },
    { id: 'l14', mobile: '9876541014', name: 'Preethi Kumar', product_interest: 'Life Insurance', urgency: 'cold', status: 'new', notes: 'General interest', assigned_rm: '4', branch_code: 'MumbaiMain', created_at: daysAgo(8) },
    { id: 'l15', mobile: '9876541015', name: 'Ganesh Murthy', product_interest: 'NRI Savings', urgency: 'hot', status: 'qualified', notes: 'Dubai-based NRI', assigned_rm: '3', branch_code: 'MumbaiMain', created_at: daysAgo(2) },
  ];

  store.products = [
    { id: 'p1', category: 'loans', name: 'Home Loan', description: 'Finance your dream home with attractive interest rates and flexible repayment options.', interest_rate: 8.50, features: { max_amount: '5 Crore', tenure: '30 years', processing_fee: '0.5%', approval_time: '72 hours' }, is_active: true },
    { id: 'p2', category: 'loans', name: 'Auto Loan', description: 'Drive your dream car home with our quick auto loan approvals.', interest_rate: 9.25, features: { max_amount: '1 Crore', tenure: '7 years', processing_fee: '1%', approval_time: '24 hours' }, is_active: true },
    { id: 'p3', category: 'loans', name: 'Education Loan', description: 'Invest in your future with our education loans for top institutions worldwide.', interest_rate: 8.15, features: { max_amount: '50 Lakhs', tenure: '15 years', processing_fee: 'Nil', approval_time: '48 hours' }, is_active: true },
    { id: 'p4', category: 'deposits', name: 'Fixed Deposit', description: 'Secure your savings with guaranteed returns on our Fixed Deposit schemes.', interest_rate: 7.25, features: { min_amount: '10,000', tenure: '7 days to 10 years', interest_payout: 'Monthly/Quarterly/Yearly' }, is_active: true },
    { id: 'p5', category: 'nri', name: 'NRI Savings Account', description: 'Special savings account for Non-Resident Indians with tax benefits and easy repatriation.', interest_rate: 3.50, features: { min_balance: '10,000', repatriation: 'Full', tax_benefit: 'Interest tax-free in India' }, is_active: true },
  ];

  store.faqs = [
    { id: 'f1', question: 'How do I check my account balance?', answer: 'You can check your account balance by replying "1" to the main menu and selecting "Balance Enquiry". You can also visit our app or net banking portal.', category: 'account', language: 'en', keywords: ['balance', 'account balance', 'check balance'] },
    { id: 'f2', question: 'What are the home loan interest rates?', answer: 'Our home loan interest rates start from 8.50% per annum. The exact rate depends on your credit score, loan amount, and tenure.', category: 'loans', language: 'en', keywords: ['home loan', 'interest rate', 'housing loan'] },
    { id: 'f3', question: 'How do I apply for a credit card?', answer: 'You can apply for a credit card through our WhatsApp banking, mobile app, website, or visit your nearest branch. We offer Platinum, Gold, and Classic cards.', category: 'cards', language: 'en', keywords: ['credit card', 'apply', 'card application'] },
    { id: 'f4', question: 'What is the minimum balance for savings account?', answer: 'The minimum balance for a regular savings account is ₹5,000 in metro cities, ₹2,500 in semi-urban, and ₹1,000 in rural areas.', category: 'account', language: 'en', keywords: ['minimum balance', 'savings account', 'MAB'] },
    { id: 'f5', question: 'How to transfer funds via NEFT/RTGS?', answer: 'You can transfer funds through our net banking, mobile app, or WhatsApp banking. NEFT operates 24x7. RTGS is available for amounts above ₹2 Lakhs.', category: 'transfers', language: 'en', keywords: ['NEFT', 'RTGS', 'fund transfer', 'money transfer'] },
    { id: 'f6', question: 'How to open a Fixed Deposit?', answer: 'You can open an FD online through net banking, mobile app, or visit a branch. Minimum deposit is ₹10,000. Tenures range from 7 days to 10 years.', category: 'deposits', language: 'en', keywords: ['FD', 'fixed deposit', 'open FD', 'deposit'] },
    { id: 'f7', question: 'What documents are needed for home loan?', answer: 'For home loan: PAN card, Aadhaar, 3 months salary slips, 6 months bank statement, IT returns for 2 years, property documents.', category: 'loans', language: 'en', keywords: ['home loan documents', 'loan documents', 'KYC'] },
    { id: 'f8', question: 'How to block a lost debit card?', answer: 'Immediately call our 24x7 helpline 1800-XXX-XXXX, use our mobile app to block instantly, or reply to this WhatsApp banking with "BLOCK CARD".', category: 'cards', language: 'en', keywords: ['block card', 'lost card', 'stolen card', 'debit card block'] },
    { id: 'f9', question: 'What are NRI banking services?', answer: 'We offer NRE/NRO/FCNR accounts, NRI home loans, NRI fixed deposits, portfolio investment schemes, and dedicated NRI relationship managers.', category: 'nri', language: 'en', keywords: ['NRI', 'NRE', 'NRO', 'FCNR', 'non resident'] },
    { id: 'f10', question: 'How to register for net banking?', answer: 'Visit any branch with your account details and request net banking activation. You can also register online using your ATM card and registered mobile number.', category: 'digital', language: 'en', keywords: ['net banking', 'internet banking', 'online banking', 'register'] },
    { id: 'f11', question: 'What is the auto loan interest rate?', answer: 'Auto loan interest rates start from 9.25% per annum for new cars. Used car loans start from 11% per annum.', category: 'loans', language: 'en', keywords: ['auto loan', 'car loan', 'vehicle loan', 'interest rate'] },
    { id: 'f12', question: 'How to update my mobile number?', answer: 'Visit any branch with your Aadhaar and account details to update your registered mobile number. This cannot be done online for security reasons.', category: 'account', language: 'en', keywords: ['mobile number', 'update mobile', 'change phone number'] },
    { id: 'f13', question: 'What are the education loan benefits?', answer: 'Education loans offer: tax deduction under Section 80E, moratorium period during study, 100% financing for premier institutions, and no collateral up to ₹7.5 Lakhs.', category: 'loans', language: 'en', keywords: ['education loan', 'student loan', 'study loan'] },
    { id: 'f14', question: 'How to raise a complaint?', answer: 'You can raise a complaint through WhatsApp banking (reply "COMPLAINT"), call 1800-XXX-XXXX, email grievance@bank.com, or visit your branch. You will receive a ticket number for tracking.', category: 'support', language: 'en', keywords: ['complaint', 'grievance', 'issue', 'problem', 'concern'] },
    { id: 'f15', question: 'What is FCNR deposit for NRIs?', answer: 'FCNR (Foreign Currency Non-Resident) deposit allows NRIs to maintain FDs in foreign currencies (USD, GBP, EUR, etc.). Interest is tax-free in India and fully repatriable.', category: 'nri', language: 'en', keywords: ['FCNR', 'foreign currency deposit', 'NRI FD'] },
    { id: 'f16', question: 'How to apply for personal loan?', answer: 'Personal loans are available up to ₹25 Lakhs at 10.50% p.a. Apply online, via app, or WhatsApp banking. Salaried employees with 2+ years experience are eligible.', category: 'loans', language: 'en', keywords: ['personal loan', 'unsecured loan', 'quick loan'] },
    { id: 'f17', question: 'What health insurance plans do you offer?', answer: 'We offer individual, family floater, and senior citizen health insurance plans. Coverage from ₹2 Lakhs to ₹1 Crore. No medical checkup up to 45 years.', category: 'insurance', language: 'en', keywords: ['health insurance', 'medical insurance', 'Mediclaim'] },
    { id: 'f18', question: 'How to find nearest ATM or branch?', answer: 'Reply "BRANCH" or "ATM" on WhatsApp banking for nearest locations. You can also use Google Maps, our app, or call 1800-XXX-XXXX.', category: 'support', language: 'en', keywords: ['ATM', 'branch', 'nearest', 'location', 'find branch'] },
    { id: 'f19', question: 'What is the UPI transaction limit?', answer: 'UPI transaction limit is ₹1 Lakh per transaction and ₹2 Lakhs per day. For certain categories like hospital payments, the limit is ₹5 Lakhs.', category: 'transfers', language: 'en', keywords: ['UPI', 'UPI limit', 'transaction limit', 'UPI transfer'] },
    { id: 'f20', question: 'How to redeem credit card reward points?', answer: 'Redeem reward points through our mobile app under Cards > Rewards, net banking, or call credit card helpline. Points can be redeemed for cash, vouchers, or products.', category: 'cards', language: 'en', keywords: ['reward points', 'redeem points', 'credit card rewards'] },
  ];

  store.campaigns = [
    { id: 'c1', name: 'Monsoon Home Loan Offer', message_template: 'Special offer! Home loans at 8.25% p.a. this monsoon season. Apply now and get ₹5,000 cashback on processing fee. Valid till 31st August. Reply "HOMELOAN" to know more.', target_segment: 'existing_customers', start_date: new Date('2024-07-01'), end_date: new Date('2024-08-31'), is_active: true },
    { id: 'c2', name: 'FD Rate Hike Alert', message_template: 'Great news! FD interest rates increased to 7.25% p.a. Lock in high returns now. Minimum ₹10,000. Reply "FD" to open your Fixed Deposit today.', target_segment: 'all', start_date: new Date('2024-06-01'), end_date: new Date('2024-12-31'), is_active: true },
    { id: 'c3', name: 'NRI Welcome Offer', message_template: 'Welcome NRIs! Open your NRE account in just 10 minutes. No minimum balance for first 6 months. Tax-free interest. Reply "NRI" to get started.', target_segment: 'nri', start_date: new Date('2024-01-01'), end_date: new Date('2024-12-31'), is_active: true },
    { id: 'c4', name: 'Diwali Credit Card Offer', message_template: 'Diwali Special! Get 5X reward points on all purchases till Diwali. Apply for our Platinum card today. No joining fee. Reply "CARD" to apply.', target_segment: 'high_value', start_date: new Date('2024-10-01'), end_date: new Date('2024-11-15'), is_active: false },
    { id: 'c5', name: 'Education Loan Drive', message_template: 'Admission season is here! Get education loans at 8.15% p.a. with 0% processing fee for IIT/IIM/AIIMS. Quick approval in 48 hours. Reply "EDLOAN" to apply.', target_segment: 'youth', start_date: new Date('2024-05-01'), end_date: new Date('2024-07-31'), is_active: false },
  ];

  store.tickets = [
    { id: 't1', customer_id: 'u1', ticket_number: 'TKT-2024-0001', category: 'Card Issue', description: 'Debit card not working at ATM', status: 'resolved', priority: 'high', created_at: daysAgo(10), resolved_at: daysAgo(9) },
    { id: 't2', customer_id: 'u2', ticket_number: 'TKT-2024-0002', category: 'Transaction Dispute', description: 'Unknown debit of Rs 2500 on 15th June', status: 'in_progress', priority: 'high', created_at: daysAgo(5), resolved_at: null },
    { id: 't3', customer_id: 'u3', ticket_number: 'TKT-2024-0003', category: 'Loan Query', description: 'Home loan EMI discrepancy', status: 'open', priority: 'medium', created_at: daysAgo(3), resolved_at: null },
    { id: 't4', customer_id: 'u4', ticket_number: 'TKT-2024-0004', category: 'Net Banking', description: 'Unable to login to net banking', status: 'resolved', priority: 'low', created_at: daysAgo(7), resolved_at: daysAgo(7) },
    { id: 't5', customer_id: 'u5', ticket_number: 'TKT-2024-0005', category: 'Account Update', description: 'Need to update email address', status: 'open', priority: 'low', created_at: daysAgo(2), resolved_at: null },
    { id: 't6', customer_id: 'u6', ticket_number: 'TKT-2024-0006', category: 'Fraud Alert', description: 'Suspicious transaction from overseas', status: 'in_progress', priority: 'critical', created_at: daysAgo(1), resolved_at: null },
    { id: 't7', customer_id: 'u7', ticket_number: 'TKT-2024-0007', category: 'FD Query', description: 'FD maturity amount query', status: 'resolved', priority: 'low', created_at: daysAgo(15), resolved_at: daysAgo(14) },
    { id: 't8', customer_id: 'u8', ticket_number: 'TKT-2024-0008', category: 'Cheque Return', description: 'Cheque returned without reason', status: 'open', priority: 'medium', created_at: daysAgo(4), resolved_at: null },
    { id: 't9', customer_id: 'u9', ticket_number: 'TKT-2024-0009', category: 'Insurance', description: 'Insurance premium deducted twice', status: 'in_progress', priority: 'high', created_at: daysAgo(2), resolved_at: null },
    { id: 't10', customer_id: 'u10', ticket_number: 'TKT-2024-0010', category: 'NRI Services', description: 'Wire transfer not received', status: 'open', priority: 'critical', created_at: daysAgo(1), resolved_at: null },
  ];
};

// ============================================================
// Model Operations
// ============================================================

const UserModel = {
  findByMobile: async (mobile) => {
    if (isDBConnected()) {
      const result = await query('SELECT * FROM users WHERE mobile = $1', [mobile]);
      return result.rows[0] || null;
    }
    return store.users.find(u => u.mobile === mobile) || null;
  },

  findById: async (id) => {
    if (isDBConnected()) {
      const result = await query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    }
    return store.users.find(u => u.id === id) || null;
  },

  create: async (data) => {
    const user = { id: uuidv4(), ...data, created_at: new Date() };
    if (isDBConnected()) {
      const result = await query(
        'INSERT INTO users (id, mobile, name, account_number, language, is_authenticated, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [user.id, user.mobile, user.name, user.account_number, user.language || 'en', false, user.created_at]
      );
      return result.rows[0];
    }
    store.users.push(user);
    return user;
  },

  findAll: async () => {
    if (isDBConnected()) {
      const result = await query('SELECT * FROM users ORDER BY created_at DESC');
      return result.rows;
    }
    return store.users;
  },
};

const SessionModel = {
  sessions: new Map(), // In-memory sessions always

  create: async (data) => {
    const session = {
      id: uuidv4(),
      ...data,
      context: data.context || {},
      state: data.state || 'WELCOME',
      language: data.language || 'en',
      created_at: new Date(),
      last_activity: new Date(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    SessionModel.sessions.set(session.id, session);
    return session;
  },

  findById: async (id) => {
    return SessionModel.sessions.get(id) || null;
  },

  findByMobile: async (mobile) => {
    for (const [, session] of SessionModel.sessions) {
      if (session.mobile === mobile && session.expires_at > new Date()) {
        return session;
      }
    }
    return null;
  },

  update: async (id, data) => {
    const existing = SessionModel.sessions.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, last_activity: new Date() };
    SessionModel.sessions.set(id, updated);
    return updated;
  },

  delete: async (id) => {
    SessionModel.sessions.delete(id);
  },

  findAll: () => {
    return Array.from(SessionModel.sessions.values());
  },
};

const MessageModel = {
  messages: [],

  create: async (data) => {
    const message = { id: uuidv4(), ...data, timestamp: new Date() };
    MessageModel.messages.push(message);
    return message;
  },

  findBySession: async (sessionId) => {
    return MessageModel.messages.filter(m => m.session_id === sessionId);
  },
};

const LeadModel = {
  findAll: async (filters = {}) => {
    if (isDBConnected()) {
      let q = 'SELECT * FROM leads WHERE 1=1';
      const params = [];
      let i = 1;
      if (filters.urgency) { q += ` AND urgency = $${i++}`; params.push(filters.urgency); }
      if (filters.status) { q += ` AND status = $${i++}`; params.push(filters.status); }
      if (filters.assigned_rm) { q += ` AND assigned_rm = $${i++}`; params.push(filters.assigned_rm); }
      q += ' ORDER BY created_at DESC';
      const result = await query(q, params);
      return result.rows;
    }
    let leads = [...store.leads];
    if (filters.urgency) leads = leads.filter(l => l.urgency === filters.urgency);
    if (filters.status) leads = leads.filter(l => l.status === filters.status);
    if (filters.assigned_rm) leads = leads.filter(l => l.assigned_rm === filters.assigned_rm);
    return leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  findById: async (id) => {
    if (isDBConnected()) {
      const result = await query('SELECT * FROM leads WHERE id = $1', [id]);
      return result.rows[0] || null;
    }
    return store.leads.find(l => l.id === id) || null;
  },

  create: async (data) => {
    const lead = { id: uuidv4(), ...data, status: data.status || 'new', created_at: new Date() };
    if (isDBConnected()) {
      const result = await query(
        'INSERT INTO leads (id, mobile, name, product_interest, urgency, status, notes, assigned_rm, branch_code, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
        [lead.id, lead.mobile, lead.name, lead.product_interest, lead.urgency, lead.status, lead.notes, lead.assigned_rm, lead.branch_code, lead.created_at]
      );
      return result.rows[0];
    }
    store.leads.push(lead);
    return lead;
  },

  update: async (id, data) => {
    if (isDBConnected()) {
      const fields = Object.keys(data).map((k, i) => `${k} = $${i + 2}`).join(', ');
      const result = await query(`UPDATE leads SET ${fields} WHERE id = $1 RETURNING *`, [id, ...Object.values(data)]);
      return result.rows[0] || null;
    }
    const idx = store.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    store.leads[idx] = { ...store.leads[idx], ...data };
    return store.leads[idx];
  },

  getAnalytics: async () => {
    const leads = await LeadModel.findAll();
    return {
      total: leads.length,
      hot: leads.filter(l => l.urgency === 'hot').length,
      warm: leads.filter(l => l.urgency === 'warm').length,
      cold: leads.filter(l => l.urgency === 'cold').length,
      converted: leads.filter(l => l.status === 'converted').length,
      by_product: leads.reduce((acc, l) => {
        acc[l.product_interest] = (acc[l.product_interest] || 0) + 1;
        return acc;
      }, {}),
    };
  },
};

const TicketModel = {
  counter: 11,

  findAll: async (filters = {}) => {
    if (isDBConnected()) {
      let q = 'SELECT * FROM service_tickets WHERE 1=1';
      const params = [];
      let i = 1;
      if (filters.status) { q += ` AND status = $${i++}`; params.push(filters.status); }
      if (filters.priority) { q += ` AND priority = $${i++}`; params.push(filters.priority); }
      q += ' ORDER BY created_at DESC';
      const result = await query(q, params);
      return result.rows;
    }
    let tickets = [...store.tickets];
    if (filters.status) tickets = tickets.filter(t => t.status === filters.status);
    if (filters.priority) tickets = tickets.filter(t => t.priority === filters.priority);
    return tickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  findById: async (id) => {
    if (isDBConnected()) {
      const result = await query('SELECT * FROM service_tickets WHERE id = $1', [id]);
      return result.rows[0] || null;
    }
    return store.tickets.find(t => t.id === id) || null;
  },

  create: async (data) => {
    const num = String(TicketModel.counter++).padStart(4, '0');
    const ticket = {
      id: uuidv4(),
      ticket_number: `TKT-2024-${num}`,
      status: 'open',
      priority: 'medium',
      created_at: new Date(),
      resolved_at: null,
      ...data,
    };
    if (isDBConnected()) {
      const result = await query(
        'INSERT INTO service_tickets (id, customer_id, ticket_number, category, description, status, priority, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [ticket.id, ticket.customer_id, ticket.ticket_number, ticket.category, ticket.description, ticket.status, ticket.priority, ticket.created_at]
      );
      return result.rows[0];
    }
    store.tickets.push(ticket);
    return ticket;
  },

  update: async (id, data) => {
    if (isDBConnected()) {
      const fields = Object.keys(data).map((k, i) => `${k} = $${i + 2}`).join(', ');
      const result = await query(`UPDATE service_tickets SET ${fields} WHERE id = $1 RETURNING *`, [id, ...Object.values(data)]);
      return result.rows[0] || null;
    }
    const idx = store.tickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    store.tickets[idx] = { ...store.tickets[idx], ...data };
    return store.tickets[idx];
  },
};

const StaffModel = {
  findAll: async () => {
    if (isDBConnected()) {
      const result = await query('SELECT id, name, mobile, email, role, branch_code, is_active FROM branch_staff ORDER BY name');
      return result.rows;
    }
    return store.staff.map(({ password_hash, ...s }) => s);
  },

  findById: async (id) => {
    if (isDBConnected()) {
      const result = await query('SELECT * FROM branch_staff WHERE id = $1', [id]);
      return result.rows[0] || null;
    }
    return store.staff.find(s => s.id === id) || null;
  },

  findByEmail: async (email) => {
    if (isDBConnected()) {
      const result = await query('SELECT * FROM branch_staff WHERE email = $1', [email]);
      return result.rows[0] || null;
    }
    return store.staff.find(s => s.email === email) || null;
  },

  create: async (data) => {
    const staff = { id: uuidv4(), ...data, is_active: true, created_at: new Date() };
    store.staff.push(staff);
    return staff;
  },

  update: async (id, data) => {
    const idx = store.staff.findIndex(s => s.id === id);
    if (idx === -1) return null;
    store.staff[idx] = { ...store.staff[idx], ...data };
    return store.staff[idx];
  },

  getRMs: async (branch_code) => {
    if (isDBConnected()) {
      const result = await query('SELECT id, name, mobile FROM branch_staff WHERE role = $1 AND branch_code = $2 AND is_active = true', ['rm', branch_code]);
      return result.rows;
    }
    return store.staff.filter(s => s.role === 'rm' && s.branch_code === branch_code && s.is_active);
  },
};

const ProductModel = {
  findAll: async (category) => {
    if (isDBConnected()) {
      let q = 'SELECT * FROM products WHERE is_active = true';
      const params = [];
      if (category) { q += ' AND category = $1'; params.push(category); }
      const result = await query(q, params);
      return result.rows;
    }
    let products = store.products.filter(p => p.is_active);
    if (category) products = products.filter(p => p.category === category);
    return products;
  },

  findById: async (id) => {
    return store.products.find(p => p.id === id) || null;
  },

  create: async (data) => {
    const product = { id: uuidv4(), ...data, is_active: true, created_at: new Date() };
    store.products.push(product);
    return product;
  },

  update: async (id, data) => {
    const idx = store.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    store.products[idx] = { ...store.products[idx], ...data };
    return store.products[idx];
  },
};

const FAQModel = {
  findAll: async (category) => {
    let faqs = store.faqs;
    if (category) faqs = faqs.filter(f => f.category === category);
    return faqs;
  },

  search: async (query_str, language = 'en') => {
    const q = query_str.toLowerCase();
    return store.faqs.filter(f => {
      const inQuestion = f.question.toLowerCase().includes(q);
      const inAnswer = f.answer.toLowerCase().includes(q);
      const inKeywords = f.keywords && f.keywords.some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
      return inQuestion || inAnswer || inKeywords;
    });
  },

  create: async (data) => {
    const faq = { id: uuidv4(), ...data, created_at: new Date() };
    store.faqs.push(faq);
    return faq;
  },

  update: async (id, data) => {
    const idx = store.faqs.findIndex(f => f.id === id);
    if (idx === -1) return null;
    store.faqs[idx] = { ...store.faqs[idx], ...data };
    return store.faqs[idx];
  },

  delete: async (id) => {
    const idx = store.faqs.findIndex(f => f.id === id);
    if (idx === -1) return false;
    store.faqs.splice(idx, 1);
    return true;
  },
};

const CampaignModel = {
  findAll: async (active_only = false) => {
    let campaigns = store.campaigns;
    if (active_only) campaigns = campaigns.filter(c => c.is_active);
    return campaigns;
  },

  findById: async (id) => store.campaigns.find(c => c.id === id) || null,

  create: async (data) => {
    const campaign = { id: uuidv4(), ...data, created_at: new Date() };
    store.campaigns.push(campaign);
    return campaign;
  },

  update: async (id, data) => {
    const idx = store.campaigns.findIndex(c => c.id === id);
    if (idx === -1) return null;
    store.campaigns[idx] = { ...store.campaigns[idx], ...data };
    return store.campaigns[idx];
  },
};

const OTPModel = {
  otps: [],

  create: async (mobile, otp, purpose) => {
    const record = { id: uuidv4(), mobile, otp, purpose, is_used: false, created_at: new Date(), expires_at: new Date(Date.now() + 5 * 60 * 1000) };
    OTPModel.otps.push(record);
    // Clean old OTPs
    OTPModel.otps = OTPModel.otps.filter(o => o.expires_at > new Date());
    return record;
  },

  verify: async (mobile, otp, purpose) => {
    // Demo mode: always accept 123456
    if (process.env.DEMO_MODE === 'true' && otp === '123456') return true;
    const record = OTPModel.otps.find(o => o.mobile === mobile && o.otp === otp && o.purpose === purpose && !o.is_used && o.expires_at > new Date());
    if (record) {
      record.is_used = true;
      return true;
    }
    return false;
  },
};

module.exports = {
  seedInMemory,
  UserModel,
  SessionModel,
  MessageModel,
  LeadModel,
  TicketModel,
  StaffModel,
  ProductModel,
  FAQModel,
  CampaignModel,
  OTPModel,
};
