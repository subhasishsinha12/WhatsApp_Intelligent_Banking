# WhatsApp Intelligent Banking System

A full-stack AI-enabled WhatsApp Banking prototype for bank branches — built with Node.js, React, and an in-memory data store so it runs out of the box with zero infrastructure.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Credentials & Test Data](#demo-credentials--test-data)
- [Conversation Flows](#conversation-flows)
- [AI Features](#ai-features)
- [Backend API Reference](#backend-api-reference)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Multilingual Support](#multilingual-support)
- [Branch Staff Roles](#branch-staff-roles)
- [Security & Compliance Notes](#security--compliance-notes)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)

---

## Overview

This prototype simulates a WhatsApp-based banking assistant for a bank branch. Customers interact through a familiar chat interface and can:

- Check account balance and mini statements
- Enquire about loans, deposits, insurance and NRI products
- Initiate fund transfers
- Raise service complaints
- Get connected to a Relationship Manager

Branch staff manage everything through a web dashboard — leads, tickets, analytics, products, FAQs and campaigns.

The system runs fully in-memory with seeded dummy data, making it easy to demo without any database setup.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Customer Layer                           │
│   WhatsApp App  ──►  WhatsApp Business Cloud API (simulated)   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP Webhook
┌──────────────────────────────▼──────────────────────────────────┐
│                      Backend (Node.js / Express)                │
│                                                                 │
│  ┌─────────────────┐   ┌───────────────┐   ┌────────────────┐  │
│  │ Webhook Handler │   │ Conversation  │   │   AI Service   │  │
│  │  /api/whatsapp  │──►│   Engine      │──►│ (Intent / FAQ  │  │
│  └─────────────────┘   │  State Machine│   │  Lead Scoring) │  │
│                        └───────┬───────┘   └────────────────┘  │
│  ┌─────────────────┐           │                                │
│  │   REST APIs     │   ┌───────▼──────────────────────────┐    │
│  │  Leads, Tickets │   │      In-Memory Store (Demo)      │    │
│  │  Staff, FAQs    │   │  Sessions / Customers / Leads /  │    │
│  │  Analytics, etc │   │  Tickets / FAQs / Products       │    │
│  └─────────────────┘   └──────────────────────────────────┘    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST API
┌──────────────────────────────▼──────────────────────────────────┐
│                     Frontend (React + Vite)                     │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Chat         │  │ Branch       │  │   Admin Panel         │ │
│  │ Simulator    │  │ Dashboard    │  │   Products / FAQs /   │ │
│  │ (WhatsApp UI)│  │ Leads/Tickets│  │   Campaigns / Staff   │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

Production additions: PostgreSQL · Redis · OpenAI API · Real WhatsApp Business API
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Axios |
| Backend | Node.js, Express, JWT, bcryptjs |
| AI / NLU | OpenAI GPT (with keyword-based fallback when no API key) |
| Database | PostgreSQL (schema provided) — in-memory Map for demo |
| Session Store | Redis (ioredis) — in-memory fallback for demo |
| WhatsApp API | WhatsApp Business Cloud API (webhook simulation in demo) |
| Auth | JWT tokens + OTP (simulated) |

---

## Project Structure

```
WhatsApp_Intelligent_Banking/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # PostgreSQL connection pool
│   │   │   ├── redis.js             # Redis connection
│   │   │   └── openai.js            # OpenAI client
│   │   ├── models/                  # Data model definitions
│   │   ├── routes/
│   │   │   ├── whatsapp.js          # Webhook handler
│   │   │   ├── auth.js              # Login / OTP
│   │   │   ├── chat.js              # Chat simulator endpoint
│   │   │   ├── leads.js             # Lead CRUD + analytics
│   │   │   ├── tickets.js           # Service tickets
│   │   │   ├── customers.js         # Customer management
│   │   │   ├── staff.js             # Branch staff
│   │   │   ├── products.js          # Product catalogue
│   │   │   ├── faqs.js              # FAQ management
│   │   │   ├── campaigns.js         # Campaign management
│   │   │   └── analytics.js         # Dashboard analytics
│   │   ├── services/
│   │   │   ├── conversationService.js  # Core chatbot state machine
│   │   │   ├── aiService.js            # Intent detection, FAQ, scoring
│   │   │   ├── leadService.js          # Lead scoring and assignment
│   │   │   ├── otpService.js           # OTP generation / verification
│   │   │   └── notificationService.js  # WhatsApp message dispatch
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT validation
│   │   │   ├── rateLimiter.js       # Rate limiting
│   │   │   └── logger.js            # Request logging
│   │   └── utils/
│   │       ├── responses.js         # Multilingual message templates
│   │       ├── menuBuilder.js       # WhatsApp menu formatter
│   │       └── validators.js        # Input validators
│   ├── index.js                     # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Staff login
│   │   │   ├── ChatSimulator.jsx    # WhatsApp chat UI
│   │   │   ├── LeadsPage.jsx        # Lead tracker
│   │   │   ├── TicketsPage.jsx      # Service tickets
│   │   │   ├── AnalyticsPage.jsx    # Charts and KPIs
│   │   │   ├── CustomersPage.jsx    # Customer list
│   │   │   └── AdminPage.jsx        # Products/FAQs/Campaigns/Staff
│   │   ├── components/
│   │   │   ├── ChatBubble.jsx       # Message bubble
│   │   │   ├── DashboardLayout.jsx  # Sidebar navigation shell
│   │   │   ├── KPICard.jsx          # Analytics metric card
│   │   │   └── LeadCard.jsx         # Lead summary card
│   │   ├── context/                 # React Context + useReducer
│   │   ├── services/                # Axios API wrappers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
├── database/
│   ├── schema.sql                   # PostgreSQL DDL — all tables + indexes
│   └── seed.sql                     # Dummy data (staff, customers, leads, FAQs…)
└── docs/
    ├── architecture.md              # Detailed architecture notes
    ├── api-spec.md                  # Full REST API specification
    └── deployment.md                # Step-by-step deployment guide
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

No database or Redis needed for the demo — everything runs in memory.

### 1. Clone the repository

```bash
git clone <repo-url>
cd WhatsApp_Intelligent_Banking
git checkout claude/whatsapp-banking-prototype-5x6zb4
```

### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env      # edit if needed — defaults work for demo
npm start
# Backend running at http://localhost:5000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
# Frontend running at http://localhost:3000
```

### 4. Open the app

| URL | Description |
|-----|-------------|
| `http://localhost:3000/chat` | WhatsApp chat simulator (no login needed) |
| `http://localhost:3000/login` | Staff login portal |
| `http://localhost:3000/leads` | Lead management dashboard |
| `http://localhost:3000/analytics` | Analytics and charts |
| `http://localhost:3000/admin` | Admin panel |

---

## Demo Credentials & Test Data

### Staff Login

| Name | Email | Password | Role |
|------|-------|----------|------|
| Rajesh Kumar | rajesh.kumar@bank.com | password123 | Branch Head |
| Priya Sharma | priya.sharma@bank.com | password123 | Admin |
| Amit Patel | amit.patel@bank.com | password123 | RM |
| Sunita Desai | sunita.desai@bank.com | password123 | RM |
| Vijay Mehta | vijay.mehta@bank.com | password123 | Officer |

### Chat Simulator — Test Customers

| Customer | Mobile | Account | Balance |
|----------|--------|---------|---------|
| Arjun Sharma | 9876543210 | IDBI0001234567890 | ₹1,25,430.50 |
| Priya Patel | 9876543211 | IDBI0001234567891 | ₹2,50,000.00 |
| Ravi Kumar | 9876543212 | IDBI0001234567892 | ₹75,230.00 |

**Demo OTP:** `123456` (accepted for any mobile number in demo mode)

### Seeded Data Summary

- 5 branch staff members
- 10 customers with accounts
- 15 leads (mix of hot/warm/cold, all product categories)
- 20 FAQs in English
- 5 campaigns
- 10 service tickets
- 5 products
- 3 branch/ATM locations

---

## Conversation Flows

### Customer Journey Map

```
Customer sends "Hi"
        │
        ▼
Language Selection
  1. English  2. Hindi  3. Gujarati
        │
        ▼
Customer Type
  1. Existing Customer → OTP Authentication → Main Menu
  2. New Customer      → Lead Capture Flow  → RM Handoff
        │
        ▼
┌─────────────────────────────────────────┐
│              MAIN MENU                  │
│  1. Account Services                    │
│  2. Loans                               │
│  3. Deposits                            │
│  4. NRI Banking                         │
│  5. Cards                               │
│  6. Insurance                           │
│  7. Offers & Campaigns                  │
│  8. Branch Support                      │
│  9. Talk to Relationship Manager        │
│  0. Exit                                │
└─────────────────────────────────────────┘
```

### Flow Details

| Flow | Steps |
|------|-------|
| **Balance Enquiry** | Main Menu → 1 → 1 → Shows masked account + balance |
| **Mini Statement** | Main Menu → 1 → 2 → Shows last 5 transactions |
| **Fund Transfer** | Main Menu → 1 → 3 → Collect beneficiary + amount → Initiate |
| **Home Loan** | Main Menu → 2 → 1 → Show rates → Collect name → RM callback intent → Lead created |
| **Education Loan** | Main Menu → 2 → 3 → Show rates + eligibility → Lead capture |
| **FCNR / NRI** | Main Menu → 4 → Show NRI products → Lead capture |
| **Life Insurance** | Main Menu → 6 → 1 → Show plans → Lead capture |
| **Complaint** | Main Menu → 8 → 2 → Collect description → Generate ticket number |
| **RM Handoff** | Main Menu → 9 → Show assigned RM name, mobile, availability |
| **New Customer** | Language → 2 (New) → Collect name → Product interest → Lead created → RM info |

---

## AI Features

| Feature | Implementation |
|---------|---------------|
| **Intent Detection** | OpenAI GPT with keyword-based fallback. Detects: `balance_check`, `loan_enquiry`, `complaint`, `transfer`, `deposit_enquiry`, `insurance`, `nri`, `atm_locator`, `talk_to_rm`, `menu` |
| **FAQ Answering** | Searches FAQ database first; falls back to OpenAI for unanswered questions |
| **Language Detection** | Keyword matching for Hindi/Gujarati script characters before language is explicitly selected |
| **Lead Scoring** | Scores leads hot/warm/cold based on urgency signals: "urgent", "immediately", "ASAP" → hot; "interested", "considering" → warm; rest → cold |
| **Risk Keyword Detection** | Flags fraud-related terms ("OTP share", "pin", "unknown transfer") and triggers fraud awareness alert |
| **Smart Nudges** | Recommends products based on customer profile and conversation context |
| **Follow-up Reminders** | Lead service generates follow-up timestamps and RM assignments |

> **Without OpenAI key:** All AI features fall back to keyword-based logic — the chatbot still works fully, just without GPT-quality responses.

---

## Backend API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Staff login — returns JWT |
| POST | `/auth/otp/send` | Send OTP to customer mobile |
| POST | `/auth/otp/verify` | Verify OTP — returns session token |

### Chat / WhatsApp

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/simulate` | Process a chat message and return bot response |
| POST | `/whatsapp/webhook` | WhatsApp Business API webhook |
| GET | `/whatsapp/webhook` | Webhook verification challenge |

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | List leads (filter: urgency, product, status) |
| POST | `/leads` | Create new lead |
| PUT | `/leads/:id` | Update lead |
| GET | `/leads/analytics` | Lead funnel analytics |

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets` | List service tickets |
| POST | `/tickets` | Create ticket |
| PUT | `/tickets/:id` | Update ticket status |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/dashboard` | KPIs: leads, conversations, resolution rate |
| GET | `/analytics/leads` | Product-wise lead breakdown |
| GET | `/analytics/conversations` | Daily conversation volume |

### Admin (requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/products` | List / create products |
| GET/POST/PUT | `/faqs` | FAQ management |
| GET/POST/PUT | `/campaigns` | Campaign management |
| GET/POST/PUT | `/staff` | Branch staff management |

### Chat Simulate Request/Response

```json
// POST /api/chat/simulate
{
  "sessionId": "session_abc123",
  "message": "Hi",
  "mobile": "9876543210"
}

// Response
{
  "success": true,
  "responses": [
    {
      "type": "text",
      "content": "Welcome to WhatsApp Banking! 🏦\nPlease select your language:\n1. English\n2. हिंदी (Hindi)\n3. ગુજરાતી (Gujarati)"
    }
  ],
  "state": "LANGUAGE_SELECTION"
}
```

---

## Frontend Pages

### Chat Simulator (`/chat`)
WhatsApp phone mockup with:
- Green header with bank name and verified badge
- Message bubbles (customer = green right, bot = white left)
- Typing indicator animation
- Quick reply chips for menu options
- Language selector
- Reset conversation button

### Branch Dashboard (`/` after login)
- Sidebar navigation with all sections
- Role-aware: Branch Head sees all data; RM sees only their leads
- Live KPI cards at the top

### Leads Page (`/leads`)
- Table with: Name, Mobile, Product, Urgency (color dot), Status, Assigned RM, Actions
- Filter bar: urgency, product category, status
- Inline status update (dropdown)
- Add Lead modal
- Urgency color coding: 🔴 Hot · 🟡 Warm · 🔵 Cold

### Analytics Page (`/analytics`)
- KPI cards: Total Leads, Conversion Rate, Active Conversations, Unresolved Tickets
- Bar chart: Product-wise lead volume
- Line chart: Daily conversation trend (30 days)
- Pie chart: Lead status distribution
- Campaign performance table

### Admin Panel (`/admin`)
Tabs for:
- **Products** — interest rates, features, toggle active/inactive
- **FAQs** — add/edit/delete with category and keyword tags
- **Campaigns** — message templates, target segments, schedule
- **Staff** — add staff, assign roles, activate/deactivate

---

## Database Schema

Full DDL is in `database/schema.sql`. Tables:

| Table | Purpose |
|-------|---------|
| `customers` | Customer profiles, account numbers, language preference |
| `sessions` | Conversation sessions with state and context JSON |
| `messages` | Full message log (inbound + outbound) |
| `leads` | Lead pipeline with urgency scoring and RM assignment |
| `service_tickets` | Complaint and service request tracker |
| `branch_staff` | Staff profiles and roles |
| `products` | Product catalogue with rates and features |
| `faqs` | FAQ database with multilingual support |
| `campaigns` | Campaign definitions and schedules |
| `otp_log` | OTP issuance and verification audit trail |
| `branches` | Branch and ATM location data |

---

## Multilingual Support

Supported languages: **English**, **हिंदी (Hindi)**, **ગુજરાતી (Gujarati)**

All message templates in `backend/src/utils/responses.js` are keyed by language code:

```javascript
MESSAGES['en'].WELCOME  // English welcome
MESSAGES['hi'].WELCOME  // Hindi welcome
MESSAGES['gu'].WELCOME  // Gujarati welcome
```

Language is detected automatically from the customer's input text (Devanagari / Gujarati script detection), then confirmed during the language selection step. All subsequent messages in the session are in the chosen language.

---

## Branch Staff Roles

| Role | Permissions |
|------|------------|
| **Admin** | Full system access — products, FAQs, staff, campaigns, all data |
| **Branch Head** | All dashboards, all leads/tickets, reports, no system config |
| **Relationship Manager (RM)** | Own leads and customers, update lead status, ticket view |
| **Officer** | Ticket management, customer queries, read-only leads |

---

## Security & Compliance Notes

### Authentication
- Staff login uses JWT tokens (24-hour expiry)
- Customer sessions expire after 30 minutes of inactivity
- OTPs expire in 5 minutes and are single-use

### Data Protection
- Account numbers masked in all chat responses (show last 4 digits only)
- Mobile numbers partially masked in OTP confirmation messages
- No sensitive data (PIN, CVV, password) accepted over chat — system rejects and alerts

### Fraud Detection
- Risk keyword detection flags messages containing OTP-sharing requests, unknown transfer requests
- Automatic fraud awareness message sent to customer
- Flagged conversations escalated to Branch Head

### Production Hardening (required before go-live)
- Enable HTTPS / TLS termination at load balancer
- Store secrets in AWS Secrets Manager or HashiCorp Vault (not `.env`)
- Enable PostgreSQL SSL connections
- Add WAF in front of webhook endpoint
- Implement HMAC signature verification for WhatsApp webhook payloads
- Enable audit logging for all staff actions
- PII fields (name, mobile, account) should be encrypted at rest
- Comply with RBI guidelines for digital banking and data localisation

---

## Configuration

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/whatsapp_banking
REDIS_URL=redis://localhost:6379
JWT_SECRET=change_this_to_a_long_random_string
OPENAI_API_KEY=sk-...            # Optional — fallback works without it
WHATSAPP_TOKEN=                  # WhatsApp Business Cloud API token
WHATSAPP_PHONE_NUMBER_ID=        # WhatsApp phone number ID
WHATSAPP_VERIFY_TOKEN=           # Webhook verification token
NODE_ENV=development
DEMO_MODE=true                   # Uses in-memory store; set false for PostgreSQL
```

---

## Deployment

See `docs/deployment.md` for full instructions. Quick summary:

### Docker (recommended)

```bash
docker-compose up --build
```

Services: backend (5000), frontend (3000), postgres (5432), redis (6379)

### Manual

```bash
# 1. Set up PostgreSQL and run migrations
psql -U postgres -c "CREATE DATABASE whatsapp_banking"
psql -U postgres -d whatsapp_banking -f database/schema.sql
psql -U postgres -d whatsapp_banking -f database/seed.sql

# 2. Start backend
cd backend && npm install && NODE_ENV=production node index.js

# 3. Build and serve frontend
cd frontend && npm install && npm run build
# Serve dist/ with nginx or any static host
```

### Production Checklist
- [ ] Set `DEMO_MODE=false` and configure real PostgreSQL
- [ ] Set `REDIS_URL` to production Redis
- [ ] Set `OPENAI_API_KEY` for full AI features
- [ ] Configure real WhatsApp Business Cloud API credentials
- [ ] Set strong `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Set up webhook endpoint and verify with Meta

---

## Future Roadmap

| Priority | Feature |
|----------|---------|
| High | Real WhatsApp Business Cloud API integration |
| High | Biometric login (fingerprint / face) via device |
| High | Full PostgreSQL + Redis in production |
| Medium | Video KYC flow integration |
| Medium | Visual QR Pay via WhatsApp camera |
| Medium | Voice banking (speech-to-text + TTS) |
| Medium | Document Vault — upload and store KYC documents |
| Medium | Goal-based banking — set savings goals, track progress |
| Low | Metaverse Branch (VR banking experience) |
| Low | Regional language expansion (Tamil, Telugu, Marathi, Bengali) |
| Low | WhatsApp Pay integration for actual fund transfers |
| Low | AI-powered spending insights and financial health score |
| Low | Predictive fraud detection using transaction patterns |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with clear messages
4. Push and open a Pull Request

---

## License

This is a prototype built for demonstration purposes. Not licensed for production banking use without regulatory approval and security audit.

---

*Built with the WhatsApp Banking vision: "Today Convenience. Tomorrow Intelligence."*
