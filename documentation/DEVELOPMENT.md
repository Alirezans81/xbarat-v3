# دستورالعمل راه‌اندازی و توسعه Xbarat v3

## 🚀 راه‌اندازی سریع

### 1️⃣ نیاز‌های سیستم

```bash
# بررسی نسخه Node.js
node --version  # باید >= 18.0.0

# بررسی نسخه npm
npm --version

# نصب pnpm (بهتر از npm)
npm install -g pnpm
pnpm --version
```

### 2️⃣ Clone Repository

```bash
git clone https://github.com/your-org/xbarat-v3.git
cd xbarat-v3
```

### 3️⃣ نصب Dependencies

```bash
# استفاده از pnpm (توصیه‌شده)
pnpm install

# یا npm
npm install

# یا yarn
yarn install
```

### 4️⃣ تنظیم متغیرهای محیطی

```bash
# کپی کردن فایل نمونه
cp .env.example .env.local
```

**فایل `.env.local`:**

```env
# 🔗 Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/xbarat_db"

# 🌐 Application
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# 🔐 Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRE="24h"

# ☁️ AWS S3 (برای بارگذاری فایل)
AWS_ACCESS_KEY_ID="your_access_key_id"
AWS_SECRET_ACCESS_KEY="your_secret_access_key"
AWS_S3_BUCKET="your-bucket-name"
AWS_REGION="us-east-1"

# 📧 Email (اختیاری)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 5️⃣ راه‌اندازی پایگاه داده

#### PostgreSQL نصب کنید:

**Windows:**

```bash
# دانلود و نصب از
https://www.postgresql.org/download/windows/

# یا استفاده از Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

**macOS:**

```bash
# استفاده از Homebrew
brew install postgresql
brew services start postgresql

# یا Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

**Linux:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### اجرای Migrations:

```bash
# مشاهده وضعیت Migrations
pnpm prisma migrate status

# اجرای تمام Migrations
pnpm prisma migrate deploy

# یا اگر در Development باشید
pnpm prisma migrate dev
```

### 6️⃣ شروع Development Server

```bash
pnpm dev
```

سرور شروع می‌شود در: `http://localhost:3000`

---

## 📁 ساختار پروژه برای Developers

```
xbarat-v3/
├── 📄 README.md              # توضیحات کلی
├── 📄 ARCHITECTURE.md        # معمارسازی تفصیلی
├── 📄 DEVELOPMENT.md         # این فایل
│
├── src/
│   ├── app/                  # صفحات و layouts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [locale]/
│   │       └── (group)/
│   │
│   ├── api/                  # API Endpoints
│   │   ├── routes.ts
│   │   ├── user/
│   │   │   └── route.ts
│   │   ├── wallet/
│   │   ├── deposit/
│   │   └── ... سایر endpoints
│   │
│   ├── components/           # کامپوننت‌های UI
│   │   ├── ui/              # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── navbar/
│   │   ├── footer/
│   │   └── ... سایر کامپوننت‌ها
│   │
│   ├── lib/                  # Utilities و Services
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── wallet.service.ts
│   │   │   └── ...
│   │   ├── validators/
│   │   ├── utils/
│   │   └── store.ts         # Zustand Store
│   │
│   ├── types/                # TypeScript Types
│   │   └── index.ts
│   │
│   ├── hooks/                # Custom React Hooks
│   │   └── useAuth.ts
│   │
│   ├── i18n/                 # بین‌المللی
│   │   └── routing.ts
│   │
│   └── middleware.ts         # Next.js Middleware
│
├── prisma/
│   ├── schema.prisma         # Database Schema
│   └── migrations/           # Migration History
│
├── messages/                 # ترجمه‌ها
│   ├── en.json
│   ├── fa.json
│   └── de.json
│
├── public/                   # فایل‌های static
├── uploads/                  # فایل‌های بارگذاری‌شده
│
├── .env.example              # متغیرهای محیطی نمونه
├── .env.local                # متغیرهای محیطی محلی (git ignored)
├── .gitignore
├── .prettierrc               # Prettier Config
├── .eslintrc.json            # ESLint Config
├── tsconfig.json             # TypeScript Config
├── tailwind.config.ts        # Tailwind Config
├── next.config.ts            # Next.js Config
├── postcss.config.mjs        # PostCSS Config
└── package.json              # Dependencies
```

