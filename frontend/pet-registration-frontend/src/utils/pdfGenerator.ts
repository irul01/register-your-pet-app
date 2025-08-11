// pdfGenerator.ts
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import axios from 'axios';
import { fmtYMD, splitYMD } from "./date";

// ✅ 배포/개발 모두에서 공통으로 쓸 API 베이스 URL
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

// ✅ base + path를 안전하게 이어붙이는 헬퍼
const joinUrl = (base: string, path: string) =>
  `${base.replace(/\/+$/, '')}/${String(path).replace(/^\/+/, '')}`;

// ✅ signaturePath가 절대 URL이면 그대로, 상대면 API_BASE_URL을 붙여줌
const resolveToAbsolute = (maybePath: string) => {
  if (!maybePath) return '';
  if (/^https?:\/\//i.test(maybePath)) return maybePath;         // 이미 절대 URL
  if (API_BASE_URL) return joinUrl(API_BASE_URL, maybePath);      // 상대 경로 → 절대 URL
  return maybePath;                                               // (fallback) 그대로
};

type DrawBoxParams = {
  page: any;
  text: string;
  font: any;
  x: number;
  y: number;
  width: number;
  height: number;
  align?: 'left' | 'center' | 'right';
  maxFontSize?: number;
  minFontSize?: number;
};

function drawTextInBox({
  page,
  text,
  font,
  x,
  y,
  width,
  height,
  align = 'center',
  maxFontSize = 12,
  minFontSize = 8,
}: DrawBoxParams) {
  if (!text) return;
  let fontSize = maxFontSize;

  while (font.widthOfTextAtSize(text, fontSize) > width && fontSize > minFontSize) {
    fontSize -= 1;
  }

  const textWidth = font.widthOfTextAtSize(text, fontSize);
  let drawX = x;

  if (align === 'center') {
    drawX = x + (width - textWidth) / 2;
  } else if (align === 'right') {
    drawX = x + (width - textWidth);
  }

  page.drawText(text, {
    x: drawX,
    y: y + (height - fontSize) / 2,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
}

export async function generatePdf(record: any) {
  try {
    // 템플릿 PDF / 폰트는 프론트에서 정적 서빙되므로 상대 경로 유지
    const pdfUrl = "/register-animal.pdf";
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const fontUrl = "/fonts/NotoSansKR-Regular.ttf";
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);
    let page = pdfDoc.getPage(0);

    const map = (text: string, x: number, y: number, w: number, h: number) => {
      drawTextInBox({ page, text, font: customFont, x, y, width: w, height: h });
    };

    map("✓", 239, 842-123, 12, 12); // 등록 신청 v 표시
    // 텍스트 위치 매핑
    map(record.guardianName,     127, 842-235, 252-127, 235-217);   // 보호자 성명
    map(record.residentNo,       252, 842-235, 377-257, 235-217);   // 주민번호
    map(record.phoneNumber,      377, 842-235, 500-377, 235-217);   // 전화번호
    map(record.address,          127, 842-276, 360, 276-250);       // 주소
    map(record.animalName,       127, 842-404, 158-127, 404-382);   // 동물 이름
    map(record.breed,            158, 842-404, 192-158, 404-382);   // 품종
    map(record.furColor,         193, 842-404, 226-193, 404-382);   // 털색깔
    map(record.gender,           227, 842-404, 267-227, 404-382);   // 성별
    map(record.neutering,        268, 842-404, 302-268, 404-382);   // 중성화 여부
    map(fmtYMD(record.birthDate),        302, 842-404, 368-302, 404-382);         // 출생일
    map(fmtYMD(record.acquisitionDate),  369, 842-404, 435-369, 404-382);         // 취득일
    map(record.specialNotes,     436, 842-404, 58, 404-382);                          // 특이사항
    
    const ap = splitYMD(record.applicationDate); // 신청일
    map(ap.y, 320, 842-662, 347-320, 662-655);   // 년
    map(ap.m, 400, 842-662, 417-400, 662-655);   // 월 (01~12)
    map(ap.d, 470, 842-662, 485-470, 662-655);   // 일 (01~31)

    map(record.guardianName, 400, 842-690, 50, 15); // 신청인

    // ✍️ 서명 이미지 (배포 환경에서도 동작하도록 절대 URL로)
    if (record.signaturePath) {
      const imageUrl = resolveToAbsolute(record.signaturePath);
      const imageBytes = await axios
        .get(imageUrl, { responseType: 'arraybuffer' })
        .then(res => res.data);

      const signatureImage = await pdfDoc.embedPng(imageBytes);
      const maxHeight = 30;
      const scale = maxHeight / signatureImage.height;
      const dims = signatureImage.scale(scale);

      page.drawImage(signatureImage, {
        x: 450,
        y: 842-700,
        width: dims.width,
        height: dims.height,
      });

      page = pdfDoc.getPage(1);
      page.drawImage(signatureImage, { x: 438, y: 842-330, width: dims.width, height: dims.height });
      page.drawImage(signatureImage, { x: 438, y: 842-382, width: dims.width, height: dims.height });
      page.drawImage(signatureImage, { x: 438, y: 842-420, width: dims.width, height: dims.height });

      map(record.guardianName, 390, 842-330, 435-390, 235-217);   // 보호자 성명
      map(record.guardianName, 390, 842-382, 435-390, 235-217);   // 보호자 성명
      map(record.guardianName, 390, 842-420, 435-390, 235-217);   // 보호자 성명
    }

    const pdfBytes = await pdfDoc.save();
    const byteArray = new Uint8Array(pdfBytes);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error("PDF 생성 중 오류:", error);
    alert("PDF 생성에 실패했습니다. 콘솔을 확인해주세요.");
  }
}
