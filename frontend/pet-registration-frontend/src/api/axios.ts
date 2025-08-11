// src/lib/axios.ts (파일 경로는 너의 구조에 맞게)
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 프로덕션에서 값이 없으면 바로 에러 내서 배포 단계에서 잡기
if (import.meta.env.PROD && !API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set');
}

export const api = axios.create({
  baseURL: API_BASE_URL, // 절대 URL
  timeout: 10000,
});
