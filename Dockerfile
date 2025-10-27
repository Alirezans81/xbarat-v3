# ---------- Build stage ----------
FROM docker.arvancloud.ir/node:20 AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN pnpm build


# ---------- Runtime stage ----------
FROM docker.arvancloud.ir/node:20 AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/node_modules ./node_modules

COPY .env .env

RUN npx prisma migrate deploy

EXPOSE 3000
CMD ["pnpm", "start"]
