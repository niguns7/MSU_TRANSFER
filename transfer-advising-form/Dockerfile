# ---------- deps (install node_modules) ----------
FROM node:20-alpine AS deps
WORKDIR /app

# good to have for native modules and Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
# If you have package-lock.json, you can use: RUN npm ci
RUN npm install

# ---------- builder (build Next & generate Prisma client) ----------
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (no DB access needed)
RUN npx prisma generate

# Build Next.js (outputs .next)
RUN npm run build

# ---------- runner (smallest image to run app) ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Needed for Prisma binary on alpine
RUN apk add --no-cache openssl

# Run as non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma client + engines
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# package.json for scripts
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

USER nextjs
EXPOSE 3000

# Run migrations first, then start the standalone server
# Requires DATABASE_URL provided at runtime (compose env_file)
CMD npx prisma migrate deploy && node server.js
