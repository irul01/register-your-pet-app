import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  guardianName: string; // 보호자 성명

  @IsString()
  @IsNotEmpty()
  residentNo: string; // 주민등록번호

  @IsString()
  @IsNotEmpty()
  phoneNumber: string; // 전화번호

  @IsString()
  @IsNotEmpty()
  address: string; // 주소

  @IsString()
  @IsNotEmpty()
  animalRegistrationNumber: string; // 동물등록번호

  @IsString()
  @IsNotEmpty()
  animalName: string; // 동물이름

  @IsString()
  @IsNotEmpty()
  breed: string; // 품종

  @IsString()
  @IsNotEmpty()
  furColor: string; // 털 색깔

  @IsEnum(['암', '수'])
  @IsNotEmpty()
  gender: string; // 성별 ("암" 또는 "수")

  @IsEnum(['여', '부'])
  @IsNotEmpty()
  neutering: string; // 중성화 ("여" 또는 "부")

  @IsDateString()
  @IsNotEmpty()
  birthDate: string; // 출생일 (YYYY-MM-DD)

  @IsOptional()
  @IsDateString()
  acquisitionDate?: string; // 취득일 (선택)

  @IsOptional()
  @IsString()
  specialNotes?: string; // 특이사항 (선택 입력)

  @IsDateString()
  @IsNotEmpty()
  applicationDate: string; // 신청일 (YYYY-MM-DD)

  @IsString()
  @IsNotEmpty()
  signaturePath: string; // 서명 (파일 경로)
}
