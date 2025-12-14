# Deployment Guide - Xbarat v3

## 📦 راهنمای Deployment

این سند شامل تمام مراحل برای deployment Xbarat v3 به Production است.

---

## 🎯 Deployment Options

| Platform     | سختی  | هزینه     | توصیه                  |
| ------------ | ----- | --------- | ---------------------- |
| Vercel       | آسان  | Free-Pro  | ✅ بهترین برای Next.js |
| Heroku       | متوسط | $7-50/ماه | خوب، دارای محدودیت     |
| AWS          | سخت   | Variable  | برای scale بزرگ        |
| DigitalOcean | متوسط | $5+/ماه   | ارزان و قابل اعتماد    |
| Docker       | متوسط | VPS Cost  | کنترل بیشتر            |

---

## 🚀 Vercel (توصیه‌شده)

### مرحله 1: آماده‌سازی

```bash
# Vercel CLI نصب کنید
npm i -g vercel

# یا استفاده از Vercel Dashboard
# https://vercel.com
```

### مرحله 2: ایجاد `vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "nodeVersion": "18.x"
}
```

### مرحله 3: متغیرهای محیطی

در Vercel Dashboard:

```
Settings → Environment Variables
```

اضافه کنید:

```
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
AWS_ACCESS_KEY_ID=***
AWS_SECRET_ACCESS_KEY=***
AWS_S3_BUCKET=your-bucket
AWS_REGION=us-east-1
```

### مرحله 4: Push و Deploy

```bash
# بروش اول: GitHub connection
# 1. Push کد به GitHub
git push origin main

# 2. Vercel خودکار detect و deploy می‌کند

# بروش دوم: Vercel CLI
vercel --prod
```

### مرحله 5: Domain Setup

```
Settings → Domains
```

اضافه کنید domain خود

---

## 🐳 Docker Deployment

### Dockerfile (اگر موجود نباشد)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# نصب pnpm
RUN npm install -g pnpm

# کپی کردن package files
COPY pnpm-lock.yaml ./
COPY package.json ./

# نصب dependencies
RUN pnpm install --frozen-lockfile

# کپی کردن کل پروژه
COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start command
CMD ["pnpm", "start"]
```

### Docker Compose (برای Development)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: xbarat_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/xbarat_db
      JWT_SECRET: dev-secret-key
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### اجرای Docker

```bash
# Build image
docker build -t xbarat:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  xbarat:latest

# یا Docker Compose
docker-compose up -d
```

---

## 🟦 AWS Deployment

### انتخاب بین ECS و EC2

**EC2 (ارزان‌تر):**

```bash
# SSH به instance
ssh -i your-key.pem ec2-user@your-instance

# نصب Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash
sudo yum install -y nodejs

# Clone repo
git clone https://github.com/your-org/xbarat-v3.git
cd xbarat-v3

# نصب dependencies
npm install -g pnpm
pnpm install

# تنظیم .env
nano .env

# تنظیم database
pnpm prisma migrate deploy

# شروع app
pnpm build
pnpm start
```

**ECS (بهتر برای scaling):**

```bash
# Push image to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

docker build -t xbarat:latest .

docker tag xbarat:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/xbarat:latest

docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/xbarat:latest

# سپس ECS Task تعریف کنید
```

---

## 🔄 DigitalOcean App Platform

### مرحله 1: Connect GitHub

```
Create App → GitHub → Select Repository
```

### مرحله 2: تنظیمات

**Build Command:**

```
pnpm build
```

**Run Command:**

```
pnpm start
```

### مرحله 3: متغیرهای محیطی

```
Add Environment Variables
DATABASE_URL=...
JWT_SECRET=...
```

### مرحله 4: Database

```
Create Database → PostgreSQL
Connect to App
```

---

## 🔐 متغیرهای محیطی برای Production

**بسیار مهم:**

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://xbarat.com

# Database (استفاده از managed service)
DATABASE_URL=postgresql://user:pass@db.example.com:5432/xbarat

# Security
JWT_SECRET=generate-strong-random-string-here-min-32-chars
JWT_EXPIRE=24h

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=xbarat-production
AWS_REGION=us-east-1

# Email (اختیاری)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Monitoring
SENTRY_DSN=https://...@sentry.io/...

# Analytics
GOOGLE_ANALYTICS_ID=UA-...
```

### تولید JWT_SECRET امن

```bash
# Linux/macOS
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

---

## 📋 Pre-Deployment Checklist

قبل از deploy:

### Code

