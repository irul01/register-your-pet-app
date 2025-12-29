# 1) Build
FROM node:20-alpine AS build
WORKDIR /app

# Accept build arg for API base URL and pass it into the build environment
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./
RUN npm ci
COPY . .
# Ensure Vite sees VITE_API_BASE_URL at build time
RUN npm run build

# 2) Serve
FROM nginx:alpine
# SPA 라우팅 대응
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
