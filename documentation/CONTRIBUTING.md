# Contributing Guide - Xbarat v3

## 🤝 مشارکت در پروژه

سپاس بر علاقه‌ای که دارید برای مشارکت در Xbarat v3! این راهنما شامل تمام موارد لازم برای شروع توسعه است.

---

## 📋 قوانین اصلی

### 1. کد و Commit Ethics

- نویسه منظم و تمیز بنویسید
- TypeScript types را همیشه استفاده کنید
- حواشی کوتاه و مفید بگذارید

### 2. Respect کردن Team

- قبل از شروع، مسائل را بررسی کنید
- بزرگ تغییرات را مورد بحث قرار دهید
- Pull Request توضیحات جامع داشته باشد

### 3. Security First

- حساس داده‌ها را کبدًا در repository کنم‌ کنید
- تمام input‌ها را validate کنید
- SQL injection و XSS را در نظر بگیرید

---

## 🚀 شروع برای توسعه‌دهنده جدید

### مرحله 1: Fork و Clone

```bash
# Fork repository (از GitHub)
# سپس clone کنید:

git clone https://github.com/your-username/xbarat-v3.git
cd xbarat-v3
```

### مرحله 2: Setup محلی

```bash
# نصب dependencies
pnpm install

# تنظیم .env.local
cp .env.example .env.local

# راه‌اندازی پایگاه داده
pnpm prisma migrate dev

# شروع dev server
pnpm dev
```

### مرحله 3: ایجاد Feature Branch

```bash
# بروز رسانی main
git checkout main
git pull origin main

# ایجاد branch جدید
git checkout -b feature/your-feature-name

# یا برای bug fixes
git checkout -b fix/bug-name
```

---

## 📝 Git Workflow

### Commit Message Format

**Pattern:** `<type>(<scope>): <subject>`

```
feat(wallet): add transfer functionality
fix(auth): resolve jwt verification bug
docs(api): update endpoint documentation
style(components): format button component
refactor(services): optimize wallet service
test(deposit): add validation tests
chore(deps): update prisma to 6.19.0
```

### Types

```
feat:      نیزگی جدید
fix:       رفع버그
docs:      مستندات
style:     فرمت‌گذاری کد
refactor:  بازآرایی کد
test:      تست‌ها
chore:     تغییرات build/deps
perf:      بهینه‌سازی کارایی
```

### مثال‌های خوب:

```bash
git commit -m "feat(deposit): add payment method selection"
git commit -m "fix(wallet): prevent negative balance"
git commit -m "docs(api): document currency endpoints"
```

### مثال‌های بد:

```bash
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

---

## 🔄 Pull Request Process

### 1. قبل از ارسال PR

```bash
# بروزرسانی branch با main
git fetch origin
git rebase origin/main

# یا merge (اگر conflicts زیادی باشد)
git merge origin/main

# اجرای linter
pnpm lint

# اجرای type checking
pnpm type-check

# ساخت آزمایش
pnpm build
```

### 2. Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 3. ایجاد Pull Request

**عنوان:** واضح و کوتاه

```
feat(wallet): Add transfer between wallets
```

**Description Template:**

```markdown
## 📝 توضیحات

توضیح کوتاهی از تغییرات انجام‌شده.

## 🔗 مرتبط با

Closes #123 (شماره issue اگر وجود داشته باشد)

## ✅ Checklist

- [ ] کد تمیز و منظم است
- [ ] TypeScript types اضافه شده‌اند
- [ ] Migration DB ایجاد شده (اگر نیاز بود)
- [ ] Documentation بروزرسانی شده
- [ ] تست‌ها اضافه شده‌اند
- [ ] لینتر pass می‌کند

## 📷 Screenshots (اگر UI باشد)

بفرستید اگر تغییرات UI شامل است.
```

---

## 📂 ساختار فایل‌ها

### کامپوننت جدید

```typescript
// ✅ صحیح
src/components/wallet/
├── wallet-card.tsx
├── wallet-list.tsx
├── wallet-transfer.tsx
└── index.ts

// ❌ غلط
src/components/
└── WalletCard.tsx (باید folder داشته باشد)
```

### Service جدید

```typescript
// ✅ صحیح
src/lib/services/
├── transfer.service.ts
├── deposit.service.ts
└── index.ts

// API Route جدید
src/api/transfer/
├── route.ts
└── ... (اگر subfolder لازم باشد)
```

---

## 🧪 نوشتار تست‌ها

### Unit Test مثال

```typescript
// src/lib/services/__tests__/transfer.service.test.ts
import { transferFunds } from "../transfer.service";

describe("TransferService", () => {
  describe("transferFunds", () => {
    it("should transfer funds successfully", async () => {
      const result = await transferFunds(
        "user-id-1",
        "user-id-2",
        100,
        "currency-id"
      );

      expect(result.status).toBe("COMPLETED");
      expect(result.amount).toBe(100);
    });

    it("should throw error if insufficient balance", async () => {
      await expect(
        transferFunds(
          "user-id-1",
          "user-id-2",
          10000, // خیلی زیاد
          "currency-id"
        )
      ).rejects.toThrow("Insufficient balance");
    });
  });
});
```

### Integration Test

```typescript
// src/api/__tests__/wallet.integration.test.ts
import { POST } from "@/api/wallet/transfer/route";

