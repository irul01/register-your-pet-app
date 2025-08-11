// src/api/axios.ts
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL, // 빈 문자열이면 현재 오리진으로 감(= 프론트 도메인)
  timeout: 10000,
});

// 배포에서 값 없으면 경고
if (import.meta.env.PROD && !API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE_URL is NOT set. Requests will go to the frontend origin.');
}

export default api;
