# --- build stage ---
FROM node:20-slim AS builder
WORKDIR /app

# 필수 패키지(OpenSSL 포함) 설치
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
# Prisma Client를 native + debian-openssl-3.0.x 대상으로 생성
RUN npx prisma generate --schema=prisma/schema.prisma

COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

# OpenSSL 설치 (Prisma 실행 필수)
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm ci --omit=dev

# Prisma 관련 디렉토리 전부 복사
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client /app/node_modules/@prisma/client

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# ✅ 업로드 디렉토리 미리 생성
RUN mkdir -p /app/uploads

# 엔트리포인트
COPY <<'EOF' /app/entrypoint.sh
#!/usr/bin/env bash
set -e
if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
else
  echo "Skipping Prisma migrations (no DATABASE_URL)"
fi
node dist/main.js
EOF
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080
CMD ["/app/entrypoint.sh"]
