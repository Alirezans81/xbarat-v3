# 🔧 Troubleshooting Guide - Xbarat v3

راهنمای رفع مشکلات معمول در توسعه و استقرار Xbarat v3.

---

## 📋 فهرست سریع

- [Setup Issues](#setup-issues)
- [Database Issues](#database-issues)
- [API & Backend](#api--backend)
- [Frontend Issues](#frontend-issues)
- [Deployment](#deployment)
- [Performance](#performance)

---

## 🔴 Setup Issues

### مشکل: `pnpm: command not found`

**علت:** pnpm نصب نشده

**حل:**

```bash
# نصب pnpm
npm install -g pnpm

# بررسی نسخه
pnpm --version
```

---

### مشکل: `node_modules` corrupted

**علت:** نسخه‌های ناسازگار یا کش خراب

**حل:**

```bash
# پاک کردن کامل
rm -rf node_modules pnpm-lock.yaml
rm -rf .next

# دوباره نصب
pnpm install

# یا اگر windows:
rmdir /s node_modules
del pnpm-lock.yaml
del /s /q .next
pnpm install
```

---

### مشکل: `Permission denied`

**علت:** مسائل دسترسی پرونده

**حل:**

```bash
# Linux/macOS
chmod +x scripts/*.sh

# یا پرونده خاص
chmod 755 filename

# Windows: Run as Administrator
```

---

### مشکل: `.env.local` variables not loading

**علت:** فایل نادرست یا مسیر غلط

**حل:**

```bash
# بررسی کنید .env.local در ریشه است
ls .env.local

# اگر وجود ندارد:
cp .env.example .env.local

# اضافه کنید متغیرهای صحیح
# ذخیره کنید و restart server
```

---

## 🔴 Database Issues

### مشکل: `ERROR: connect ECONNREFUSED 127.0.0.1:5432`

**علت:** PostgreSQL نشغال نیست

**حل:**

**Windows:**

```bash
# شروع PostgreSQL service
net start postgresql-x64-15

# یا از Services بررسی کنید
services.msc
```

**macOS:**

```bash
# اگر از Homebrew:
brew services start postgresql

# بررسی:
brew services list
```

**Linux:**

```bash
# شروع service
sudo systemctl start postgresql

# بررسی status
sudo systemctl status postgresql
```

**Docker:**

```bash
# اگر Docker استفاده می‌کنید:
docker-compose up -d postgres
```

---

### مشکل: `could not translate host name "postgres" to address`

**علت:** Docker network مشکل

**حل:**

```bash
# بررسی docker-compose
docker-compose ps

# Restart
docker-compose down
docker-compose up -d

# بررسی logs
docker-compose logs postgres
```

---

### مشکل: `EACCES: permission denied` (Database)

**علت:** مسائل permissions پایگاه داده

**حل:**

```bash
# Restart PostgreSQL service
sudo systemctl restart postgresql

# یا reset
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'password';"
```

---

### مشکل: `Prisma Client not generated`

**علت:** Prisma Client تولید نشده

**حل:**

```bash
# تولید Prisma Client
pnpm prisma generate

# یا complete:
pnpm prisma migrate dev
```

---

### مشکل: `schema.prisma not found`

**علت:** مسیر غلط

**حل:**

```bash
# بررسی وجود فایل
ls prisma/schema.prisma

# اجرای Prisma از ریشه پروژه:
pnpm prisma --version
```

---

### مشکل: Migration conflict

**علت:** migration files conflict یا تغییرات manual

**حل:**

```bash
# بررسی status
pnpm prisma migrate status

# اگر drift وجود دارد:
pnpm prisma migrate resolve --rolled-back "migration-name"

# یا reset کامل (فقط development):
pnpm prisma migrate reset --force

# سپس دوباره:
pnpm prisma migrate dev
```

---

### مشکل: `column "..." does not exist`

**علت:** Migration apply نشده

**حل:**

```bash
# اجرای migrations
pnpm prisma migrate deploy

# یا development:
pnpm prisma migrate dev

# بررسی database:
pnpm prisma studio
```

---

## 🔴 API & Backend

### مشکل: `POST /api/user/login` returns 401

**علت:** Authentication failure

**حل:**

```typescript
// بررسی کنید:
1. Database میں user موجود است؟
2. Password hash صحیح است؟
3. JWT_SECRET set شده؟

// Test:
pnpm prisma studio  // User را بررسی کنید
```

---

### مشکل: `TypeError: Cannot read property 'id' of null`

**علت:** User یا resource نیافت می‌شود

**حل:**

```typescript
// کد غلط:
const user = await prisma.user.findUnique({ where: { id } });
const id = user.id; // Error!

// کد درست:
const user = await prisma.user.findUnique({ where: { id } });
if (!user) throw new Error("User not found");
const id = user.id; // OK
```

---

### مشکل: `CORS error: Access denied`

**علت:** CORS not configured

**حل:**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
        ],
      },
    ];
  },
};
```

---

### مشکل: `500 Internal Server Error`

**علت:** Server-side exception

**حل:**

```bash
# بررسی logs
pnpm dev  # دیدن logs in console

# بررسی:
1. DATABASE_URL صحیح؟
2. Environment variables set؟
3. Prisma Client generated؟

# Restart server:
# 1. Ctrl+C
# 2. pnpm dev
```

---

### مشکل: `API timeout (504)`

**علت:** Query خیلی سریع یا database slow

**حل:**

```typescript
// Optimize query:
// بد:
const users = await prisma.user.findMany();
for (const user of users) {
  const wallets = await prisma.wallet.findMany({ where: { userId: user.id } });
}

// خوب:
const users = await prisma.user.findMany({
  include: { wallet: true },
});
```

---

## 🔴 Frontend Issues

### مشکل: `Module not found: can't resolve...`

**علت:** Import path غلط

**حل:**

```bash
# بررسی مسیر
ls src/components/... (فایلی که search کنید)

# استفاده از aliases
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// استفاده
import { Button } from '@/components/ui/button';
```

---

### مشکل: `useState is not defined`

**علت:** 'use client' directive فراموش شده

**حل:**

```typescript
// افزودن در ابتدای فایل:
"use client";

import { useState } from "react";

export function Component() {
  const [count, setCount] = useState(0);
  // ...
}
```

---

### مشکل: Page/Component not rendering

**علت:** Error boundary یا rendering issue

**حل:**

```bash
# بررسی browser console برای errors
# F12 → Console

# بررسی Next.js build:
pnpm build

# Restart dev server:
pnpm dev
```

---

### مشکل: Theme (dark/light) not working

**علت:** ThemeProvider not wrapped

**حل:**

```typescript
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

---

### مشکل: i18n not working

**علت:** locale routing not configured

**حل:**

```typescript
// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa", "de"],
  defaultLocale: "en",
});

