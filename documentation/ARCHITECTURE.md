# معمارسازی Xbarat v3

## 📐 نمای کلی معمارسازی

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer (UI)                  │
│         React Components + Next.js Pages + Layouts          │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  Pages     │  │ Components │  │   Layout   │             │
│  └────────────┘  └────────────┘  └────────────┘             │
└────────────────────────┬──────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                 │
┌────────▼──────────────┐    ┌────────────▼──────────────┐
│  API Client Layer     │    │   State Management        │
│  (fetch/axios)        │    │   (Zustand)              │
└────────┬──────────────┘    └────────────┬──────────────┘
         │                                 │
         └───────────────┬─────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│                   API Routes Layer                             │
│           (Next.js API Routes + Route Handlers)               │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  /api/user   │  │ /api/currency│  │ /api/wallet │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────────┐  ┌───────────────────────────────┐     │
│  │ /api/deposit     │  │ /api/bridge-transfer          │     │
│  └──────────────────┘  └───────────────────────────────┘     │
└────────────────────────┬──────────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│               Business Logic Layer                             │
│      (Services, Repositories, Utilities)                      │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Auth      │  │   Payment    │  │   Exchange   │        │
│  │ Service     │  │   Service    │  │   Service    │        │
│  └─────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────┬──────────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│                   Data Access Layer                            │
│                    (Prisma ORM)                               │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Prisma Client                               │   │
│  │  (Generate dari schema.prisma)                       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬──────────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│                  Database Layer                                │
│                  PostgreSQL                                   │
│                                                               │
│  ┌─────────────┐  ┌──────────┐  ┌─────────────┐             │
│  │    User     │  │ Currency │  │   Wallet    │             │
│  │   Table     │  │  Table   │  │   Table     │             │
│  └─────────────┘  └──────────┘  └─────────────┘             │
│                                                               │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────┐         │
│  │   Deposit    │  │ Withdrawal │  │   Transfer   │         │
│  │   Table      │  │   Table    │  │   Table      │         │
│  └──────────────┘  └────────────┘  └──────────────┘         │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 جریان درخواست (Request Flow)

### 1. درخواست ورود کاربر

```
┌─────────────────────────────┐
│   کاربر وارد ایمیل و رمز می‌شود    │
└──────────────┬──────────────┘
               │
       ┌───────▼────────┐
       │ Form Validation│
       └───────┬────────┘
               │
       ┌───────▼──────────────┐
       │  POST /api/user/login│
       └───────┬──────────────┘
               │
       ┌───────▼──────────────────┐
       │  Check User Existence    │
       │  Verify Password Hash    │
       └───────┬──────────────────┘
               │
    ┌──────────▼──────────┐
    │   Generate JWT      │
    │   Set in Cookie     │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │ Return Success +    │
    │ User Data           │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │ Store Token in      │
    │ LocalStorage/Cookie │
    │ Redirect to Home    │
    └─────────────────────┘
```

### 2. جریان واریزی پول

```
┌──────────────────────┐
│  کاربر واریزی شروع  │
└──────┬───────────────┘
       │
┌──────▼────────────────┐
│ Select Currency       │
│ Select Payment Channel│
│ Enter Amount          │
└──────┬────────────────┘
       │
┌──────▼────────────────────┐
│ POST /api/deposit         │
│ Validate Amount           │
│ Check Payment Channel     │
└──────┬────────────────────┘
       │
┌──────▼───────────────────────┐
│ Create Deposit Record        │
│ Status: PENDING             │
│ Create Bridge Transfer      │
│ (Link Deposit + Withdrawal) │
└──────┬───────────────────────┘
       │
┌──────▼──────────────────┐
│ Generate Payment Link   │
│ For Payment Channel     │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│ Return to User          │
│ Payment Instructions    │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│ کاربر دستی تایید یا   │
│ اتومات از Gateway       │
│ تأیید درخواست          │
└──────┬──────────────────┘
       │
┌──────▼──────────────────────┐
│ Update Deposit Status       │
│ → APPROVED                  │
│ Credit Wallet Balance       │
│ Update Bridge Transfer      │
└──────┬──────────────────────┘
       │
┌──────▼──────────────────┐
│ Send Confirmation Email│
│ Payment Success        │
└──────────────────────────┘
```

---

## 🏗️ معمارسازی هر Layer

### 1. Presentation Layer

**مسئولیت‌ها:**

- نمایش دیتا به کاربر
- گرفتن ورودی از کاربر
- Validation در سمت Client
- مدیریت State محلی

