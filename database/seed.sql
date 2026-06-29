-- WhatsApp Banking System - Seed Data
-- Run after schema.sql

-- ============================================================
-- Branches
-- ============================================================
INSERT INTO branches (id, code, name, address, city, state, pincode, phone, latitude, longitude) VALUES
('b1000000-0000-0000-0000-000000000001', 'MumbaiMain', 'Mumbai Main Branch', '123 Fort Road, Churchgate', 'Mumbai', 'Maharashtra', '400001', '022-2345-6789', 18.9322, 72.8335),
('b1000000-0000-0000-0000-000000000002', 'MumbaiBandra', 'Bandra Branch', '45 Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', '022-2345-6790', 19.0600, 72.8369),
('b1000000-0000-0000-0000-000000000003', 'MumbaiAndheri', 'Andheri Branch', '78 Andheri East Main Road', 'Mumbai', 'Maharashtra', '400069', '022-2345-6791', 19.1136, 72.8697);

-- ============================================================
-- Branch Staff (password: password123 - bcrypt hash)
-- ============================================================
INSERT INTO branch_staff (id, name, mobile, email, password_hash, role, branch_code) VALUES
('s1000000-0000-0000-0000-000000000001', 'Rajesh Kumar', '9876500001', 'rajesh.kumar@bank.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'branch_head', 'MumbaiMain'),
('s1000000-0000-0000-0000-000000000002', 'Priya Sharma', '9876500002', 'priya.sharma@bank.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'MumbaiMain'),
('s1000000-0000-0000-0000-000000000003', 'Amit Patel', '9876500003', 'amit.patel@bank.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'rm', 'MumbaiMain'),
('s1000000-0000-0000-0000-000000000004', 'Sunita Joshi', '9876500004', 'sunita.joshi@bank.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'rm', 'MumbaiMain'),
('s1000000-0000-0000-0000-000000000005', 'Vikram Singh', '9876500005', 'vikram.singh@bank.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'officer', 'MumbaiMain');

-- ============================================================
-- Customers
-- ============================================================
INSERT INTO users (id, mobile, name, account_number, language, balance) VALUES
('u1000000-0000-0000-0000-000000000001', '9876543210', 'Ananya Mehta', 'ACC001234567890', 'en', 125430.50),
('u1000000-0000-0000-0000-000000000002', '9876543211', 'Suresh Iyer', 'ACC001234567891', 'hi', 87650.00),
('u1000000-0000-0000-0000-000000000003', '9876543212', 'Meena Gupta', 'ACC001234567892', 'gu', 234100.75),
('u1000000-0000-0000-0000-000000000004', '9876543213', 'Rahul Verma', 'ACC001234567893', 'en', 45230.00),
('u1000000-0000-0000-0000-000000000005', '9876543214', 'Kavitha Nair', 'ACC001234567894', 'en', 312450.25),
('u1000000-0000-0000-0000-000000000006', '9876543215', 'Deepak Jain', 'ACC001234567895', 'hi', 67890.50),
('u1000000-0000-0000-0000-000000000007', '9876543216', 'Pooja Agarwal', 'ACC001234567896', 'en', 189320.00),
('u1000000-0000-0000-0000-000000000008', '9876543217', 'Manoj Tiwari', 'ACC001234567897', 'hi', 56710.25),
('u1000000-0000-0000-0000-000000000009', '9876543218', 'Lakshmi Pillai', 'ACC001234567898', 'en', 423500.00),
('u1000000-0000-0000-0000-000000000010', '9876543219', 'Harish Desai', 'ACC001234567899', 'gu', 95430.75);

-- ============================================================
-- Products
-- ============================================================
INSERT INTO products (id, category, name, description, interest_rate, features) VALUES
('p1000000-0000-0000-0000-000000000001', 'loans', 'Home Loan', 'Finance your dream home with attractive interest rates and flexible repayment options.', 8.50, '{"max_amount": "5 Crore", "tenure": "30 years", "processing_fee": "0.5%", "approval_time": "72 hours"}'),
('p1000000-0000-0000-0000-000000000002', 'loans', 'Auto Loan', 'Drive your dream car home with our quick auto loan approvals.', 9.25, '{"max_amount": "1 Crore", "tenure": "7 years", "processing_fee": "1%", "approval_time": "24 hours"}'),
('p1000000-0000-0000-0000-000000000003', 'loans', 'Education Loan', 'Invest in your future with our education loans for top institutions worldwide.', 8.15, '{"max_amount": "50 Lakhs", "tenure": "15 years", "processing_fee": "Nil", "approval_time": "48 hours"}'),
('p1000000-0000-0000-0000-000000000004', 'deposits', 'Fixed Deposit', 'Secure your savings with guaranteed returns on our Fixed Deposit schemes.', 7.25, '{"min_amount": "10,000", "tenure": "7 days to 10 years", "interest_payout": "Monthly/Quarterly/Yearly"}'),
('p1000000-0000-0000-0000-000000000005', 'nri', 'NRI Savings Account', 'Special savings account for Non-Resident Indians with tax benefits and easy repatriation.', 3.50, '{"min_balance": "10,000", "repatriation": "Full", "tax_benefit": "Interest tax-free in India"}');

-- ============================================================
-- FAQs
-- ============================================================
INSERT INTO faqs (question, answer, category, language, keywords) VALUES
('How do I check my account balance?', 'You can check your account balance by replying "1" to the main menu and selecting "Balance Enquiry". You can also visit our app or net banking portal.', 'account', 'en', ARRAY['balance', 'account balance', 'check balance']),
('What are the home loan interest rates?', 'Our home loan interest rates start from 8.50% per annum. The exact rate depends on your credit score, loan amount, and tenure.', 'loans', 'en', ARRAY['home loan', 'interest rate', 'housing loan']),
('How do I apply for a credit card?', 'You can apply for a credit card through our WhatsApp banking, mobile app, website, or visit your nearest branch. We offer Platinum, Gold, and Classic cards.', 'cards', 'en', ARRAY['credit card', 'apply', 'card application']),
('What is the minimum balance for savings account?', 'The minimum balance for a regular savings account is ₹5,000 in metro cities, ₹2,500 in semi-urban, and ₹1,000 in rural areas.', 'account', 'en', ARRAY['minimum balance', 'savings account', 'MAB']),
('How to transfer funds via NEFT/RTGS?', 'You can transfer funds through our net banking, mobile app, or WhatsApp banking. NEFT operates 24x7. RTGS is available for amounts above ₹2 Lakhs.', 'transfers', 'en', ARRAY['NEFT', 'RTGS', 'fund transfer', 'money transfer']),
('How to open a Fixed Deposit?', 'You can open an FD online through net banking, mobile app, or visit a branch. Minimum deposit is ₹10,000. Tenures range from 7 days to 10 years.', 'deposits', 'en', ARRAY['FD', 'fixed deposit', 'open FD', 'deposit']),
('What documents are needed for home loan?', 'For home loan: PAN card, Aadhaar, 3 months salary slips, 6 months bank statement, IT returns for 2 years, property documents.', 'loans', 'en', ARRAY['home loan documents', 'loan documents', 'KYC']),
('How to block a lost debit card?', 'Immediately call our 24x7 helpline 1800-XXX-XXXX, use our mobile app to block instantly, or reply to this WhatsApp banking with "BLOCK CARD".', 'cards', 'en', ARRAY['block card', 'lost card', 'stolen card', 'debit card block']),
('What are NRI banking services?', 'We offer NRE/NRO/FCNR accounts, NRI home loans, NRI fixed deposits, portfolio investment schemes, and dedicated NRI relationship managers.', 'nri', 'en', ARRAY['NRI', 'NRE', 'NRO', 'FCNR', 'non resident']),
('How to register for net banking?', 'Visit any branch with your account details and request net banking activation. You can also register online using your ATM card and registered mobile number.', 'digital', 'en', ARRAY['net banking', 'internet banking', 'online banking', 'register']),
('What is the auto loan interest rate?', 'Auto loan interest rates start from 9.25% per annum for new cars. Used car loans start from 11% per annum.', 'loans', 'en', ARRAY['auto loan', 'car loan', 'vehicle loan', 'interest rate']),
('How to update my mobile number?', 'Visit any branch with your Aadhaar and account details to update your registered mobile number. This cannot be done online for security reasons.', 'account', 'en', ARRAY['mobile number', 'update mobile', 'change phone number']),
('What are the education loan benefits?', 'Education loans offer: tax deduction under Section 80E, moratorium period during study, 100% financing for premier institutions, and no collateral up to ₹7.5 Lakhs.', 'loans', 'en', ARRAY['education loan', 'student loan', 'study loan']),
('How to raise a complaint?', 'You can raise a complaint through WhatsApp banking, call 1800-XXX-XXXX, email grievance@bank.com, or visit your branch. You will receive a ticket number for tracking.', 'support', 'en', ARRAY['complaint', 'grievance', 'issue', 'problem', 'concern']),
('What is FCNR deposit for NRIs?', 'FCNR (Foreign Currency Non-Resident) deposit allows NRIs to maintain FDs in foreign currencies (USD, GBP, EUR, etc.). Interest is tax-free in India and fully repatriable.', 'nri', 'en', ARRAY['FCNR', 'foreign currency deposit', 'NRI FD']),
('How to apply for personal loan?', 'Personal loans are available up to ₹25 Lakhs at 10.50% p.a. Apply online, via app, or WhatsApp banking. Salaried employees with 2+ years experience are eligible.', 'loans', 'en', ARRAY['personal loan', 'unsecured loan', 'quick loan']),
('What health insurance plans do you offer?', 'We offer individual, family floater, and senior citizen health insurance plans. Coverage from ₹2 Lakhs to ₹1 Crore. No medical checkup up to 45 years.', 'insurance', 'en', ARRAY['health insurance', 'medical insurance', 'Mediclaim']),
('How to find nearest ATM or branch?', 'Reply "BRANCH" or "ATM" on WhatsApp banking for nearest locations. You can also use Google Maps, our app, or call 1800-XXX-XXXX.', 'support', 'en', ARRAY['ATM', 'branch', 'nearest', 'location', 'find branch']),
('What is the UPI transaction limit?', 'UPI transaction limit is ₹1 Lakh per transaction and ₹2 Lakhs per day. For certain categories like hospital payments, the limit is ₹5 Lakhs.', 'transfers', 'en', ARRAY['UPI', 'UPI limit', 'transaction limit', 'UPI transfer']),
('How to redeem credit card reward points?', 'Redeem reward points through our mobile app under Cards > Rewards, net banking, or call credit card helpline. Points can be redeemed for cash, vouchers, or products.', 'cards', 'en', ARRAY['reward points', 'redeem points', 'credit card rewards']);

-- ============================================================
-- Campaigns
-- ============================================================
INSERT INTO campaigns (id, name, message_template, target_segment, start_date, end_date, is_active, created_by) VALUES
('c1000000-0000-0000-0000-000000000001', 'Monsoon Home Loan Offer', 'Special offer! Home loans at 8.25% p.a. this monsoon season. Apply now and get ₹5,000 cashback on processing fee. Valid till 31st August. Reply "HOMELOAN" to know more.', 'existing_customers', '2024-07-01', '2024-08-31', TRUE, 's1000000-0000-0000-0000-000000000001'),
('c1000000-0000-0000-0000-000000000002', 'FD Rate Hike Alert', 'Great news! FD interest rates increased to 7.25% p.a. Lock in high returns now. Minimum ₹10,000. Reply "FD" to open your Fixed Deposit today.', 'all', '2024-06-01', '2024-12-31', TRUE, 's1000000-0000-0000-0000-000000000001'),
('c1000000-0000-0000-0000-000000000003', 'NRI Welcome Offer', 'Welcome NRIs! Open your NRE account in just 10 minutes. No minimum balance for first 6 months. Tax-free interest. Reply "NRI" to get started.', 'nri', '2024-01-01', '2024-12-31', TRUE, 's1000000-0000-0000-0000-000000000002'),
('c1000000-0000-0000-0000-000000000004', 'Diwali Credit Card Offer', 'Diwali Special! Get 5X reward points on all purchases till Diwali. Apply for our Platinum card today. No joining fee. Reply "CARD" to apply.', 'high_value', '2024-10-01', '2024-11-15', FALSE, 's1000000-0000-0000-0000-000000000001'),
('c1000000-0000-0000-0000-000000000005', 'Education Loan Drive', 'Admission season is here! Get education loans at 8.15% p.a. with 0% processing fee for IIT/IIM/AIIMS. Quick approval in 48 hours. Reply "EDLOAN" to apply.', 'youth', '2024-05-01', '2024-07-31', FALSE, 's1000000-0000-0000-0000-000000000002');

-- ============================================================
-- Leads
-- ============================================================
INSERT INTO leads (mobile, name, product_interest, urgency, status, notes, assigned_rm, branch_code, created_at) VALUES
('9876541001', 'Ravi Shankar', 'Home Loan', 'hot', 'new', 'Looking to buy a flat in 2 months', 's1000000-0000-0000-0000-000000000003', 'MumbaiMain', NOW() - INTERVAL '1 day'),
('9876541002', 'Geeta Rao', 'Fixed Deposit', 'warm', 'contacted', 'Has 10L to invest for retirement', 's1000000-0000-0000-0000-000000000004', 'MumbaiMain', NOW() - INTERVAL '2 days'),
('9876541003', 'Mohan Das', 'Auto Loan', 'hot', 'new', 'Buying car next week, need quick approval', 's1000000-0000-0000-0000-000000000003', 'MumbaiMain', NOW() - INTERVAL '1 day'),
('9876541004', 'Shalini Kapoor', 'Education Loan', 'warm', 'qualified', 'Child admitted to IIT Bombay this year', 's1000000-0000-0000-0000-000000000004', 'MumbaiMain', NOW() - INTERVAL '5 days'),
('9876541005', 'Vinod Kumar', 'Personal Loan', 'cold', 'new', 'General inquiry, no immediate need', 's1000000-0000-0000-0000-000000000003', 'MumbaiMain', NOW() - INTERVAL '10 days'),
('9876541006', 'Nalini Bhat', 'NRI Services', 'hot', 'new', 'NRI returning from USA, needs NRE account urgently', 's1000000-0000-0000-0000-000000000004', 'MumbaiMain', NOW()),
('9876541007', 'Prakash Reddy', 'Home Loan', 'warm', 'contacted', 'Budget 50L, looking in suburbs', 's1000000-0000-0000-0000-000000000003', 'MumbaiMain', NOW() - INTERVAL '3 days'),
('9876541008', 'Anita Singh', 'Health Insurance', 'cold', 'new', 'Exploring health insurance options for family', 's1000000-0000-0000-0000-000000000004', 'MumbaiMain', NOW() - INTERVAL '7 days'),
('9876541009', 'Sunil Mehta', 'Auto Loan', 'hot', 'qualified', 'Pre-approved, finalizing car model', 's1000000-0000-0000-0000-000000000003', 'MumbaiMain', NOW() - INTERVAL '2 days'),
('9876541010', 'Kamala Devi', 'Fixed Deposit', 'warm', 'new', 'Retired teacher, looking for safe investment', 's1000000-0000-0000-0000-000000000004', 'MumbaiMain', NOW() - INTERVAL '4 days'),
('9876541011', 'Arjun Nair', 'Home Loan', 'hot', 'converted', 'Loan disbursed, successful conversion', 's1000000-0000-0000-0000-000000000003', 'MumbaiMain', NOW() - INTERVAL '15 days'),
('9876541012', 'Divya Pillai', 'Education Loan', 'cold', 'new', 'Exploring for next academic year', 's1000000-0000-0000-0000-000000000004', 'MumbaiMain', NOW() - INTERVAL '12 days'),
('9876541013', 'Ramesh Chand', 'Personal Loan', 'warm', 'contacted', 'Medical emergency, needs funds urgently', 's1000000-0000-0000-0000-000000000003', 'MumbaiMain', NOW() - INTERVAL '1 day'),
('9876541014', 'Preethi Kumar', 'Life Insurance', 'cold', 'new', 'General interest in life insurance', 's1000000-0000-0000-0000-000000000004', 'MumbaiMain', NOW() - INTERVAL '8 days'),
('9876541015', 'Ganesh Murthy', 'NRI Services', 'hot', 'qualified', 'Dubai-based NRI, wants FCNR deposit', 's1000000-0000-0000-0000-000000000003', 'MumbaiMain', NOW() - INTERVAL '2 days');

-- ============================================================
-- Service Tickets
-- ============================================================
INSERT INTO service_tickets (customer_id, ticket_number, category, description, status, priority, created_at, resolved_at) VALUES
('u1000000-0000-0000-0000-000000000001', 'TKT-2024-0001', 'Card Issue', 'Debit card not working at ATM, getting error code 101', 'resolved', 'high', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),
('u1000000-0000-0000-0000-000000000002', 'TKT-2024-0002', 'Transaction Dispute', 'Unknown debit of Rs 2500 on June 15th from unknown merchant', 'in_progress', 'high', NOW() - INTERVAL '5 days', NULL),
('u1000000-0000-0000-0000-000000000003', 'TKT-2024-0003', 'Loan Query', 'Home loan EMI amount different from sanction letter', 'open', 'medium', NOW() - INTERVAL '3 days', NULL),
('u1000000-0000-0000-0000-000000000004', 'TKT-2024-0004', 'Net Banking', 'Unable to login to net banking, forgot password', 'resolved', 'low', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('u1000000-0000-0000-0000-000000000005', 'TKT-2024-0005', 'Account Update', 'Need to update email address in bank records', 'open', 'low', NOW() - INTERVAL '2 days', NULL),
('u1000000-0000-0000-0000-000000000006', 'TKT-2024-0006', 'Fraud Alert', 'Suspicious international transaction on account, possible fraud', 'in_progress', 'critical', NOW() - INTERVAL '1 day', NULL),
('u1000000-0000-0000-0000-000000000007', 'TKT-2024-0007', 'FD Query', 'FD maturity amount calculation query', 'resolved', 'low', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
('u1000000-0000-0000-0000-000000000008', 'TKT-2024-0008', 'Cheque Return', 'Cheque returned without adequate reason given', 'open', 'medium', NOW() - INTERVAL '4 days', NULL),
('u1000000-0000-0000-0000-000000000009', 'TKT-2024-0009', 'Insurance', 'Life insurance premium deducted twice this month', 'in_progress', 'high', NOW() - INTERVAL '2 days', NULL),
('u1000000-0000-0000-0000-000000000010', 'TKT-2024-0010', 'NRI Services', 'International wire transfer not received after 5 business days', 'open', 'critical', NOW() - INTERVAL '1 day', NULL);
