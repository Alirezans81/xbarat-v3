# Xbarat v3

پلتفرم تبادل دارایی با Next.js + Prisma + PostgreSQL.

## مستندات ضروری
- `documentation/DOCS_INDEX.md`
- `documentation/DEVELOPMENT.md`
- `documentation/DEPLOYMENT.md`
- `documentation/DATABASE_SCHEMA.md`

## پیش‌نیاز
- Node.js 20+
- pnpm 9+
- PostgreSQL

## راه‌اندازی سریع
```bash
pnpm install
cp .env.sample .env
pnpm prisma migrate deploy
pnpm dev
```

اپ روی `http://localhost:3000` اجرا می‌شود.

## اسکریپت‌ها
```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## نکات مهم پیاده‌سازی فعلی
- منطق مالی (wallet/deposit/withdrawal/exchange) در بک‌اند و داخل repository/service پیاده‌سازی شده است.
- ساخت wallet برای کاربر جدید و ارز جدید در بک‌اند انجام می‌شود.

## مسیرهای مهم
- API: `src/app/(back)/api/v1`
- منطق بک‌اند: `src/lib/back`
- مدل دیتابیس: `prisma/schema.prisma`
- migrationها: `prisma/migrations`
