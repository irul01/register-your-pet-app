import React, { useState } from "react";
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
  signaturePath: string;
}

const RegistrationForm: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setPreviewUrl(URL.createObjectURL(file));

      const fd = new FormData();
      fd.append("file", file);

      // Let the browser/axios set the Content-Type with correct boundary.
      // Use the shared axios instance `api` which already has baseURL configured at build time.
      const res = await api.post<{ path: string }>('/files', fd);
      setForm((prev) => ({ ...prev, signaturePath: res.data.path }));
    } catch (err: any) {
      console.error(err);
      alert("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/registrations", form);
      alert("등록 성공!");
      await generatePdf(form);
    } catch (err: any) {
      console.error(err);
      alert("등록 실패");
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
        <textarea name="specialNotes" value={form.specialNotes} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <Input label="신청일" name="applicationDate" type="date" value={form.applicationDate} onChange={handleChange} />

      <div>
        <label className="block text-sm font-medium">서명 파일</label>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="w-full border p-2 rounded" />
        {previewUrl && (
          <div className="mt-2">
            <img src={previewUrl} alt="서명 미리보기" style={{ maxHeight: 80 }} />
          </div>
        )}
      </div>

      <button type="submit" disabled={uploading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-60">
        제출하기
      </button>
    </form>
  );
};

const Input = ({ label, name, type = "text", value, onChange, accept }: { label: string; name: string; type?: string; value?: string; onChange: React.ChangeEventHandler<any>; accept?: string }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input type={type} name={name} value={type !== "file" ? value : undefined} onChange={onChange} accept={accept} className="w-full border p-2 rounded" required={type !== "file"} />
  </div>
);

const Select = ({ label, name, value, options, onChange }: { label: string; name: string; value: string; options: string[]; onChange: React.ChangeEventHandler<any> }) => (
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
