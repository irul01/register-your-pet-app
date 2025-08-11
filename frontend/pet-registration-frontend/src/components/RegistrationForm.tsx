// src/components/RegistrationForm.tsx
import { useState } from "react";
import api from "../api/axios";
import { generatePdf } from "../utils/pdfGenerator";

interface FormData {
  guardianName: string;
  residentNo: string;
  phoneNumber: string;
  address: string;
  animalName: string;
  breed: string;
  furColor: string;
  gender: "암" | "수";
  neutering: "여" | "부";
  birthDate: string;
  acquisitionDate: string;
  specialNotes?: string;
  applicationDate: string;
  signaturePath: string; // 서버가 돌려준 /uploads/xxx.png
}

type UploadResponse = { path: string };

const RegistrationForm = () => {
  const [form, setForm] = useState<FormData>({
    guardianName: "",
    residentNo: "",
    phoneNumber: "",
    address: "",
    animalName: "",
    breed: "",
    furColor: "",
    gender: "암",
    neutering: "여",
    birthDate: "",
    acquisitionDate: "",
    specialNotes: "",
    applicationDate: "",
    signaturePath: "",
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 서명 이미지 업로드: POST /files (multipart/form-data)
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("file", file);

    // ✅ 업로드는 절대 URL로 강제 → 프론트 도메인으로 안 샙니다
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
    if (!API_BASE) {
      console.error("VITE_API_BASE_URL is empty in build. Upload will fail (goes to frontend).");
      alert("서버 설정 오류: VITE_API_BASE_URL이 설정되지 않았습니다.");
      return;
    }
    const url = `${API_BASE}/files`;

    // 절대 URL을 쓰면 axios의 baseURL은 무시되고, 무조건 백엔드로 갑니다
    const res = await api.post<{ path: string }>(url, fd);
    setForm((prev) => ({ ...prev, signaturePath: res.data.path }));
    alert("서명 이미지 업로드 성공");
  } catch (err: any) {
    console.error("이미지 업로드 실패:", err.response?.data || err.message);
    alert("이미지 업로드 실패: " + (err.response?.data?.message || err.message));
  } finally {
    setUploading(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 등록 데이터 서버 저장
      await api.post("/registrations", form);
      alert("등록 성공!");

      // PDF 생성 (서명 포함)
      await generatePdf(form);
    } catch (error: any) {
      console.error("등록 실패:", error.response?.data || error.message);
      alert("등록 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold">애견 등록 신청서</h2>

      <Input label="보호자 성명" name="guardianName" value={form.guardianName} onChange={handleChange} />
      <Input label="주민등록번호" name="residentNo" value={form.residentNo} onChange={handleChange} />
      <Input label="전화번호" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
      <Input label="주소" name="address" value={form.address} onChange={handleChange} />
      <Input label="동물이름" name="animalName" value={form.animalName} onChange={handleChange} />
      <Input label="품종" name="breed" value={form.breed} onChange={handleChange} />
      <Input label="털 색깔" name="furColor" value={form.furColor} onChange={handleChange} />

      <Select label="성별" name="gender" value={form.gender} onChange={handleChange} options={["암", "수"]} />
      <Select label="중성화 여부" name="neutering" value={form.neutering} onChange={handleChange} options={["여", "부"]} />

      <Input label="출생일" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
      <Input label="취득일" name="acquisitionDate" type="date" value={form.acquisitionDate} onChange={handleChange} />

      <div>
        <label className="block text-sm font-medium">특이사항</label>
        <textarea
          name="specialNotes"
          value={form.specialNotes}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <Input label="신청일" name="applicationDate" type="date" value={form.applicationDate} onChange={handleChange} />

      {/* 서명 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium">서명 파일</label>
        <input
          type="file"
          name="signaturePath"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full border p-2 rounded"
        />
        {previewUrl && (
          <div className="mt-2">
            <img src={previewUrl} alt="서명 미리보기" style={{ maxHeight: 80 }} />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-60"
      >
        제출하기
      </button>
    </form>
  );
};

// 공통 Input
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  accept,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string;
  onChange: React.ChangeEventHandler;
  accept?: string;
}) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={type !== "file" ? value : undefined}
      onChange={onChange}
      accept={accept}
      className="w-full border p-2 rounded"
      required={type !== "file"}
    />
  </div>
);

// 공통 Select
const Select = ({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: React.ChangeEventHandler;
}) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full border p-2 rounded">
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default RegistrationForm;
