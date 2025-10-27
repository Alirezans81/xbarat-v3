# ---------- Build stage ----------
FROM docker.arvancloud.ir/node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build


# ---------- Runtime stage ----------
FROM docker.arvancloud.ir/node:20 AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only required files
COPY package*.json ./
RUN npm install --omit=dev

# Copy build and prisma artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Copy .env if needed
COPY .env .env

# Run Prisma migrations
RUN npx prisma migrate deploy

EXPOSE 3000
CMD ["npm", "start"]
# ---------- Build stage ----------
FROM docker.arvancloud.ir/node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build


# ---------- Runtime stage ----------
FROM docker.arvancloud.ir/node:20 AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only required files
COPY package*.json ./
RUN npm install --omit=dev

# Copy build and prisma artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Copy .env if needed
COPY .env .env

# Run Prisma migrations
RUN npx prisma migrate deploy

EXPOSE 3000
CMD ["npm", "start"]