**فایل‌ها:**

```
src/
├── app/              # صفحات
├── components/       # کامپوننت‌های UI
├── hooks/           # Custom Hooks
└── providers/       # Context Providers
```

**مثال:**

```typescript
// src/components/wallet/WalletCard.tsx
export function WalletCard({ wallet }: { wallet: Wallet }) {
  const t = useTranslations();

  return (
    <div className="card">
      <h3>{wallet.currency.name}</h3>
      <p>
        {t("balance")}: {wallet.balance}
      </p>
    </div>
  );
}
```

### 2. API Routes Layer

**مسئولیت‌ها:**

- دریافت درخواست‌های HTTP
- Validation ورودی
- احراز هویت و مجوز
- فراخوانی Business Logic
- بازگشت پاسخ

**فایل‌ها:**

```
src/api/
├── user/
│   ├── login/route.ts
│   ├── register/route.ts
│   └── profile/route.ts
├── wallet/
│   ├── route.ts
│   └── transfer/route.ts
└── ... (سایر endpoints)
```

**مثال:**

```typescript
// src/api/wallet/route.ts
export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);
    const wallets = await prisma.wallet.findMany({
      where: { userId: user.id },
      include: { currency: true },
    });

    return Response.json({ success: true, data: wallets });
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

### 3. Business Logic Layer

**مسئولیت‌ها:**

- پیاده‌سازی قوانین تجاری
- محاسبات پیچیده
- Validation داده‌ها
- مدیریت تراکنش‌ها

**فایل‌ها:**

```
src/lib/
├── services/
│   ├── auth.service.ts
│   ├── wallet.service.ts
│   ├── deposit.service.ts
│   └── payment.service.ts
├── validators/
│   ├── user.validator.ts
│   └── transaction.validator.ts
└── utils/
    ├── encryption.ts
    └── calculations.ts
```

**مثال:**

```typescript
// src/lib/services/wallet.service.ts
export async function transferFunds(
  fromUserId: string,
  toUserId: string,
  amount: Decimal,
  currencyId: string
) {
  // Validation
  if (amount <= 0) throw new Error("Invalid amount");

  // Check balance
  const fromWallet = await prisma.wallet.findUnique({
    where: { userId_currencyId: { userId: fromUserId, currencyId } },
  });

  if (!fromWallet || fromWallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // Transfer (atomic transaction)
  return await prisma.$transaction(async (tx) => {
    // Deduct from source
    await tx.wallet.update({
      where: { id: fromWallet.id },
      data: { balance: { decrement: amount } },
    });

    // Add to destination
    const toWallet = await tx.wallet.findUnique({
      where: { userId_currencyId: { userId: toUserId, currencyId } },
    });

    await tx.wallet.update({
      where: { id: toWallet.id },
      data: { balance: { increment: amount } },
    });

    // Log transfer
    return await tx.transfer.create({
      data: {
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
        amount,
        status: "COMPLETED",
      },
    });
  });
}
```

### 4. Data Access Layer (Prisma)

**مسئولیت‌ها:**

- تبدیل درخواست‌ها به SQL
- مدیریت Transaction‌ها
- Cache کردن Query‌ها
- Relation Loading

**فایل‌های اصلی:**

```
prisma/
├── schema.prisma    # تعریف Models
└── migrations/      # History تغییرات
```

**مثال:**

```typescript
// Complex Query با Relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    wallet: {
      include: { currency: true },
    },
    deposits: {
      include: { paymentChannel: true },
      orderBy: { createdAt: "desc" },
    },
    withdrawals: {
      include: { paymentChannel: true },
      orderBy: { createdAt: "desc" },
    },
  },
});
```

---

## 🔐 معمارسازی امنیتی

### Authentication Flow

```
┌─────────────────┐
│  Username/Email │
│  Password       │
└────────┬────────┘
         │
   ┌─────▼──────────┐
   │ Validate Input │
   └─────┬──────────┘
         │
   ┌─────▼──────────────────┐
   │ Find User by Email     │
   └─────┬──────────────────┘
         │
   ┌─────▼──────────────────┐
   │ Compare Password Hash  │
   │ (bcryptjs)            │
   └─────┬──────────────────┘
         │
   ┌─────▼──────────────────┐
   │ Generate JWT Token     │
   │ (payload: userId,role) │
   └─────┬──────────────────┘
         │
   ┌─────▼──────────────────┐
   │ Return Token to Client │
   │ Set in Cookie          │
   └─────────────────────────┘
