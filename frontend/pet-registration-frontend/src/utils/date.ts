// utils/date.ts (만들거나 pdfGenerator.ts 맨 위에 포함)
const pad2 = (n: number) => String(n).padStart(2, "0");

export function toDate(d: string | Date | undefined | null): Date | null {
  if (!d) return null;
  if (d instanceof Date) return isNaN(d.getTime()) ? null : d;
  // 문자열인 경우
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

export function fmtYMD(d: string | Date | undefined | null): string {
  const dt = toDate(d);
  if (!dt) return "";
  const y = dt.getFullYear();
  const m = pad2(dt.getMonth() + 1);
  const day = pad2(dt.getDate());
  return `${y}.${m}.${day}`; // YYYY.MM.DD
}

export function splitYMD(d: string | Date | undefined | null): { y: string; m: string; d: string } {
  const dt = toDate(d);
  if (!dt) return { y: "", m: "", d: "" };
  return {
    y: String(dt.getFullYear()),
    m: pad2(dt.getMonth() + 1),
    d: pad2(dt.getDate())
  };
}
