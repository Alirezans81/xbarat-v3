# Xbarat v3 - پلتفرم تبادل ارز دیجیتال

## 📋 فهرست مطالب

1. [معرفی پروژه](#معرفی-پروژه)
2. [ویژگی‌های اصلی](#ویژگی‌های-اصلی)
3. [معمارسازی](#معمارسازی)
4. [راه‌اندازی](#راه‌اندازی)
5. [ساختار پروژه](#ساختار-پروژه)
6. [پایگاه داده](#پایگاه-داده)
7. [API](#api)
8. [کامپوننت‌های UI](#کامپوننت‌های-ui)
9. [تنظیمات بین‌المللی](#تنظیمات-بین‌المللی)
10. [مشخصات فنی](#مشخصات-فنی)

---

## معرفی پروژه

**Xbarat v3** یک پلتفرم تبادل ارز دیجیتال و بین‌المللی است که امکان انجام عملیات واریزی، برداشتی و تبادل ارزها را فراهم می‌کند.

**نسخه:** 0.1.0  
**وضعیت:** در حال توسعه  
**زبان اصلی:** TypeScript  
**فریم‌ورک:** Next.js 16

---

## ویژگی‌های اصلی

### 👥 مدیریت کاربران

- ثبت‌نام و ورود امن
- تایید ایمیل و شماره تلفن
- سیستم KYC (شناخت و تعیین هویت مشتری)
- پروفایل کاربری با اطلاعات شخصی
- سطح‌های دسترسی متفاوت (CUSTOMER, ADMIN, etc.)

### 💰 عملیات مالی

- **واریزی:** پذیرش پول از کاربر
- **برداشتی:** انتقال پول به کاربر
- **تبادل ارز:** تبادل بین ارزهای مختلف
- **انتقال درون‌سکویی:** انتقال میان کیف‌پول‌های کاربر
- **مدیریت نقدینگی:** مدیریت استخرهای نقدینگی

### 🔒 امنیت و KYC

- رمزگذاری رمز عبور با bcrypt
- JWT برای احراز هویت
- بارگذاری سند هویتی
- مراحل تصدیق هویت

### 🌐 پشتیبانی چندزبانه

- انگلیسی (EN)
- فارسی (FA)
- آلمانی (DE)
- استفاده از `next-intl`

### 🎨 رابط کاربری

- طراحی modern با Tailwind CSS
- کامپوننت‌های reusable
- تم‌های روز/شب
- تجربه واکنش‌پذیر

---

## معمارسازی

```
┌─────────────────────────────────────────┐
│           Next.js Frontend              │
│    (React + TypeScript + Tailwind)      │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│         API Routes (Next.js)            │
│    (Bridge Transfer, Currency, etc.)    │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│        Prisma ORM                       │
│    (مدیریت پایگاه داده)                  │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│      PostgreSQL Database                │
│    (ذخیره‌سازی داده‌ها)                  │
└─────────────────────────────────────────┘
```

### اصول معمارسازی:

- **Separation of Concerns:** جداسازی روطق تجاری از UI
- **Component-Based:** ساخت‌پذیری بر اساس کامپوننت‌ها
- **Type Safety:** استفاده گسترده از TypeScript
- **Database-First:** طراحی Prisma Schema کامل

---

## راه‌اندازی

### پیش‌نیازها

- Node.js 18+
- PostgreSQL 12+
- pnpm (یا npm/yarn)
- Docker (اختیاری)

### نصب و اجرا

#### 1. نصب Dependencies

```bash
pnpm install
```

#### 2. تنظیم متغیرهای محیطی

```bash
cp .env.example .env.local
```

**متغیرهای مورد نیاز:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/xbarat_db
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

#### 3. اجرای Migrations

```bash
pnpm prisma migrate dev
```

#### 4. ایجاد Seed Data (اختیاری)

```bash
pnpm prisma db seed
```

#### 5. اجرای Development Server

```bash
pnpm dev
```

سرور در `http://localhost:3000` در دسترس خواهد بود.

#### 6. Build برای Production

```bash
pnpm build
pnpm start
```

---

## ساختار پروژه

```
xbarat-v3/
├── src/
│   ├── api/                    # API Routes
│   │   ├── bridge-transfer/   # مدیریت انتقال‌های پل
│   │   ├── currency/          # مدیریت ارزها
│   │   ├── currency-pair/     # نرخ ارز‌ها
│   │   ├── fee-user/          # مدیریت کمیسیون
│   │   ├── liquidity-pool/    # استخرهای نقدینگی
│   │   ├── payment-channel/   # کانال‌های پرداخت
│   │   ├── user/              # مدیریت کاربر
│   │   ├── wallet/            # مدیریت کیف‌پول
│   │   └── routes.ts          # تعریف API Routes
│   │
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Layout کلی
│   │   ├── page.tsx           # صفحه اول
│   │   └── [locale]/          # Route بندی چندزبانه
│   │
│   ├── components/             # کامپوننت‌های React
│   │   ├── ui/                # کامپوننت‌های پایه (Button, Input, etc.)
│   │   ├── navbar/            # نوار بالای صفحه
│   │   ├── footer/            # پاتوق صفحه
│   │   ├── currency/          # کامپوننت‌های ارز
│   │   ├── wallet/            # کامپوننت‌های کیف‌پول
│   │   ├── fee-user/          # کامپوننت‌های کمیسیون
│   │   └── dialog/            # Dialog Modal
│   │
│   ├── constants/              # ثابت‌های پروژه
│   ├── hooks/                 # Custom React Hooks
│   ├── i18n/                  # تنظیمات بین‌المللی
│   ├── lib/                   # توابع یکدستی
│   ├── middleware.ts          # میان‌افزار Next.js
│   ├── providers/             # Context Providers
│   ├── types/                 # Type Definitions
│   └── fonts/                 # فایل‌های فونت
│
├── prisma/
│   ├── schema.prisma          # Prisma Data Model
│   ├── migrations/            # تاریخ تغییرات پایگاه داده
│   └── triggers.sql           # Trigger‌های پایگاه داده
│
├── messages/                   # فایل‌های ترجمه
│   ├── en.json               # انگلیسی
│   ├── fa.json               # فارسی
│   └── de.json               # آلمانی
│
├── public/                     # فایل‌های عمومی (تصاویر, etc.)
├── uploads/                    # آپلود‌های کاربر
│
├── components.json             # تنظیمات shadcn/ui
├── Dockerfile                  # تنظیمات Docker
├── eslint.config.mjs          # قوانین ESLint
├── next.config.ts             # تنظیمات Next.js
├── postcss.config.mjs         # تنظیمات PostCSS
├── tailwind.config.ts         # تنظیمات Tailwind CSS
├── tsconfig.json              # تنظیمات TypeScript
└── package.json               # وابستگی‌های پروژه
```

---

## پایگاه داده

### مدل‌های اصلی

#### 👤 User

کاربر سیستم با اطلاعات شخصی و KYC

```
- id: UUID (Primary Key)
- email: String (Unique)
- phoneNumber: String (Unique)
- fullName: String
- passwordHash: String
- countryCode: String
- kycStatus: KycStatus (PENDING, APPROVED, REJECTED)
- role: UserRole (CUSTOMER, ADMIN)
- isPhoneVerified: Boolean
- isEmailVerified: Boolean
- isDeleted: Boolean
```

#### 💵 Currency

تعریف ارزهای پشتیبانی‌شده

```
- id: UUID
- code: String (مثل USD, EUR)
- name: String
- symbol: String
- decimals: Int (تعداد اعشار)
```

#### 📊 CurrencyPair

نرخ‌های تبادل ارزی

```
- id: UUID
- fromCurrency: Currency
- toCurrency: Currency
- rate: Decimal (نرخ تبادل)
- feePercentage: Decimal (کمیسیون)
- isActive: Boolean
```

#### 🏦 PaymentChannel

کانال‌های پرداخت (درگاه‌ها)

```
- id: UUID
- name: String
- description: String
- currencies: Currency[] (ارزهای پشتیبانی‌شده)
```

#### 💼 Wallet

کیف‌پول کاربر برای هر ارز

```
- id: UUID
- user: User
- currency: Currency
- balance: Decimal (موجودی)
- frozen: Decimal (موجودی بلوکه‌شده)
```

#### 📥 Deposit

سابقه واریزی‌های کاربر

```
- id: UUID
- user: User
- wallet: Wallet
- amount: Decimal
- status: DepositStatus (PENDING, APPROVED, etc.)
- paymentChannel: PaymentChannel
```

#### 📤 Withdrawal

سابقه برداشتی‌های کاربر

```
- id: UUID
- user: User
- wallet: Wallet
- amount: Decimal
- status: WithdrawalStatus
- receiverAddress: String
- paymentChannel: PaymentChannel
```

#### 🌉 BridgeTransfer

انتقال پل برای همگام‌سازی واریزی و برداشتی

```
- id: UUID
- status: BridgeStatus (AWAITING_PAYMENT, COMPLETED, etc.)
- amount: Decimal
- deposit: Deposit (اختیاری)
- withdrawal: Withdrawal (اختیاری)
```

#### 💳 Transfer

انتقال میان کیف‌پول‌ها

```
- id: UUID
- fromWallet: Wallet
- toWallet: Wallet
- amount: Decimal
- status: TransferStatus
```

#### 🏊 LiquidityPool

استخرهای نقدینگی برای هر ارز

```
- id: UUID
- paymentChannel: PaymentChannel
- currency: Currency
- balance: Decimal
- frozen: Decimal
- address: String
```

### Enums

```typescript
enum KycStatus {
  PENDING
  APPROVED
  REJECTED
}

enum UserRole {
  CUSTOMER
  ADMIN
}

enum DepositStatus {
  PENDING
  APPROVED
  COMPLETED
  REJECTED
  FAILED
}

enum WithdrawalStatus {
  PENDING
  APPROVAL
  AWAITING_APPROVAL
  APPROVED
  COMPLETED
  REJECTED
}

enum BridgeStatus {
  AWAITING_PAYMENT
  CHECK_STATUS
  COMPLETED
  FAILED
}

enum TransferStatus {
  PENDING
  COMPLETED
  FAILED
}

enum DocumentType {
  PASSPORT
  NATIONAL_ID
  DRIVING_LICENSE
}
```

### Migrations

تمام تغییرات پایگاه داده در فولدر `prisma/migrations/` ثبت می‌شوند:

- **20250710064205_reset:** تنظیم اولیه
- **20250710065822_add_is_deleted_to_user:** افزودن soft delete
- **20250720090539_add_currency_pair_model:** افزودن مدل CurrencyPair
- **20251001093959_rename_initiator_field_to_user_in_exchange:** تعریف Exchange Model
- **20251026082908_change_bridge_transfer_statuses:** بروزرسانی وضعیت‌های BridgeTransfer
- و تعداد زیادی migration دیگر...

---

## API

### ساختار API Routes

تمام API endpoints در `src/api/` قرار دارند.

#### 👤 User API

**Base URL:** `/api/user`

| Method | Endpoint        | توضیح                |
| ------ | --------------- | -------------------- |
| POST   | `/register`     | ثبت‌نام کاربر جدید   |
| POST   | `/login`        | ورود کاربر           |
| GET    | `/profile`      | دریافت پروفایل کاربر |
| PUT    | `/profile`      | بروزرسانی پروفایل    |
| POST   | `/verify-email` | تایید ایمیل          |
| POST   | `/verify-phone` | تایید شماره تلفن     |
| POST   | `/kyc`          | ارسال اطلاعات KYC    |

#### 💵 Currency API

**Base URL:** `/api/currency`

| Method | Endpoint | توضیح                  |
| ------ | -------- | ---------------------- |
| GET    | `/`      | دریافت لیست ارزها      |
| GET    | `/:id`   | دریافت جزئیات ارز      |
| POST   | `/`      | ایجاد ارز جدید (Admin) |
| PUT    | `/:id`   | بروزرسانی ارز (Admin)  |

#### 📊 Currency Pair API

**Base URL:** `/api/currency-pair`

| Method | Endpoint | توضیح                  |
| ------ | -------- | ---------------------- |
| GET    | `/`      | دریافت نرخ‌های تبادل   |
| GET    | `/:id`   | دریافت جزئیات نرخ      |
| POST   | `/`      | ایجاد نرخ جدید (Admin) |
| PUT    | `/:id`   | بروزرسانی نرخ (Admin)  |

#### 💼 Wallet API

**Base URL:** `/api/wallet`

| Method | Endpoint    | توضیح                    |
| ------ | ----------- | ------------------------ |
| GET    | `/`         | دریافت کیف‌پول‌های کاربر |
| GET    | `/:id`      | دریافت جزئیات کیف‌پول    |
| POST   | `/transfer` | انتقال میان کیف‌پول‌ها   |

#### 📥 Deposit API

**Base URL:** `/api/deposit`

| Method | Endpoint | توضیح                 |
| ------ | -------- | --------------------- |
| POST   | `/`      | ایجاد درخواست واریزی  |
| GET    | `/`      | دریافت لیست واریزی‌ها |
| GET    | `/:id`   | دریافت جزئیات واریزی  |

#### 📤 Withdrawal API

**Base URL:** `/api/withdrawal`

| Method | Endpoint | توضیح                  |
| ------ | -------- | ---------------------- |
| POST   | `/`      | ایجاد درخواست برداشتی  |
| GET    | `/`      | دریافت لیست برداشتی‌ها |
| GET    | `/:id`   | دریافت جزئیات برداشتی  |

#### 🌉 Bridge Transfer API

**Base URL:** `/api/bridge-transfer`

| Method | Endpoint | توضیح                 |
| ------ | -------- | --------------------- |
| GET    | `/`      | دریافت لیست انتقال‌ها |
| GET    | `/:id`   | دریافت جزئیات انتقال  |

#### 🏦 Payment Channel API

**Base URL:** `/api/payment-channel`

| Method | Endpoint | توضیح                    |
| ------ | -------- | ------------------------ |
| GET    | `/`      | دریافت کانال‌های پرداخت  |
| POST   | `/`      | ایجاد کانال جدید (Admin) |

#### 🏊 Liquidity Pool API

**Base URL:** `/api/liquidity-pool`

| Method | Endpoint | توضیح                    |
| ------ | -------- | ------------------------ |
| GET    | `/`      | دریافت استخرهای نقدینگی  |
| POST   | `/`      | ایجاد استخر جدید (Admin) |

### فرمت پاسخ API

**موفق:**

```json
{
  "success": true,
  "data": {},
  "message": "عملیات موفق"
}
```

**ناموفق:**

```json
{
  "success": false,
  "error": "توضیح خطا",
  "code": "ERROR_CODE"
}
```

### احراز هویت

تمام API endpoints محافظت‌شده نیاز به JWT Token دارند:

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## کامپوننت‌های UI

### کامپوننت‌های پایه (UI)

کامپوننت‌های پایه در `src/components/ui/` قرار دارند:

- **Button:** دکمه‌های متنوع
- **Input:** فیلدهای ورودی
- **Select:** لیست انتخابی
- **Dialog:** پنجره‌های modal
- **Alert:** پیام‌های هشدار
- **Avatar:** تصویر پروفایل
- **Tabs:** تب‌های صفحه
- **Table:** جداول داده
- **Tooltip:** راهنمایی
- و بقیه کامپوننت‌های shadcn/ui

### کامپوننت‌های بخش‌خاص

#### Navbar

`src/components/navbar/navbar.tsx`

- منو اصلی
- دکمه ورود/خروج
- تغییر زبان

#### Footer

`src/components/footer/footer.tsx`

- اطلاعات تماس
- لینک‌های سریع

#### Currency Components

`src/components/currency/`

- نمایش لیست ارزها
- فیلتر و جستجو

#### Wallet Components

`src/components/wallet/`

- نمایش موجودی
- تاریخچه تراکنش‌ها

#### Theme Toggle

`src/components/theme-toggle.tsx`

- تغییر تم روز/شب

#### Locale Toggle

`src/components/locale-toggle.tsx`

- تغییر زبان پروژه

---

## تنظیمات بین‌المللی

### زبان‌های پشتیبانی‌شده

پروژه از سه زبان پشتیبانی می‌کند:

- 🇺🇸 **English** (en)
- 🇮🇷 **فارسی** (fa)
- 🇩🇪 **Deutsch** (de)

### ساختار فایل‌های ترجمه

```
messages/
├── en.json    # ترجمه انگلیسی
├── fa.json    # ترجمه فارسی
└── de.json    # ترجمه آلمانی
```

### نمونه فایل ترجمه

```json
{
  "common": {
    "home": "خانه",
    "about": "درباره",
    "contact": "تماس"
  },
  "wallet": {
    "balance": "موجودی",
    "transactions": "تراکنش‌ها"
  }
}
```

### استفاده در کامپوننت‌ها

```typescript
import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations();

  return <h1>{t("common.home")}</h1>;
}
```

### تغییر زبان

استفاده از `LocaleToggle` component برای تغییر زبان.

---

## مشخصات فنی

### Stack فنی

| قسمت                     | فناوری         | نسخه    |
| ------------------------ | -------------- | ------- |
| **Framework**            | Next.js        | 16.0.10 |
| **Runtime**              | Node.js        | 18+     |
| **Language**             | TypeScript     | 5.x     |
| **Database**             | PostgreSQL     | 12+     |
| **ORM**                  | Prisma         | 6.19.0  |
| **UI Library**           | React          | 19.2.3  |
| **Styling**              | Tailwind CSS   | 4.x     |
| **Components**           | shadcn/ui      | -       |
| **Icons**                | Lucide React   | 0.503.0 |
| **State**                | Zustand        | 5.0.3   |
| **Tables**               | TanStack Table | 8.21.3  |
| **Internationalization** | next-intl      | 4.0.3   |
| **Auth**                 | JWT            | -       |
| **Password**             | bcryptjs       | 3.0.2   |
| **Storage**              | AWS S3         | -       |
| **Toast**                | Sonner         | 2.0.3   |
| **Container**            | Docker         | -       |

### قوانین Linting

```bash
pnpm lint
```

قوانین ESLint در `eslint.config.mjs` تعریف‌شده‌اند.

### تنظیمات TypeScript

- `strict: true` - حالت strict
- `skipLibCheck: true` - پرش‌اندیشی برای بررسی library‌ها
- `esModuleInterop: true` - سازگاری با Module‌های مختلف

---

## متغیرهای محیطی

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db_name

# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRE=24h

# AWS S3 (برای بارگذاری فایل)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1

# Email (اختیاری)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## دستورات مفید

### Development

```bash
# شروع dev server
pnpm dev

# اجرای Linter
pnpm lint

# بازبینی Prisma Studio
pnpm prisma studio
```

### Database

```bash
# ایجاد migration
pnpm prisma migrate dev --name migration_name

# Push مستقیم به DB
pnpm prisma db push

# Reset پایگاه داده
pnpm prisma migrate reset

# Seed پایگاه داده
pnpm prisma db seed

# بازبینی Studio
pnpm prisma studio
```

### Production

```bash
# Build
pnpm build

# شروع Server
pnpm start

# Build با Docker
docker build -t xbarat:latest .
docker run -p 3000:3000 xbarat:latest
```

---

## ساختار Git و Commits

### Convention Commits

```
feat: ایجاد ویژگی جدید
fix: رفع버그
docs: بروزرسانی مستندات
style: تغییرات formatting
refactor: بازآرایی کد
test: افزودن تست‌ها
chore: تغییرات build/dependencies
```

---

## بهینه‌سازی و کارایی

### بهینه‌سازی‌های اعمال‌شده

1. **Turbopack:** استفاده از Turbopack برای سرعت بیشتر در dev mode
2. **Image Optimization:** بهینه‌سازی خودکار تصاویر
3. **Code Splitting:** تقسیم خودکار کد برای بهتر شدن performance
4. **Database Indexing:** افزودن index به فیلدهای مهم
5. **Caching:** استفاده از caching در API endpoints

---

## نوشتار کد

### استانداردهای توسعه

- **Naming Convention:** camelCase برای متغیرها، PascalCase برای کامپوننت‌ها
- **File Structure:** یک کامپوننت = یک فایل
- **Type Safety:** استفاده گسترده از TypeScript
- **Error Handling:** مدیریت مناسب خطاها
- **Comments:** توضیحات برای logic پیچیده

---

## Troubleshooting

### مشکلات معمول

**مشکل:** Database connection failed

```
حل: بررسی DATABASE_URL و اجرای مجدد Migration
```

**مشکل:** JWT Token invalid

```
حل: بررسی JWT_SECRET و refresh Token
```

**مشکل:** Port 3000 already in use

```
حل: تغییر PORT در .env یا بستن process دیگری
```

---

## تیم توسعه

- **نسخه:** 0.1.0
- **آخرین به‌روزرسانی:** December 2024

---

## لایسنس

Proprietary - تمام حقوق محفوظ است.

---

## تماس و پشتیبانی

برای سوالات و مشکلات می‌توانید با تیم توسعه تماس بگیرید.

---

**آخرین به‌روزرسانی:** December 14, 2024
