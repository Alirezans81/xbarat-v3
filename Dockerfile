# ---------- Build stage ----------
FROM docker.arvancloud.ir/node:20 AS builder

WORKDIR /app

# 1️⃣ نصب pnpm (با نسخه ثابت برای پایداری)
RUN npm install -g pnpm@9

# 2️⃣ کپی فایل‌های package و lock
COPY package.json pnpm-lock.yaml ./

# 3️⃣ نصب dependencyها با استفاده از cache مؤثر pnpm
RUN pnpm install --frozen-lockfile

# 4️⃣ کپی سورس پروژه
COPY . .

# 5️⃣ Generate Prisma Client
RUN npx prisma generate

# 6️⃣ Build پروژه‌ی Next.js
RUN pnpm build


# ---------- Runtime stage ----------
FROM docker.arvancloud.ir/node:20 AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@9

# 1️⃣ فقط فایل‌های لازم را کپی کن
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# 2️⃣ کپی خروجی build و فایل‌های لازم از مرحله‌ی قبلی
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# ⚡ مهم: اطمینان از وجود node_modules (در صورت نیاز)
COPY --from=builder /app/node_modules ./node_modules

# 3️⃣ کپی env (اختیاری)
COPY .env .env

# 4️⃣ اجرای migration در محیط production
RUN npx prisma migrate deploy

EXPOSE 3000
CMD ["pnpm", "start"]