```

### Authorization Pattern

```typescript
// Middleware برای بررسی Token
export async function verifyAuth(request: Request) {
  const token = extractToken(request);

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// استفاده در API Routes
export async function POST(request: Request) {
  const user = await verifyAuth(request);
  // user authenticated
}
```

---

## 💾 Data Flow Pattern

### State Management (Zustand)

```typescript
// src/lib/store.ts
import { create } from "zustand";

interface AppStore {
  user: User | null;
  wallets: Wallet[];
  setUser: (user: User) => void;
  setWallets: (wallets: Wallet[]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  wallets: [],
  setUser: (user) => set({ user }),
  setWallets: (wallets) => set({ wallets }),
}));
```

### Component Usage

```typescript
export function WalletList() {
  const wallets = useAppStore((state) => state.wallets);

  useEffect(() => {
    // Fetch wallets
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((data) => useAppStore.setState({ wallets: data.data }));
  }, []);

  return (
    <div>
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}
```

---

## 🔄 Database Transaction Pattern

برای عملیات پیچیده که نیاز به consistency دارند:

```typescript
// Atomic Transaction
const result = await prisma.$transaction(
  async (tx) => {
    // Step 1
    const deposit = await tx.deposit.update({
      where: { id: depositId },
      data: { status: "APPROVED" },
    });

    // Step 2
    const wallet = await tx.wallet.update({
      where: { id: walletId },
      data: { balance: { increment: amount } },
    });

    // Step 3
    const transfer = await tx.bridgeTransfer.update({
      where: { id: transferId },
      data: { status: "COMPLETED" },
    });

    return { deposit, wallet, transfer };
  },
  {
    timeout: 10000, // 10 seconds
  }
);
```

---

## 📊 Error Handling Architecture

```
┌─────────────────────────────┐
│   Error Occurs              │
└──────────┬──────────────────┘
           │
    ┌──────▼────────────────┐
    │ Error Type Check      │
    └──────┬────────────────┘
           │
    ┌──────┴──────────┬──────────────┬─────────────┐
    │                 │              │             │
┌───▼───┐    ┌────────▼────┐  ┌─────▼─────┐  ┌──▼────┐
│Validation│  │ Not Found   │  │  Forbidden│  │Server  │
│ Error    │  │ Error       │  │  Error    │  │ Error  │
└───┬───┘    └────────┬────┘  └─────┬─────┘  └──┬────┘
    │                 │              │           │
    │         ┌───────▼──────────────▼───────────▼─┐
    │         │  Format Error Response             │
    │         │  - Message                         │
    │         │  - Error Code                      │
    │         │  - HTTP Status                     │
    │         └───────────┬──────────────────────┘
    │                     │
    └─────────────────────┴──────────────────────┐
                          │                      │
                  ┌───────▼──────┐    ┌──────────▼──────┐
                  │ Return to    │    │ Log to Console │
                  │ Client       │    │ or Monitoring  │
                  └──────────────┘    └─────────────────┘
```

---

## 🚀 Performance Optimization

### Query Optimization

```typescript
// بد: N+1 Problem
const users = await prisma.user.findMany();
for (const user of users) {
  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
  });
}

// خوب: Single Query with Relations
const users = await prisma.user.findMany({
  include: { wallet: true },
});
```

### Caching Strategy

```typescript
// Simple In-Memory Cache
const cache = new Map();

export async function getCurrencies() {
  if (cache.has("currencies")) {
    return cache.get("currencies");
  }

  const currencies = await prisma.currency.findMany();
  cache.set("currencies", currencies);

  // Invalidate after 1 hour
  setTimeout(() => cache.delete("currencies"), 3600000);

  return currencies;
}
```

---

## 📱 Responsive Design Architecture

```
┌──────────────────────────────────┐
│    Mobile First Approach         │
└──────────┬───────────────────────┘
           │
    ┌──────▼──────────────────┐
    │ Tailwind CSS Breakpoints│
    │ - sm: 640px             │
    │ - md: 768px             │
    │ - lg: 1024px            │
    │ - xl: 1280px            │
    └──────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│ Responsive Components       │
│ - Sidebar collapse on mobile│
│ - Stack layouts             │
│ - Adaptive navigation       │
└─────────────────────────────┘
```

---

**نتیجه‌گیری:** این معمارسازی تضمین‌کننده است:

- ✅ قابل‌تعریض
- ✅ قابل‌تست‌پذیری
- ✅ مدیریت آسان
- ✅ کارایی بالا
- ✅ امنیت مناسب
