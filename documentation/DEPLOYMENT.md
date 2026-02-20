# Deployment Guide

## مسیر پیشنهادی
این پروژه برای اجرای production با Docker + Prisma migration آماده است.

## پیش‌نیاز
- PostgreSQL production
- مقداردهی کامل `.env`
- دسترسی به bucket برای R2

## Build و Run با Docker
```bash
docker build -t xbarat-v3:latest .
docker run --rm -p 3000:3000 --env-file .env xbarat-v3:latest
```

## نکته Prisma
در Dockerfile فعلی، این دستورات در مرحله build اجرا می‌شوند:
- `npx prisma generate`
- `npx prisma migrate deploy`

پس migrationها حتما باید قبل از release در ریپو موجود باشند.

## Deploy بدون Docker
```bash
pnpm install --frozen-lockfile
pnpm prisma migrate deploy
pnpm build
pnpm start
```

## چک‌های بعد از دیپلوی
1. endpoint سلامت اپ (صفحه اصلی یا یک API عمومی) بالا باشد.
2. ثبت‌نام کاربر جدید انجام شود و wallet ساخته شود.
3. عملیات اصلی مالی (deposit/withdrawal/exchange) خطای موجودی ندهد.
4. upload فایل به R2 کار کند.

## متغیرهای حیاتی محیط
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_MODE`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_DEV_DOMAIN`
- `NEXT_PUBLIC_API_PROD_DOMAIN`
- `R2_ENDPOINT`
- `R2_BUCKET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_PUBLIC_URL`
