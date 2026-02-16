# Development Guide

## پیش‌نیاز
- Node.js 20+
- pnpm 9+
- PostgreSQL در دسترس

## راه‌اندازی محلی
```bash
pnpm install
cp .env.sample .env
pnpm prisma migrate deploy
pnpm dev
```

## متغیرهای محیطی
مطابق `.env.sample`:
- `NEXT_PUBLIC_APP_MODE`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_DEV_DOMAIN`
- `NEXT_PUBLIC_API_PROD_DOMAIN`
- `NEXT_PUBLIC_JWT_SECRET`
- `DATABASE_URL`
- `R2_ENDPOINT`
- `R2_BUCKET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_PUBLIC_URL`

## دستورات روزمره
```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
pnpm prisma migrate dev --name <name>
pnpm prisma migrate deploy
```

## نکات دیتابیس
- منبع حقیقت مدل‌ها: `prisma/schema.prisma`
- migrationها در `prisma/migrations`
- منطق مالی در بک‌اند پیاده‌سازی شده و به تریگر DB وابسته نیست.

## منطق مالی فعلی (Backend)
- ساخت wallet برای user جدید: `src/lib/back/repositories/user.repo.ts`
- ساخت wallet برای currency جدید: `src/lib/back/repositories/currency.repo.ts`
- Deposit status handling: `src/lib/back/repositories/wallet/deposit.repo.ts`
- Withdrawal reserve/finalize/refund: `src/lib/back/repositories/wallet/withdrawal.repo.ts`
- Exchange reserve/match/finalize/refund: `src/lib/back/repositories/wallet/exchange.repo.ts`

## قبل از commit
```bash
pnpm lint
```
و در صورت تغییر schema یا منطق مالی، migration مرتبط را اضافه کن.