- [ ] تمام branches merged هستند
- [ ] Tests pass می‌کنند
- [ ] Lint errors نیستند
- [ ] TypeScript strict mode OK است

### Database

- [ ] تمام migrations فراخوانی‌شده‌اند
- [ ] Backups ready هستند
- [ ] Connection string صحیح است

### Security

- [ ] SECRET keys محفوظ هستند
- [ ] NO hardcoded secrets
- [ ] HTTPS enabled است
- [ ] CORS configured است
- [ ] Rate limiting active است

### Performance

- [ ] Images optimized هستند
- [ ] Bundle size reasonable است
- [ ] Database queries optimized هستند
- [ ] CDN configured (اختیاری)

### Monitoring

- [ ] Logging configured است
- [ ] Error tracking (Sentry) ready است
- [ ] Health check endpoint موجود است

---

## 🚀 Deployment Process

### 1. Staging Deployment

```bash
# Deploy به staging environment اول
git push origin develop

# Test تمام functionality
# Check performance
# Test payment gateways

# اگر OK بود، merge به main
git checkout main
git merge develop
git push origin main
```

### 2. Production Deployment

```bash
# Tag version
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Vercel/Platform خودکار deploy می‌کند
# یا manual deploy:
vercel --prod
```

### 3. Post-Deployment

```bash
# بررسی logs
vercel logs --prod

# Test endpoints
curl https://xbarat.com/api/currency

# Monitor errors
# (Sentry/monitoring service)

# Communicate with team
# Update status page
```

---

## 🔄 Database Migration في Production

**بسیار خطرناک! دقت کنید:**

```bash
# 1. Backup تمام datat
pg_dump postgresql://... > backup.sql

# 2. Test migration locally
# 3. Test on staging
# 4. جدولی برنامه‌ریزی شده

# 5. Production migration
pnpm prisma migrate deploy

# 6. Verify
pnpm prisma db execute --stdin < verify.sql

# 7. Rollback plan ready (اگر لازم شد)
```

---

## 📊 Monitoring & Logging

### Health Check Endpoint

```typescript
// src/api/health/route.ts
export async function GET() {
  try {
    // بررسی database connection
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

### Sentry Integration

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### استفاده در error handling

```typescript
try {
  await complexOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { operation: "complexOperation" },
  });
  throw error;
}
```

---

## 🔄 Rollback Plan

اگر deployment مشکل داشت:

```bash
# Vercel
vercel rollback

# Git (اگر local)
git revert commit-hash
git push origin main

# Database
# اگر migration مشکل داشت:
pnpm prisma migrate resolve --rolled-back "migration-name"

# دوباره deploy previous version
```

---

## 🔐 SSL/HTTPS

### Vercel

خودکار HTTPS فراهم می‌کند ✅

### Custom Domain with Let's Encrypt

```bash
# Certbot
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d xbarat.com -d www.xbarat.com
```

---

## 📈 Auto-Scaling Setup

### Vercel

خودکار scaling ✅

### Docker with Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xbarat
spec:
  replicas: 3
  selector:
    matchLabels:
      app: xbarat
  template:
    metadata:
      labels:
        app: xbarat
    spec:
      containers:
        - name: xbarat
          image: xbarat:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: xbarat-secrets
                  key: database-url
```

---

## 🛡️ DDoS & Security

### Rate Limiting (Vercel)

خودکار ✅

### Custom Rate Limiting

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for");
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  // Process request
}
```

---

## 📊 Performance Monitoring

### Vercel Analytics

```typescript
// Automatic with Next.js
// یا custom metrics

import { reportWebVitals } from "next/vitals";

export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions مثال

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2

      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm build

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Troubleshooting

### App crashes on startup

```bash
# بررسی logs
vercel logs --prod --tail

# بررسی database connection
# بررسی environment variables

# Rollback
vercel rollback
```

### Database connection timeout

```bash
# بررسی DATABASE_URL
# بررسی firewall rules
# بررسی connection pool

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### OOM (Out of Memory)

```bash
# Node memory increase
# یا scaling به instance بزرگ‌تر
```

---

## 📚 منابع

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Docker Documentation](https://docs.docker.com/)

---

## ✅ Checklist نهایی

- [ ] تمام tests pass
- [ ] Staging environment OK
- [ ] Backups ready
- [ ] Team نوتیفای شده
- [ ] Monitoring active
- [ ] Runbook ready
- [ ] Rollback plan ready
- [ ] Post-deployment QA ready

---

**Ready for Production? 🚀**

**آخرین به‌روزرسانی:** December 2024
