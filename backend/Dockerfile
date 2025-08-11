# backend/Dockerfile
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
# Prisma 관련 파일/클라이언트
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
# 빌드 결과
COPY --from=builder /app/dist ./dist

# 시작 스크립트: 마이그레이션 → 앱 시작
COPY <<'EOF' /app/entrypoint.sh
#!/usr/bin/env bash
set -e
npx prisma migrate deploy
node dist/main.js
EOF
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
CMD ["/app/entrypoint.sh"]
