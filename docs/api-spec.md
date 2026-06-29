# WhatsApp Banking System - REST API Specification

**Base URL:** `http://localhost:5000/api`
**Authentication:** Bearer JWT token (except public endpoints)

---

## Authentication Endpoints

### POST /auth/login
Login for branch staff.

**Request:**
```json
{ "email": "amit.patel@bank.com", "password": "password123" }
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "Amit Patel", "role": "rm", "branch_code": "MumbaiMain" }
}
```

### POST /auth/otp/send
Send OTP to customer mobile.
```json
{ "mobile": "9876543210", "purpose": "login" }
```

### POST /auth/otp/verify
Verify OTP.
```json
{ "mobile": "9876543210", "otp": "123456", "purpose": "login" }
```

---

## Chat Endpoints

### POST /chat/simulate *(Public)*
Main endpoint for WhatsApp chat simulator.

**Request:**
```json
{
  "message": "Hi",
  "session_id": "optional-existing-session-id",
  "mobile": "9876543210"
}
```
**Response:**
```json
{
  "success": true,
  "session_id": "uuid-v4",
  "responses": ["Welcome to WhatsApp Banking! ...", "Please select language..."],
  "session_state": "LANGUAGE_SELECTION",
  "language": "en"
}
```

### POST /chat/reset
Reset conversation session.
```json
{ "session_id": "uuid-v4" }
```

### POST /chat/new-session
Create new chat session.
```json
{ "mobile": "9876543210" }
```

---

## WhatsApp Webhook

### GET /whatsapp/webhook
Webhook verification for Meta/WhatsApp.
Query params: `hub.mode`, `hub.verify_token`, `hub.challenge`

### POST /whatsapp/webhook
Receives messages from WhatsApp Business API.
Standard Meta webhook payload.

---

## Leads Endpoints *(Auth Required)*

### GET /leads
Get all leads with optional filters.

Query params:
- `urgency` - hot | warm | cold
- `status` - new | contacted | qualified | converted | lost
- `assigned_rm` - staff UUID (auto-applied for rm role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "mobile": "9876541001",
      "name": "Ravi Shankar",
      "product_interest": "Home Loan",
      "urgency": "hot",
      "status": "new",
      "notes": "Looking to buy a flat in 2 months",
      "assigned_rm": "uuid",
      "branch_code": "MumbaiMain",
      "created_at": "2024-06-28T10:30:00Z"
    }
  ],
  "total": 15
}
```

### GET /leads/analytics
Lead analytics summary.

### GET /leads/:id
Get single lead.

### POST /leads
Create new lead.
```json
{
  "mobile": "9876541099",
  "name": "Customer Name",
  "product_interest": "Home Loan",
  "urgency": "warm",
  "notes": "Optional notes"
}
```

### PUT /leads/:id
Update lead.
```json
{ "status": "contacted", "urgency": "hot", "notes": "Updated notes" }
```

---

## Tickets Endpoints *(Auth Required)*

### GET /tickets
Filters: `status`, `priority`

### GET /tickets/:id

### POST /tickets
```json
{
  "customer_id": "optional-uuid",
  "category": "Card Issue",
  "description": "Debit card not working",
  "priority": "high"
}
```

### PUT /tickets/:id
```json
{ "status": "in_progress", "resolution_notes": "Working on it" }
```

---

## Customers Endpoints *(Auth Required)*

### GET /customers
### GET /customers/:id
### POST /customers

---

## Staff Endpoints *(Auth Required)*

### GET /staff
### GET /staff/:id
### POST /staff *(branch_head/admin only)*
```json
{
  "name": "New Staff",
  "mobile": "9876500099",
  "email": "new.staff@bank.com",
  "role": "rm",
  "branch_code": "MumbaiMain",
  "password": "initial_password"
}
```
### PUT /staff/:id *(branch_head/admin only)*

---

## Products Endpoints

### GET /products *(Public)*
Query: `category` (loans|deposits|cards|insurance|nri)

### GET /products/:category *(Public)*

### POST /products *(Auth: branch_head/admin)*
### PUT /products/:id *(Auth: branch_head/admin)*

---

## FAQs Endpoints

### GET /faqs *(Public)*
Query: `category`

### GET /faqs/search *(Public)*
Query: `q` (search query), `language` (en|hi|gu)

### POST /faqs *(Auth Required)*
```json
{
  "question": "How to check balance?",
  "answer": "Reply 1 from main menu...",
  "category": "account",
  "language": "en",
  "keywords": ["balance", "check balance"]
}
```

### PUT /faqs/:id *(Auth Required)*
### DELETE /faqs/:id *(Auth Required)*

---

## Campaigns Endpoints *(Auth Required)*

### GET /campaigns
Query: `active` (true|false)

### GET /campaigns/:id

### POST /campaigns *(branch_head/admin)*
```json
{
  "name": "Campaign Name",
  "message_template": "Message text...",
  "target_segment": "all",
  "start_date": "2024-07-01",
  "end_date": "2024-08-31",
  "is_active": true
}
```

### PUT /campaigns/:id *(branch_head/admin)*

---

## Analytics Endpoints *(Auth Required)*

### GET /analytics/dashboard
Returns KPI metrics.
```json
{
  "total_leads": 15,
  "new_leads_this_month": 8,
  "conversion_rate": 13.3,
  "open_tickets": 7,
  "critical_tickets": 2,
  "active_conversations": 3,
  "hot_leads": 5,
  "warm_leads": 6,
  "cold_leads": 4
}
```

### GET /analytics/leads
Product-wise, status-wise, urgency-wise, daily breakdown.

### GET /analytics/conversations
Message counts, daily volume.

### GET /analytics/campaigns
Campaign performance with simulated metrics.

---

## Error Responses

All errors follow:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["field-level error 1", "field-level error 2"]
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid/expired token |
| 403 | Forbidden / insufficient role |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| rajesh.kumar@bank.com | password123 | Branch Head |
| priya.sharma@bank.com | password123 | Admin |
| amit.patel@bank.com | password123 | RM |
| sunita.joshi@bank.com | password123 | RM |

**Demo OTP:** `123456` (for any mobile number in demo mode)

**Demo Customer Mobiles:** 9876543210 through 9876543219
