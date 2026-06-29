-- WhatsApp Banking System - PostgreSQL Schema
-- Version: 1.0.0

-- Drop existing tables (in dependency order)
DROP TABLE IF EXISTS otp_logs CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS service_tickets CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS branch_staff CASCADE;
DROP TABLE IF EXISTS branches CASCADE;

-- ============================================================
-- Branches
-- ============================================================
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Branch Staff
-- ============================================================
CREATE TABLE branch_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('branch_head', 'officer', 'rm', 'admin')),
    branch_code VARCHAR(50) REFERENCES branches(code),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_email ON branch_staff(email);
CREATE INDEX idx_staff_branch ON branch_staff(branch_code);
CREATE INDEX idx_staff_role ON branch_staff(role);

-- ============================================================
-- Users (Bank Customers)
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(200),
    account_number VARCHAR(50) UNIQUE,
    auth_token VARCHAR(255),
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'hi', 'gu')),
    is_authenticated BOOLEAN DEFAULT FALSE,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_account ON users(account_number);

-- ============================================================
-- Sessions (Conversation Sessions)
-- ============================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    mobile VARCHAR(15),
    session_token VARCHAR(255),
    language VARCHAR(5) DEFAULT 'en',
    state VARCHAR(100) DEFAULT 'WELCOME',
    context JSONB DEFAULT '{}',
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_mobile ON sessions(mobile);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================================
-- Messages
-- ============================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- ============================================================
-- Leads
-- ============================================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile VARCHAR(15) NOT NULL,
    name VARCHAR(200),
    product_interest VARCHAR(200),
    urgency VARCHAR(10) DEFAULT 'cold' CHECK (urgency IN ('hot', 'warm', 'cold')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    notes TEXT,
    assigned_rm UUID REFERENCES branch_staff(id) ON DELETE SET NULL,
    branch_code VARCHAR(50),
    converted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_mobile ON leads(mobile);
CREATE INDEX idx_leads_urgency ON leads(urgency);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_rm ON leads(assigned_rm);
CREATE INDEX idx_leads_branch ON leads(branch_code);
CREATE INDEX idx_leads_created ON leads(created_at);

-- ============================================================
-- Service Tickets
-- ============================================================
CREATE TABLE service_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assigned_to UUID REFERENCES branch_staff(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE INDEX idx_tickets_status ON service_tickets(status);
CREATE INDEX idx_tickets_priority ON service_tickets(priority);
CREATE INDEX idx_tickets_customer ON service_tickets(customer_id);
CREATE INDEX idx_tickets_created ON service_tickets(created_at);

-- ============================================================
-- Products
-- ============================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL CHECK (category IN ('loans', 'deposits', 'cards', 'insurance', 'nri')),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    interest_rate DECIMAL(5, 2),
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- ============================================================
-- FAQs
-- ============================================================
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'hi', 'gu')),
    keywords TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_language ON faqs(language);
CREATE INDEX idx_faqs_keywords ON faqs USING GIN(keywords);

-- ============================================================
-- Campaigns
-- ============================================================
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    message_template TEXT NOT NULL,
    target_segment VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    read_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES branch_staff(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaigns_active ON campaigns(is_active);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- ============================================================
-- OTP Logs
-- ============================================================
CREATE TABLE otp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile VARCHAR(15) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) DEFAULT 'login',
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_mobile ON otp_logs(mobile);
CREATE INDEX idx_otp_expires ON otp_logs(expires_at);

-- ============================================================
-- Views
-- ============================================================

-- Active leads view
CREATE OR REPLACE VIEW active_leads AS
SELECT
    l.*,
    s.name as rm_name,
    s.mobile as rm_mobile
FROM leads l
LEFT JOIN branch_staff s ON l.assigned_rm = s.id
WHERE l.status NOT IN ('converted', 'lost');

-- Lead analytics view
CREATE OR REPLACE VIEW lead_analytics AS
SELECT
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total,
    SUM(CASE WHEN urgency = 'hot' THEN 1 ELSE 0 END) as hot,
    SUM(CASE WHEN urgency = 'warm' THEN 1 ELSE 0 END) as warm,
    SUM(CASE WHEN urgency = 'cold' THEN 1 ELSE 0 END) as cold,
    SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted
FROM leads
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Open tickets view
CREATE OR REPLACE VIEW open_tickets_summary AS
SELECT
    t.*,
    u.name as customer_name,
    u.mobile as customer_mobile
FROM service_tickets t
LEFT JOIN users u ON t.customer_id = u.id
WHERE t.status IN ('open', 'in_progress');

COMMENT ON TABLE users IS 'Bank customers who interact via WhatsApp';
COMMENT ON TABLE sessions IS 'WhatsApp conversation sessions with state machine state';
COMMENT ON TABLE leads IS 'Sales leads captured from WhatsApp conversations';
COMMENT ON TABLE service_tickets IS 'Customer service/complaint tickets';
COMMENT ON TABLE faqs IS 'Frequently asked questions for AI search';
COMMENT ON TABLE campaigns IS 'WhatsApp broadcast campaign management';
