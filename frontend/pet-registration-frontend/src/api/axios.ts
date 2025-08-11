// src/api/axios.ts
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 프로덕션에서 값이 없으면 빌드 시점에 실패하도록(선택)
if (import.meta.env.PROD && !API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE_URL is not set for production build.');
}

export default api;   // ✅ default export 추가
export { api };       // (원하면 동시에 named도 유지)
