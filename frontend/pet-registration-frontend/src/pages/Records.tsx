// src/pages/Records.tsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { generatePdf } from "../utils/pdfGenerator";

interface Registration {
  id: number;
  guardianName: string;
  animalName: string;
  breed: string;
  applicationDate: string;
  signaturePath: string;
}

const PAGE_SIZE = 10;

const Records = () => {
  const [data, setData] = useState<Registration[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchPage = (p: number) => {
    setLoading(true);
    setErr(null);
    axios
      .get(`/registrations?page=${p}&limit=${PAGE_SIZE}`)
      .then((res) => {
        setData(res.data.items ?? []);
        setTotal(res.data.total ?? 0);
        setTotalPages(res.data.totalPages ?? 1);
      })
      .catch((e) => setErr(e?.message || "데이터 조회 실패"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  const handlePrint = (record: Registration) => {
    generatePdf(record);
  };

  const fmt = (s?: string) => {
    if (!s) return "";
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  };

  const goto = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">등록 내역</h1>
        <div className="text-sm text-gray-600">
          총 {total}건 · 페이지 {page}/{totalPages}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">보호자</th>
              <th className="border px-3 py-2 text-left">동물 이름</th>
              <th className="border px-3 py-2 text-left">품종</th>
              <th className="border px-3 py-2 text-left">신청일</th>
              <th className="border px-3 py-2">PDF</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="border px-3 py-6 text-center text-gray-500">
                  불러오는 중…
                </td>
              </tr>
            ) : err ? (
              <tr>
                <td colSpan={6} className="border px-3 py-6 text-center text-red-600">
                  에러: {err}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="border px-3 py-6 text-center text-gray-500">
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((reg) => (
                <tr key={reg.id} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-3 py-2">{reg.id}</td>
                  <td className="border px-3 py-2">{reg.guardianName}</td>
                  <td className="border px-3 py-2">{reg.animalName}</td>
                  <td className="border px-3 py-2">{reg.breed}</td>
                  <td className="border px-3 py-2">{fmt(reg.applicationDate)}</td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handlePrint(reg)}
                    >
                      출력
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2">
        <button
          className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-40"
          onClick={() => goto(page - 1)}
          disabled={page === 1}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            const window = 3;
            return p === 1 || p === totalPages || Math.abs(p - page) <= window;
          })
          .map((p, idx, arr) => {
            const prev = arr[idx - 1];
            const ellipsis = prev !== undefined && p - prev > 1;
            return (
              <span key={p} className="flex items-center">
                {ellipsis && <span className="mx-1 text-gray-400">…</span>}
                <button
                  className={`px-3 py-1 rounded border ${
                    p === page ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => goto(p)}
                >
                  {p}
                </button>
              </span>
            );
          })}

        <button
          className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-40"
          onClick={() => goto(page + 1)}
          disabled={page === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Records;
