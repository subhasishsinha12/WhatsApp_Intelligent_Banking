# WhatsApp Banking System - Deployment Guide

## Quick Start (Development / Demo)

The system runs fully without a database or Redis - it uses in-memory storage in demo mode.

### Prerequisites
- Node.js 18+
- npm 9+

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (defaults work for demo)
npm start
```

Backend starts at http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at http://localhost:3000

### Access Points

| URL | Description |
|-----|-------------|
| http://localhost:3000/chat | WhatsApp Chat Simulator |
| http://localhost:3000/login | Staff Login |
| http://localhost:3000/dashboard | Analytics Dashboard |
| http://localhost:3000/leads | Leads Management |
| http://localhost:5000/health | Backend Health Check |
| http://localhost:5000/api/chat/simulate | Chat API |

---

## Full Production Setup

### 1. Database (PostgreSQL)

```bash
# Install PostgreSQL 14+
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE whatsapp_banking;
CREATE USER banking_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE whatsapp_banking TO banking_user;

# Run schema
psql -U banking_user -d whatsapp_banking -f database/schema.sql

# Run seed data
psql -U banking_user -d whatsapp_banking -f database/seed.sql
```

### 2. Redis

```bash
sudo apt install redis-server
sudo systemctl enable redis
sudo systemctl start redis
```

### 3. Environment Configuration

```bash
# backend/.env
PORT=5000
DATABASE_URL=postgresql://banking_user:secure_password@localhost:5432/whatsapp_banking
REDIS_URL=redis://localhost:6379
JWT_SECRET=generate-a-strong-64-char-random-string-here
OPENAI_API_KEY=sk-your-openai-api-key
WHATSAPP_TOKEN=your-whatsapp-business-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-custom-verify-token
NODE_ENV=production
DEMO_MODE=false
FRONTEND_URL=https://your-frontend-domain.com
```

### 4. WhatsApp Business API Setup

1. Create a Meta Developer Account at developers.facebook.com
2. Create a WhatsApp Business App
3. Get Phone Number ID and Access Token
4. Configure webhook URL: `https://your-backend-domain.com/api/whatsapp/webhook`
5. Set verify token to match `WHATSAPP_VERIFY_TOKEN`
6. Subscribe to `messages` webhook field

### 5. Production Start

```bash
# Install PM2 process manager
npm install -g pm2

# Start backend
cd backend
pm2 start src/index.js --name whatsapp-banking-api

# Build and serve frontend
cd frontend
npm run build
# Serve dist/ with nginx or similar

# PM2 auto-restart on boot
pm2 startup
pm2 save
```

---

## Nginx Configuration (Frontend + Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend (React build)
    location / {
        root /var/www/whatsapp-banking/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Docker Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/whatsapp_banking
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret
      - NODE_ENV=production
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: whatsapp_banking
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./database/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

---

## Health Monitoring

```bash
# Check backend health
curl http://localhost:5000/health

# Check logs
pm2 logs whatsapp-banking-api

# Monitor
pm2 monit
```

---

## Conversation Testing

1. Open http://localhost:3000/chat
2. Send "Hi" to start a conversation
3. Select language (1=English)
4. Select "1" for existing customer
5. Enter mobile: `9876543210`
6. Enter OTP: `123456` (demo OTP)
7. Explore the menu options

## Demo Credentials

- Staff login: `rajesh.kumar@bank.com` / `password123`
- Customer mobile: `9876543210`
- Demo OTP: `123456`