describe("Wallet API", () => {
  it("POST /api/wallet/transfer should transfer funds", async () => {
    const request = new Request("http://localhost:3000/api/wallet/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fromWalletId: "wallet-1",
        toWalletId: "wallet-2",
        amount: 100,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });
});
```

---

## 🎨 استانداردهای کد

### TypeScript

```typescript
// ✅ صحیح
interface UserProfile {
  id: string;
  email: string;
  balance: Decimal;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // implementation
};

// ❌ غلط
const getUserProfile = async (userId) => {
  // missing return type
};

const user: any = {}; // never use 'any'
```

### Naming Convention

```typescript
// ✅ صحیح
- const userId = 'uuid';
- function calculateTotalBalance() {}
- interface UserWallet {}
- const MAX_TRANSFER_AMOUNT = 10000;

// ❌ غلط
- const user_id = 'uuid'; (باید camelCase)
- function CalcTotalBalance() {} (function lowercase)
- interface userWallet {} (interface PascalCase)
- const max_transfer = 10000; (const UPPER_CASE)
```

### Error Handling

```typescript
// ✅ صحیح
try {
  const wallet = await getWallet(walletId);
  if (!wallet) {
    throw new Error("Wallet not found");
  }
} catch (error) {
  logger.error("Failed to get wallet", { error, walletId });
  throw error; // رفع‌دهنده بالاتر را handle کند
}

// ❌ غلط
try {
  const wallet = await getWallet(walletId);
} catch (error) {
  console.log("Error"); // محدود اطلاعات
  // error را ignore می‌کند
}
```

### Comments

```typescript
// ✅ صحیح
// کسر کمیسیون از موجودی
wallet.balance -= fee;

// ❌ غلط
// بروزرسانی موجودی
wallet.balance -= fee;
```

---

## 🚨 معمول مشکلات

### ESLint Errors

```bash
# بررسی
pnpm lint

# اصلاح خودکار
pnpm lint -- --fix
```

### TypeScript Errors

```bash
# بررسی
pnpm type-check

# نیاز به fixing manual
```

### Database Issues

```bash
# اگر schema conflict باشد
pnpm prisma migrate resolve --rolled-back "migration-name"
pnpm prisma migrate dev

# اگر local db corrupt باشد
pnpm prisma migrate reset --force
```

---

## 📚 Documentation

### هنگام نوشتار Code

```typescript
/**
 * انتقال پول بین دو کیف‌پول
 *
 * @param fromWalletId - کیف‌پول مبدا
 * @param toWalletId - کیف‌پول مقصد
 * @param amount - مقدار انتقال
 * @returns Transfer object
 * @throws Error اگر insufficient balance
 *
 * @example
 * const transfer = await transferBetweenWallets(
 *   'wallet-1',
 *   'wallet-2',
 *   100
 * );
 */
export async function transferBetweenWallets(
  fromWalletId: string,
  toWalletId: string,
  amount: Decimal
): Promise<Transfer> {
  // implementation
}
```

### README برای فیچر جدید

اگر feature پیچیده است، README اضافه کنید:

```markdown
# Transfer Feature

## نحوه کار

1. کاربر کیف‌پول منبع و مقصد رو انتخاب می‌کند
2. مقدار انتقال رو وارد می‌کند
3. تایید می‌کند
4. سیستم transfer رو process می‌کند

## Implementation

- `/api/wallet/transfer` - endpoint
- `transferBetweenWallets()` - service
- `useTransfer()` - custom hook
```

---

## 🔒 Security Checklist

قبل از ارسال PR:

- [ ] تمام inputs validated هستند
- [ ] NO hardcoded secrets
- [ ] NO sensitive data logged
- [ ] Authentication/authorization صحیح
- [ ] SQL Injection prevention (Prisma handles)
- [ ] XSS prevention (React handles)
- [ ] CSRF protection اگر لازم است
- [ ] Rate limiting اگر لازم است

---

## 📊 Performance Checklist

- [ ] Database queries optimized (با includes)
- [ ] NO N+1 queries
- [ ] Images optimized
- [ ] Large lists paginated
- [ ] Unnecessary re-renders removed
- [ ] Bundle size reasonable

---

## 🐛 Bug Report

اگر bug پیدا کردید:

```markdown
# Bug Report

## توضیحات

Brief description

## Steps to Reproduce

1. Step 1
2. Step 2

## Expected Behavior

Expected result

## Actual Behavior

Actual result

## Environment

- Browser/Node version
- OS
- Etc.

## Screenshots

if applicable
```

---

## 💡 Feature Request

برای درخواست feature جدید:

```markdown
# Feature Request

## توضیحات

چه feature می‌خواهید؟

## چرا لازم است؟

Problem it solves

## مثال

Use case

## پیشنهاد Implementation

if you have ideas
```

---

## 🤔 سوالات معمول

**س: چقدر طول می‌کشد PR merge شود؟**
ج: معمولاً 1-3 روز

**س: اگر conflict داشته باشم؟**
ج: `git rebase origin/main` یا `git merge origin/main`

**س: چند commit باید داشته باشم؟**
ج: چند commit منطقی بهتر از یک بزرگ

**س: اگر بدون tests کد بفرستم؟**
ج: قبول نخواهد شد اگر feature پیچیده باشد

---

## 📞 کمک و تماس

- **Issues:** GitHub Issues برای bugs/features
- **Discussions:** برای سوالات
- **Slack/Discord:** (اگر team channel داشته باشید)

---

## 🎉 تشکر

از تمام contributors سپاسگزاریم!

<img src="https://contrib.rocks/image?repo=your-org/xbarat-v3" />

---

**Happy Contributing! 🚀**