// middleware.ts
export default createMiddleware(routing);
```

---

### مشکل: Form validation not working

**علت:** Validator not imported

**حل:**

```typescript
// استفاده validator:
import { validateEmail } from "@/lib/validators";

const email = "test@example.com";
if (!validateEmail(email)) {
  throw new Error("Invalid email");
}
```

---

## 🔴 Deployment

### مشکل: Vercel build fails

**علت:** TypeScript یا build errors

**حل:**

```bash
# بررسی locally اول:
pnpm build

# اگر error:
1. بررسی TypeScript: pnpm type-check
2. بررسی Lint: pnpm lint
3. بررسی Build: pnpm build

# Fix issues و retry
```

---

### مشکل: `Prisma Client version mismatch` on Vercel

**علت:** Different Node versions

**حل:**

```bash
# بروزرسانی prisma
pnpm add @prisma/client@latest

# یا specific version:
pnpm add @prisma/client@6.19.0

# Commit و push:
git add .
git commit -m "chore: update prisma"
git push
```

---

### مشکل: `DATABASE_URL not found` in production

**علت:** Environment variable not set

**حل:**

**Vercel:**

1. Settings → Environment Variables
2. اضافه کنید `DATABASE_URL`
3. Redeploy

**Docker:**

```bash
docker run -e DATABASE_URL="..." xbarat:latest
```

---

### مشکل: `502 Bad Gateway` after deployment

**علت:** App crash یا memory issue

**حل:**

```bash
# بررسی logs
vercel logs --prod

