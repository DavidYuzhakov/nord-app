FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
COPY prisma.config.ts ./

# для генерации клиента призмы нужен хоть какой-нибудь урл, поэтому ставим заглушку чтобы не падал докер
RUN DATABASE_URL="postgresql://noop:noop@localhost:5432/noop" npx prisma generate

# после npx prisma generate для кэширования prisma и package.json, 
COPY . .

RUN npm run build

# Production
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache openssl && npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./dist/src/generated

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]