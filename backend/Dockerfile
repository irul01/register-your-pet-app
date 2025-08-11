# --- build stage ---
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev

# Prisma 클라이언트와 관련 파일 전부 복사
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client /app/node_modules/@prisma/client

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

COPY <<'EOF' /app/entrypoint.sh
#!/usr/bin/env bash
set -e
npx prisma migrate deploy
node dist/main.js
EOF
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
CMD ["/app/entrypoint.sh"]