# بررسی environment:
vercel env ls

# Rollback
vercel rollback

# یا restart
vercel deploy --prod
```

---

### مشکل: Cold start too slow

**علت:** بزرگ bundle یا database query

**حل:**

```bash
# بررسی bundle size:
pnpm build
# چک کنید .next folder size

# Optimize:
1. Code splitting
2. Image optimization
3. Query optimization
```

---

## 🔴 Performance

### مشکل: Database query slow

**علت:** Missing indexes یا N+1 problem

**حل:**

```typescript
// بد - N+1:
const users = await prisma.user.findMany();
for (const user of users) {
  const wallet = await prisma.wallet.findFirst({ where: { userId: user.id } });
}

// خوب:
const users = await prisma.user.findMany({
  include: { wallet: true },
});

// یا explain:
const result = await prisma.$raw`
  EXPLAIN ANALYZE
  SELECT * FROM "User" WHERE id = $1
`;
console.log(result);
```

---

### مشکل: Memory leak

**علت:** Listener یا connection not closed

**حل:**

```typescript
// cleanup function:
useEffect(() => {
  const listener = () => {
    /* ... */
  };
  window.addEventListener("resize", listener);

  return () => {
    window.removeEventListener("resize", listener);
  };
}, []);
```

---

### مشکل: Build time too long

**علت:** بزرگ bundle یا slow transforms

**حل:**

```bash
# استفاده از Turbopack (Next.js):
pnpm dev --turbopack

# یا check:
pnpm build --analyze
```

---

## 🎯 General Debugging Tips

### 1. **استفاده از Console Logging**

```typescript
console.log("Debug:", variable);
console.table(array);
console.time("operation");
// ... code
console.timeEnd("operation");
```

### 2. **استفاده از Debugger**

```typescript
debugger; // کد موقتی
// سپس بررسی browser DevTools
```

### 3. **استفاده از Logger Library**

```typescript
import { logger } from "@/lib/logger";

logger.info("User logged in", { userId });
logger.error("Payment failed", { error });
```

### 4. **API Testing**

```bash
# استفاده از curl
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass"}'

# یا Postman
# یا Thunder Client VS Code extension
```

### 5. **Database Inspection**

```bash
# Prisma Studio
pnpm prisma studio

# Direct SQL
psql postgresql://...
SELECT * FROM "User";
```

---

## ✅ Checklist

اگر مشکل حل نشد:

- [ ] بررسی error message کامل
- [ ] بررسی logs (browser console, server logs)
- [ ] بررسی environment variables
- [ ] بررسی node/pnpm version
- [ ] بررسی database connection
- [ ] غوغل کنید error message
- [ ] بررسی GitHub Issues
- [ ] سوال در Slack/Discord

---

## 📞 Additional Resources

- [Next.js Troubleshooting](https://nextjs.org/docs/troubleshooting)
- [Prisma Troubleshooting](https://www.prisma.io/docs/orm/more/help-and-troubleshooting)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

---

## 🆘 Emergency Contacts

اگر مشکل حل نشد:

1. **Team Slack:** #xbarat-v3-support
2. **Tech Lead:** [name]
3. **GitHub Issues:** Create detailed issue

---

**آخرین به‌روزرسانی:** December 2024

_این راهنما در صورت مشکلات جدید به‌روزرسانی می‌شود._