---

## 🛠️ دستورات مفید

### Development

```bash
# شروع dev server با Turbopack
pnpm dev

# Linting
pnpm lint

# Format کردن کد با Prettier
pnpm format

# بررسی TypeScript
pnpm type-check
```

### Database

```bash
# مشاهده Prisma Studio (GUI)
pnpm prisma studio

# ایجاد migration جدید
pnpm prisma migrate dev --name add_new_table

# Reset کردن پایگاه داده (Development تنها)
pnpm prisma migrate reset

# Push تغییرات بدون migration
pnpm prisma db push

# Seed کردن (اگر فایل seed وجود داشته باشد)
pnpm prisma db seed
```

### Build & Production

```bash
# Build برای Production
pnpm build

# شروع Production Server
pnpm start

# Build و اجرا محلی
pnpm build && pnpm start
```

---

## 💻 کار با مدل‌های Database

### مثال 1: اضافه کردن فیلد جدید

**مرحله 1:** ویرایش `prisma/schema.prisma`

```prisma
model User {
  // ... existing fields
  phoneNumberVerifiedAt DateTime?    // فیلد جدید
}
```

**مرحله 2:** اجرای migration

```bash
pnpm prisma migrate dev --name add_phone_verified_at_to_user
```

**مرحله 3:** استفاده در کد

```typescript
const user = await prisma.user.update({
  where: { id: userId },
  data: { phoneNumberVerifiedAt: new Date() },
});
```

### مثال 2: ایجاد Relation جدید

```prisma
model User {
  id String @id @default(uuid())
  // ... other fields
  posts Post[]  // اضافه این خط
}

model Post {
  id String @id @default(uuid())
  title String
  userId String
  user User @relation(fields: [userId], references: [id])
}
```

سپس migration را اجرا کنید.

---

## 🎨 کار با کامپوننت‌ها

### ایجاد کامپوننت جدید

**مثال: CurrencySelector**

```typescript
// src/components/currency/currency-selector.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";

interface CurrencySelectorProps {
  onSelect: (currencyId: string) => void;
}

export function CurrencySelector({ onSelect }: CurrencySelectorProps) {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // دریافت ارزها از API
    fetch("/api/currency")
      .then((r) => r.json())
      .then((data) => {
        setCurrencies(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Select onValueChange={onSelect}>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.id} value={currency.id}>
            {currency.code} - {currency.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### استفاده از کامپوننت

```typescript
// در صفحه‌ای دیگر
import { CurrencySelector } from "@/components/currency/currency-selector";

export default function DepositPage() {
  const handleCurrencySelect = (currencyId: string) => {
    console.log("Selected:", currencyId);
  };

  return (
    <div>
      <CurrencySelector onSelect={handleCurrencySelect} />
    </div>
  );
}
```

---

## 🔗 کار با API

### ایجاد Endpoint جدید

**مثال 1: دریافت تاریخچه تراکنش‌های کاربر**

```typescript
// src/api/transaction/route.ts
import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // احراز هویت کاربر
    const user = await verifyAuth(request);

    // دریافت query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    // دریافت تراکنش‌ها
    const transactions = await prisma.$queryRaw`
      SELECT * FROM (
        SELECT id, amount, 'deposit' as type, "createdAt" FROM "Deposit" 
        WHERE "userId" = ${user.id}
        UNION ALL
        SELECT id, amount, 'withdrawal' as type, "createdAt" FROM "Withdrawal"
        WHERE "userId" = ${user.id}
      ) ORDER BY "createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    return Response.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 }
    );
  }
}
```

**مثال 2: تغییر رمز عبور**

```typescript
// src/api/user/change-password/route.ts
import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Response.json(
        {
          success: false,
          error: "All fields required",
          code: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return Response.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // بررسی رمز عبور فعلی
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      return Response.json(
        { success: false, error: "Current password incorrect" },
        { status: 400 }
      );
    }

    // Hash و بروزرسانی
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedNewPassword },
    });

    return Response.json({
      success: true,
      data: { message: "Password changed successfully" },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

**مثال 3: بروزرسانی پروفایل**

```typescript
// src/api/user/profile/route.ts
import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    const {
      fullName,
      avatarUrl,
      nationality,
      language,
      dateOfBirth,
      address,
      city,
      state,
      postalCode,
    } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(fullName && { fullName }),
        ...(avatarUrl && { avatarUrl }),
        ...(nationality && { nationality }),
        ...(language && { language }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(postalCode && { postalCode }),
      },
    });

    return Response.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### فراخوانی API از Client

