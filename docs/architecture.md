# WhatsApp Intelligent Banking - System Architecture

## Overview

The WhatsApp Intelligent Banking System is a full-stack application that enables banks to provide AI-powered banking services through WhatsApp, coupled with a branch management dashboard for staff.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER LAYER                               │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  WhatsApp    │    │   Mobile     │    │    Chat Simulator    │  │
│  │  Business    │    │   Users      │    │    (Web Frontend)    │  │
│  │  API         │    │              │    │                      │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────┬───────────┘  │
│         │                  │                        │              │
└─────────┼──────────────────┼────────────────────────┼─────────────┘
          │ HTTPS Webhooks   │ REST API               │ REST API
          │                  │                        │
┌─────────▼──────────────────▼────────────────────────▼─────────────┐
│                      API GATEWAY LAYER                             │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              Node.js / Express Backend (Port 5000)          │  │
│  │                                                             │  │
│  │  ┌───────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │  │
│  │  │  CORS     │  │ Helmet   │  │  Morgan   │  │  Rate   │  │  │
│  │  │  Middleware│  │ Security │  │  Logger   │  │ Limiter │  │  │
│  │  └───────────┘  └──────────┘  └───────────┘  └─────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                    ROUTES                           │  │  │
│  │  │  /api/whatsapp  /api/auth  /api/chat  /api/leads   │  │  │
│  │  │  /api/tickets   /api/staff /api/faqs  /api/products│  │  │
│  │  │  /api/analytics /api/campaigns /api/customers      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
┌─────────▼────────┐ ┌────────▼────────┐ ┌───────▼──────────┐
│   SERVICES LAYER │ │  DATA LAYER     │ │  AI/ML LAYER     │
│                  │ │                 │ │                  │
│ conversationSvc  │ │  PostgreSQL     │ │  OpenAI GPT API  │
│ aiService        │ │  (Primary DB)   │ │                  │
│ leadService      │ │                 │ │  Intent Detection│
│ otpService       │ │  Redis Cache    │ │  FAQ Answering   │
│ notificationSvc  │ │  (Sessions)     │ │  Lead Scoring    │
│                  │ │                 │ │  Risk Detection  │
│  State Machine   │ │  In-Memory      │ │                  │
│  (9 Major States)│ │  (Fallback)     │ │  Fallback:       │
│                  │ │                 │ │  Keyword Match   │
└──────────────────┘ └─────────────────┘ └──────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       STAFF LAYER                                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              React/Vite Frontend (Port 3000)                 │  │
│  │                                                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │  Login   │ │  Leads   │ │ Tickets  │ │  Analytics   │  │  │
│  │  │  Page    │ │  Mgmt    │ │  Mgmt    │ │  Dashboard   │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────────┐   │  │
│  │  │  Admin   │ │Customers │ │    Chat Simulator        │   │  │
│  │  │  Panel   │ │  View    │ │  (WhatsApp Phone Mock)   │   │  │
│  │  └──────────┘ └──────────┘ └──────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Conversation State Machine

```
                    ┌──────────┐
                    │  START   │ (User sends "Hi")
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │ LANGUAGE │ (Select 1/2/3)
                    │SELECTION │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │CUSTOMER  │ (1=Existing, 2=New, 3=Guest)
                    │  TYPE    │
                    └────┬─────┘
              ┌──────────┼──────────┐
              │          │          │
         ┌────▼─────┐   │    ┌─────▼────┐
         │AUTH      │   │    │NEW CUST  │
         │MOBILE    │   │    │  NAME    │
         └────┬─────┘   │    └────┬─────┘
              │          │         │
         ┌────▼─────┐   │    ┌────▼─────┐
         │ AUTH OTP │   │    │LEAD      │
         │          │   │    │CAPTURE   │
         └────┬─────┘   │    └────┬─────┘
              │          │         │
              └──────────▼─────────┘
                         │
                    ┌────▼─────┐
                    │   MAIN   │ (9 menu options)
                    │   MENU   │
                    └──┬───┬───┘
          ┌────────────┘   └──────────────┐
          │                               │
     ┌────▼──────┐                   ┌────▼──────┐
     │  ACCOUNT  │                   │   LOANS   │
     │ SERVICES  │                   │   MENU    │
     │ (5 items) │                   │ (4 types) │
     └───────────┘                   └───────────┘
     Balance, Stmt                   Lead Capture →
     Transfer, etc                   RM Handoff
```

## Security Architecture

- **JWT Authentication**: 8-hour token expiry for staff login
- **OTP Verification**: 6-digit OTP with 5-minute expiry for customers
- **Rate Limiting**: 100 req/15min general, 30 req/min for chat, 10/15min for auth
- **Helmet.js**: Security headers (XSS, CSRF, CSP)
- **Input Validation**: Joi schema validation on all endpoints
- **Role-Based Access**: branch_head > admin > rm > officer hierarchy
- **Risk Detection**: Real-time fraud keyword detection in messages

## Data Flow

1. Customer sends WhatsApp message
2. WhatsApp webhook delivers to `/api/whatsapp/webhook`
3. `conversationService.processMessage()` handles state machine
4. AI service detects intent if needed
5. Response sent back via WhatsApp API
6. Leads/tickets auto-created from conversation
7. RM notified via WhatsApp for hot leads
8. Branch dashboard shows real-time analytics

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend Runtime | Node.js 18+ |
| Web Framework | Express.js 4.x |
| Database | PostgreSQL 14+ |
| Cache | Redis 7+ (optional) |
| AI | OpenAI GPT-3.5 (optional) |
| Auth | JWT (jsonwebtoken) |
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP Client | Axios |
