import api from './axios';

export type UploadResponse = { path: string }; // 서버가 { path: "/uploads/xxxx.png" }로 응답

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);

  // ⚠️ Content-Type 헤더를 직접 설정하지 마세요! (브라우저가 boundary 자동 설정)
  const { data } = await api.post<UploadResponse>('/files', form);
  return data.path; // "/uploads/xxxx.png"
}
