# Database Schema Documentation - Xbarat v3

## 📋 فهرست مطالب

1. [نمای کلی](#نمای-کلی)
2. [Models](#models)
3. [Relationships](#relationships)
4. [Enums](#enums)
5. [Indexes](#indexes)
6. [Migrations](#migrations)
7. [Queries مهم](#queries-مهم)

---

## نمای کلی

**Database Type:** PostgreSQL  
**ORM:** Prisma  
**Location:** `prisma/schema.prisma`

```
┌─────────────────────────────────────────────────────┐
│              User & Authentication                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ User (کاربر سیستم)                          │   │
│  │ ActivityLog (لاگ فعالیت‌ها)                │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         Financial & Currencies                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Currency (ارز‌ها)                           │   │
│  │ CurrencyPair (نرخ‌های تبادل)                │   │
│  │ PaymentChannel (کانال‌های پرداخت)            │   │
│  │ FeeSetting (تنظیمات کمیسیون)                │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         Wallet & Transactions                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Wallet (کیف‌پول)                            │   │
│  │ Deposit (واریزی)                            │   │
│  │ Withdrawal (برداشتی)                        │   │
│  │ Transfer (انتقال)                           │   │
│  │ Refund (بازپرداخت)                          │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         Bridge & Liquidity                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ BridgeTransfer (انتقال پل)                  │   │
│  │ LiquidityPool (استخر نقدینگی)               │   │
│  │ FeeUser (کمیسیون کاربران)                   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Models

### 👤 User

کاربر سیستم با اطلاعات شخصی و KYC

```prisma
model User {
  id                 String          @id @default(uuid())
  email              String          @unique
  phoneNumber        String          @unique
  fullName           String
  avatarUrl          String?
  passwordHash       String
  countryCode        String
  nationality        String?
  language           String?
  kycStatus          KycStatus       @default(PENDING)
  documentType       DocumentType?
  documentNumber     String?         @unique
  documentPhotoUrl   String?
  dateOfBirth        DateTime?
  address            String?
  postalCode         String?
  city               String?
  state              String?
  isPhoneVerified    Boolean         @default(false)
  isEmailVerified    Boolean         @default(false)
  role               UserRole        @default(CUSTOMER)
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
  deletedAt          DateTime?
  isDeleted          Boolean         @default(false)

  // Relations
  ActivityLog        ActivityLog[]
  deposits           Deposit[]
  initiatedExchanges Exchange[]      @relation("Initiator")
  LiquidityPool      LiquidityPool[]
  refunds            Refund[]
  wallet             Wallet[]
  withdrawals        Withdrawal[]
  transfers          Transfer[]      @relation("TransferToUser")
  feeUserWallets     FeeUser[]

  // Indexes
  @@index([email])
  @@index([phoneNumber])
  @@index([documentNumber])
}
```

**فیلدهای مهم:**

- `id`: UUID منحصر‌به‌فرد
- `email`: ایمیل منحصر‌به‌فرد
- `phoneNumber`: شماره تلفن منحصر‌به‌فرد
- `fullName`: نام کامل کاربر
- `passwordHash`: رمز عبور hash‌شده (bcrypt)
- `countryCode`: کد کشور (مثلاً IR، US، DE)
- `nationality`: ملیت (اختیاری)
- `language`: زبان پسندیده (en, fa, de)
- `dateOfBirth`: تاریخ تولد (برای KYC)
- `address`: آدرس (برای KYC)
- `city`: شهر
- `state`: استان/ایالت
- `postalCode`: کد پستی
- `avatarUrl`: آدرس تصویر پروفایل
- `kycStatus`: وضعیت KYC (PENDING, APPROVED, REJECTED)
- `documentType`: نوع سند هویتی
- `documentNumber`: شماره سند
- `documentPhotoUrl`: عکس سند
- `isPhoneVerified`: آیا شماره تایید شده
- `isEmailVerified`: آیا ایمیل تایید شده
- `role`: نقش کاربر (CUSTOMER, ADMIN)
- `isDeleted`: برای Soft Delete

- `kycStatus`: وضعیت KYC
- `isDeleted`: برای Soft Delete

---

### 💵 Currency

تعریف ارزهای پشتیبانی‌شده

```prisma
model Currency {
  id               String           @id @default(uuid())
  code             String           @unique    // مثل: USD, EUR, IRR
  name             String           // مثل: US Dollar
  symbol           String           // مثل: $
  decimals         Int              @default(2)
  createdAt        DateTime         @default(now())

  // Relations
  FromCurrencyPair CurrencyPair[]   @relation("FromCurrency")
  ToCurrencyPair   CurrencyPair[]   @relation("ToCurrency")
  FeeSetting       FeeSetting[]
  LiquidityPool    LiquidityPool[]
  wallets          Wallet[]
  paymentChannels  PaymentChannel[] @relation("PaymentChannelCurrencies")
}
```

**مثال‌های داده:**

```
code: "USD", name: "US Dollar", symbol: "$", decimals: 2
code: "EUR", name: "Euro", symbol: "€", decimals: 2
code: "IRR", name: "Iranian Rial", symbol: "﷼", decimals: 0
code: "BTC", name: "Bitcoin", symbol: "₿", decimals: 8
```

---

### 📊 CurrencyPair

نرخ تبادل و کمیسیون بین دو ارز

```prisma
model CurrencyPair {
  id             String     @id @default(uuid())
  fromCurrencyId String
  toCurrencyId   String
  rate           Decimal    // نرخ تبادل
  isInverseRate  Boolean    @default(false)
  feePercentage  Decimal    @default(0.00)
  isActive       Boolean    @default(true)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  // Relations
  fromCurrency   Currency   @relation("FromCurrency", fields: [fromCurrencyId], references: [id])
  toCurrency     Currency   @relation("ToCurrency", fields: [toCurrencyId], references: [id])
  Exchange       Exchange[]

  // Constraints
  @@unique([fromCurrencyId, toCurrencyId])
}
```

**مثال:**

```
USD → EUR: rate = 0.92, feePercentage = 0.02 (2%)
EUR → USD: rate = 1.09, feePercentage = 0.02
```

---

### 🏦 PaymentChannel

کانال‌های پرداخت (درگاه‌ها)

```prisma
model PaymentChannel {
  id            String          @id @default(uuid())
  name          String          @unique  // Stripe, Bank, etc.
  description   String?
  createdAt     DateTime        @default(now())

  // Relations
  Deposit       Deposit[]
  LiquidityPool LiquidityPool[]
  Withdrawal    Withdrawal[]
  currencies    Currency[]      @relation("PaymentChannelCurrencies")
}
```

**مثال‌های کانال:**

- Stripe
- Bank Transfer
- Paypal
- Crypto Wallet

---

### 💳 Wallet

کیف‌پول کاربر برای هر ارز

```prisma
model Wallet {
  id            String       @id @default(uuid())
  userId        String
  currencyId    String
  balance       Decimal      @default(0.00)   // موجودی آزاد
  frozen        Decimal      @default(0.00)   // موجودی بلوکه
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relations
  deposits      Deposit[]
  Refund        Refund[]
  transfersFrom Transfer[]   @relation("FromWallet")
  transfersTo   Transfer[]   @relation("ToWallet")
  currency      Currency     @relation(fields: [currencyId], references: [id], onDelete: Cascade)
  user          User         @relation(fields: [userId], references: [id])
  withdrawals   Withdrawal[]

  // Constraints
  @@unique([userId, currencyId])
  @@index([currencyId])
}
```

**نوع موجودی:**

- `balance`: پول قابل استفاده
- `frozen`: پول درخواستی برداشتی

---

### 📥 Deposit

سابقه واریزی‌های کاربر

```prisma
model Deposit {
  id               String          @id @default(uuid())
  userId           String
  walletId         String
  amount           Decimal
  fee              Decimal         @default(0.00)
  status           DepositStatus   @default(PENDING)
  reference        String?         @unique
  createdAt        DateTime        @default(now())
  completedAt      DateTime?
  failedAt         DateTime?
  paymentChannelId String
  documentUrl      String?         // تصویر سند

  // Relations
  BridgeTransfer   BridgeTransfer?
  paymentChannel   PaymentChannel  @relation(fields: [paymentChannelId], references: [id])
  user             User            @relation(fields: [userId], references: [id])
  wallet           Wallet          @relation(fields: [walletId], references: [id])
}
```

**وضعیت‌های ممکن:**

```
PENDING → AWAITING_APPROVAL → APPROVED → COMPLETED
                                    ↓
                                 FAILED
```

---

### 📤 Withdrawal

سابقه برداشتی‌های کاربر

```prisma
model Withdrawal {
  id               String           @id @default(uuid())
  userId           String
  walletId         String
  amount           Decimal
  fee              Decimal          @default(0.00)
  status           WithdrawalStatus @default(PENDING)
  reference        String?          @unique
  createdAt        DateTime         @default(now())
  completedAt      DateTime?
  failedAt         DateTime?
  paymentChannelId String
  bridgeTransferId String?
  receiverAddress  String           // شماره حساب/آدرس
  addressOwnerName String           // نام دارنده حساب
  documentUrl      String?

  // Relations
  BridgeTransfer   BridgeTransfer?
  paymentChannel   PaymentChannel   @relation(fields: [paymentChannelId], references: [id])
  user             User             @relation(fields: [userId], references: [id])
  wallet           Wallet           @relation(fields: [walletId], references: [id])
}
```

**وضعیت‌های ممکن:**

```
PENDING → APPROVAL → AWAITING_APPROVAL → APPROVED → COMPLETED
                                              ↓
                                            FAILED
```

---

### 🌉 BridgeTransfer

انتقال پل برای هماهنگی واریزی و برداشتی

```prisma
model BridgeTransfer {
  id              String         @id @default(uuid())
  status          BridgeStatus   @default(AWAITING_PAYMENT)
  createdAt       DateTime       @default(now())
  completedAt     DateTime?
  failedAt        DateTime?
  depositId       String?        @unique
  withdrawalId    String?        @unique
  liquidityPoolId String?
  amount          Decimal        @default(0.00)
  documentUrl     String?

  // Relations
  deposit         Deposit?       @relation(fields: [depositId], references: [id])
  liquidityPool   LiquidityPool? @relation(fields: [liquidityPoolId], references: [id])
  withdrawal      Withdrawal?    @relation(fields: [withdrawalId], references: [id])
}
```

**نقش BridgeTransfer:**
وقتی کاربر پول واریز می‌کند و دقیقاً همان مقدار برای کسی دیگر برداشتی درخواست می‌شود، می‌توانیم انتقال پل بسازیم تا کمیسیون کمتری داشته باشیم.

---

### 💸 Transfer

انتقال پول درون‌سکویی

```prisma
model Transfer {
  id           String         @id @default(uuid())
  fromWalletId String
  toWalletId   String
  amount       Decimal
  fee          Decimal        @default(0.00)
  status       TransferStatus @default(PENDING)
  note         String?
  createdAt    DateTime       @default(now())
  completedAt  DateTime?
  failedAt     DateTime?

  // Relations
  fromWallet   Wallet         @relation("FromWallet", fields: [fromWalletId], references: [id])
  toWallet     Wallet         @relation("ToWallet", fields: [toWalletId], references: [id])
  User         User[]         @relation("TransferToUser")
}
```

**مثال:** کاربر الف 100 دلار از کیف‌پول USD خود را به کیف‌پول EUR خود منتقل می‌کند.

---

### 🏊 LiquidityPool

استخر نقدینگی برای هر ارز در هر کانال پرداخت

```prisma
model LiquidityPool {
  id               String           @id @default(uuid())
  paymentChannelId String
  currencyId       String
  address          String           // شناسه خارجی
  balance          Decimal          @default(0.00)
  frozen           Decimal          @default(0.00)
  updatedAt        DateTime         @updatedAt
  userId           String

  // Relations
  BridgeTransfer   BridgeTransfer[]
  currency         Currency         @relation(fields: [currencyId], references: [id])
  paymentChannel   PaymentChannel   @relation(fields: [paymentChannelId], references: [id])
  user             User             @relation(fields: [userId], references: [id])
}
```

**مثال:**

- استخر Stripe برای USD
- استخر Bank Transfer برای IRR
- استخر Paypal برای EUR

---

### 🔄 Refund

بازپرداخت برای تراکنش‌های ناموفق

```prisma
model Refund {
  id        String    @id @default(uuid())
  userId    String
  walletId  String
  amount    Decimal
  reason    String
  createdAt DateTime  @default(now())

  // Relations
  user      User      @relation(fields: [userId], references: [id])
  wallet    Wallet    @relation(fields: [walletId], references: [id])
}
```

---

### 💰 FeeSetting

تنظیمات کمیسیون‌های سیستم

```prisma
model FeeSetting {
  id           String  @id @default(uuid())
  currencyId   String
  depositFee   Decimal @default(0.00)
  withdrawalFee Decimal @default(0.00)
  transferFee  Decimal @default(0.00)

  // Relations
  currency     Currency @relation(fields: [currencyId], references: [id])
}
```

---

### 💳 FeeUser

کمیسیون‌های کاربر (برای سطح‌های مختلف)

```prisma
model FeeUser {
  id             String  @id @default(uuid())
  userId         String
  depositFee     Decimal @default(0.00)
  withdrawalFee  Decimal @default(0.00)
  transferFee    Decimal @default(0.00)
  exchangeFee    Decimal @default(0.00)

  // Relations
  user           User    @relation(fields: [userId], references: [id])
}
```

---

### 📋 ActivityLog

ثبت تمام فعالیت‌های مهم

```prisma
model ActivityLog {
  id        String   @id @default(uuid())
  userId    String
  action    String   // LOGIN, DEPOSIT, WITHDRAWAL, etc.
  metadata  Json?    // اطلاعات اضافی
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id])
}
```

---

### 🔄 Exchange

تبادل ارز

```prisma
model Exchange {
  id             String          @id @default(uuid())
  currencyPairId String
  userId         String
  amount         Decimal
  matchedAmount  Decimal         @default(0.00)
  remainingAmount Decimal        @default(0.00)
  status         ExchangeStatus  @default(PENDING)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  // Relations
  currencyPair   CurrencyPair    @relation(fields: [currencyPairId], references: [id])
  user           User            @relation("Initiator", fields: [userId], references: [id])
  ExchangeMatch  ExchangeMatch[]
}
```

---

### 🔗 ExchangeMatch

تطابق تبادل‌ها

```prisma
model ExchangeMatch {
  id              String   @id @default(uuid())
  exchangeId      String
  matchedAmount   Decimal
  createdAt       DateTime @default(now())

  // Relations
  exchange        Exchange @relation(fields: [exchangeId], references: [id])
}
```

---

## Relationships

### نمودار Relationships

```
User
├── ActivityLog (1:N)
├── Wallet (1:N) → Currency (N:1)
├── Deposit (1:N) → Wallet (N:1)
│                → PaymentChannel (N:1)
│                → BridgeTransfer (1:1 optional)
├── Withdrawal (1:N) → Wallet (N:1)
│                    → PaymentChannel (N:1)
│                    → BridgeTransfer (1:1 optional)
├── Transfer (1:N) [as source]
│                → Wallet "FromWallet" (N:1)
│                → Wallet "ToWallet" (N:1)
├── LiquidityPool (1:N) → Currency (N:1)
│                      → PaymentChannel (N:1)
├── Refund (1:N) → Wallet (N:1)
└── Exchange (1:N) → CurrencyPair (N:1)

Currency
├── CurrencyPair (1:N) [as fromCurrency]
├── CurrencyPair (1:N) [as toCurrency]
├── Wallet (1:N)
├── PaymentChannel (N:M)
└── FeeSetting (1:N)

PaymentChannel
├── Deposit (1:N)
├── Withdrawal (1:N)
├── LiquidityPool (1:N)
└── Currency (N:M)

BridgeTransfer
├── Deposit (1:1 optional)
├── Withdrawal (1:1 optional)
└── LiquidityPool (N:1 optional)
```

---

## Enums

### KycStatus

```typescript
enum KycStatus {
  PENDING = "PENDING"           // منتظر بررسی
  APPROVED = "APPROVED"         // تایید‌شده
  REJECTED = "REJECTED"         // رد‌شده
}
```

### UserRole

```typescript
enum UserRole {
  CUSTOMER = "CUSTOMER"         // کاربر عادی
  ADMIN = "ADMIN"               // مدیر
  SUPPORT = "SUPPORT"           // پشتیبان
}
```

### DocumentType

```typescript
enum DocumentType {
  PASSPORT = "PASSPORT"         // گذرنامه
  NATIONAL_ID = "NATIONAL_ID"   // شناسه ملی
  DRIVING_LICENSE = "DRIVING_LICENSE"  // گواهینامه رانندگی
}
```

### DepositStatus

```typescript
enum DepositStatus {
  PENDING = "PENDING"
  AWAITING_APPROVAL = "AWAITING_APPROVAL"
  APPROVED = "APPROVED"
  COMPLETED = "COMPLETED"
  FAILED = "FAILED"
  REJECTED = "REJECTED"
}
```

### WithdrawalStatus

```typescript
enum WithdrawalStatus {
  PENDING = "PENDING"
  APPROVAL = "APPROVAL"
  AWAITING_APPROVAL = "AWAITING_APPROVAL"
  APPROVED = "APPROVED"
  COMPLETED = "COMPLETED"
  FAILED = "FAILED"
  REJECTED = "REJECTED"
}
```

### BridgeStatus

```typescript
enum BridgeStatus {
  AWAITING_PAYMENT = "AWAITING_PAYMENT"
  CHECK_STATUS = "CHECK_STATUS"
  COMPLETED = "COMPLETED"
  FAILED = "FAILED"
}
```

### TransferStatus

```typescript
enum TransferStatus {
  PENDING = "PENDING"
  COMPLETED = "COMPLETED"
  FAILED = "FAILED"
}
```

### ExchangeStatus

```typescript
enum ExchangeStatus {
  PENDING = "PENDING"
  PARTIAL_MATCH = "PARTIAL_MATCH"
  MATCHED = "MATCHED"
  COMPLETED = "COMPLETED"
  CANCELLED = "CANCELLED"
}
```

---

## Indexes

```prisma
// User
@@index([email])
@@index([phoneNumber])
@@index([documentNumber])

// Wallet
@@unique([userId, currencyId])
@@index([currencyId])

// CurrencyPair
@@unique([fromCurrencyId, toCurrencyId])

// Deposit
@@index([userId])
@@index([status])

// Withdrawal
@@index([userId])
@@index([status])

// Transfer
@@index([fromWalletId])
@@index([toWalletId])
```

---

## Migrations

### مهم‌ترین Migrations

| تاریخ          | نام                     | توضیح              |
| -------------- | ----------------------- | ------------------ |
| 20250710064205 | reset                   | تنظیم اولیه        |
| 20250710065822 | add_is_deleted_to_user  | Soft delete        |
| 20250720090539 | add_currency_pair_model | نرخ‌های تبادل      |
| 20250726       | add_exchange_model      | تبادل ارز          |
| 20251026       | update_statuses         | بروزرسانی وضعیت‌ها |

---

## Queries مهم

### دریافت کل موجودی کاربر

```typescript
const userBalance = await prisma.wallet.findMany({
  where: { userId: userId },
  include: { currency: true },
});

// جمع کل
const totalUSD = userBalance
  .filter((w) => w.currency.code === "USD")
  .reduce((sum, w) => sum + w.balance, 0);
```

### دریافت تاریخچه تراکنش‌ها

```typescript
const transactions = await prisma.$queryRaw`
  (SELECT id, amount, 'deposit' as type, createdAt 
   FROM "Deposit" WHERE userId = ${userId})
  UNION ALL
  (SELECT id, amount, 'withdrawal' as type, createdAt 
   FROM "Withdrawal" WHERE userId = ${userId})
  ORDER BY createdAt DESC
  LIMIT 20
`;
```

### بررسی موجودی قبل از برداشتی

```typescript
const wallet = await prisma.wallet.findUnique({
  where: { id: walletId },
});

if (wallet.balance < withdrawalAmount) {
  throw new Error("Insufficient balance");
}
```

### Atomic Transfer

```typescript
const result = await prisma.$transaction(async (tx) => {
  // کسر از منبع
  await tx.wallet.update({
    where: { id: fromWalletId },
    data: { balance: { decrement: amount } },
  });

  // افزودن به مقصد
  await tx.wallet.update({
    where: { id: toWalletId },
    data: { balance: { increment: amount } },
  });

  // ثبت تراکنش
  return await tx.transfer.create({
    data: { fromWalletId, toWalletId, amount, status: "COMPLETED" },
  });
});
```

---

## نکات مهم

✅ **تمام تراکنش‌های پول باید atomic باشند**

✅ **خیلی جا indices اضافه شده (query optimization)**

✅ **Soft delete از طریق isDeleted flag استفاده می‌شود**

✅ **تمام timestamps با timezone ذخیره می‌شوند**

✅ **Decimal برای دقت مالی استفاده می‌شود**

---

**آخرین به‌روزرسانی:** December 2024
