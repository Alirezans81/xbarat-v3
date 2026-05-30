# ---------- Build stage ----------
FROM docker.arvancloud.ir/node:20 AS builder

WORKDIR /app

RUN npm install -g pnpm@9
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set registry https://package-mirror.liara.ir/repository/npm/ --global
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN HTTP_PROXY=http://host.docker.internal:10809 \
    HTTPS_PROXY=http://host.docker.internal:10809 \
    ALL_PROXY=http://host.docker.internal:10809 \
    NO_PROXY=localhost,127.0.0.1 \
    pnpm rebuild esbuild sharp

RUN PRISMA_ENGINES_TIMEOUT=600000 \
    PRISMA_CLIENT_ENGINE_BINARY_DOWNLOAD_TIMEOUT=600000 \
    HTTP_PROXY=http://host.docker.internal:10809 \
    HTTPS_PROXY=http://host.docker.internal:10809 \
    NO_PROXY=localhost,127.0.0.1 \
    pnpm prisma generate

RUN pnpm prisma migrate deploy
RUN pnpm build

# ---------- Runtime stage ----------
FROM docker.arvancloud.ir/node:20 AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@9

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma

COPY .env .env

EXPOSE 3000
CMD ["pnpm", "start"]