```typescript
"use client";

import { useEffect, useState } from "react";

export function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transaction?limit=20");
        const data = await response.json();

        if (data.success) {
          setTransactions(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {transactions.map((tx) => (
        <div key={tx.id}>
          <p>
            {tx.type}: ${tx.amount}
          </p>
          <p>{new Date(tx.createdAt).toLocaleDateString("fa-IR")}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🌍 کار با بین‌المللی

### اضافه کردن پیام جدید

**مرحله 1:** بروزرسانی `messages/en.json`

```json
{
  "wallet": {
    "balance": "Balance",
    "transfer": "Transfer Funds"
  }
}
```

**مرحله 2:** بروزرسانی `messages/fa.json`

```json
{
  "wallet": {
    "balance": "موجودی",
    "transfer": "انتقال پول"
  }
}
```

**مرحله 3:** استفاده در کد

```typescript
import { useTranslations } from "next-intl";

export function WalletCard() {
  const t = useTranslations();

  return (
    <div>
      <h2>{t("wallet.balance")}</h2>
      <button>{t("wallet.transfer")}</button>
    </div>
  );
}
```

---

## 🧪 تست‌گذاری

### Unit Test مثال

```typescript
// src/lib/utils/calculations.test.ts
import { calculateFee } from "./calculations";

describe("calculateFee", () => {
  it("should calculate fee correctly", () => {
    const amount = 100;
    const feePercentage = 0.02; // 2%
    const result = calculateFee(amount, feePercentage);

    expect(result).toBe(2);
  });

  it("should handle zero amount", () => {
    const result = calculateFee(0, 0.02);
    expect(result).toBe(0);
  });
});
```

---

## 📝 استانداردهای کد

### Naming Convention

```typescript
// ✅ صحیح
function calculateUserBalance() {}
const userId = "123";
const PAYMENT_TIMEOUT = 5000;

// ❌ غلط
function calc_user_balance() {}
const user_id = "123";
const payment_timeout = 5000;
```

### File Naming

```
// ✅ صحیح
- components/wallet/wallet-card.tsx
- lib/services/auth.service.ts
- hooks/useAuth.ts
- types/user.ts

// ❌ غلط
- components/WalletCard.tsx (باید kabab-case)
- lib/services/AuthService.ts
- hooks/useauth.ts
- types/User.ts
```

### TypeScript Best Practices

```typescript
// ✅ صحیح
interface User {
  id: string;
  email: string;
}

const user: User = {
  id: "1",
  email: "user@example.com",
};

// ❌ غلط
const user: any = {};
```

---

## 🐛 Debugging

### استفاده از Prisma Studio

```bash
pnpm prisma studio
```

سپس `http://localhost:5555` را باز کنید برای مشاهده و ویرایش داده‌ها.

### Logging

```typescript
// سرتاسر کد
console.log("Debug message:", variable);

// بهتر:
import { logger } from "@/lib/logger";
logger.info("User logged in", { userId: user.id });
logger.error("Payment failed", { error });
```

### Browser DevTools

```javascript
// در Console browser
// بررسی Zustand Store
window.__ZUSTAND__;

// بررسی Network
// Network tab → اپی کال‌ها رو چک کنید
```

---

## 🚀 Deployment

### Vercel Deployment

```bash
# نصب Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**فایل `vercel.json`:**

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install"
}
```

### Docker Deployment

```bash
# Build Docker Image
docker build -t xbarat:latest .

# Run Container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  xbarat:latest
```

---

## 📚 منابع مفید

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## 📞 کمک و پشتیبانی

**مشکلات معمول:**

1. **Database Connection Failed**

   ```bash
   # بررسی کنید DATABASE_URL درست است
   # PostgreSQL در حال اجرا است
   pnpm prisma db push
   ```

2. **Port Already in Use**

   ```bash
   # تغییر port در command
   pnpm dev -- -p 3001
   ```

3. **Node Modules Corrupted**
   ```bash
   # پاک کردن و دوباره نصب
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

---

**Happy Coding! 🎉**
