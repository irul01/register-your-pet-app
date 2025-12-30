import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';


@Injectable()
export class RegistrationService {
  private mockData: Record<number, any> = {}; // In-memory storage for demo
  private idCounter = 1;

  constructor(private readonly prisma: PrismaService) {}

  private isDatabaseConnected(): boolean {
    return !!process.env.DATABASE_URL;
  }

  // Registration 생성
  async create(createRegistrationDto: CreateRegistrationDto) {
    const {
      guardianName,
      residentNo,
      phoneNumber,
      address,
      animalRegistrationNumber,
      animalName,
      breed,
      furColor,
      gender,
      neutering,
      birthDate,
      acquisitionDate,
      specialNotes,
      applicationDate,
      signaturePath,
    } = createRegistrationDto;

    try {
      // If no database, use mock storage
      if (!this.isDatabaseConnected()) {
        const id = this.idCounter++;
        const mockRegistration = {
          id,
          guardianName,
          residentNo,
          phoneNumber,
          address,
          animalRegistrationNumber,
          animalName,
          breed,
          furColor,
          gender,
          neutering,
          birthDate: new Date(birthDate),
          acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
          specialNotes,
          applicationDate: new Date(applicationDate),
          signaturePath,
          createdAt: new Date(),
        };
        this.mockData[id] = mockRegistration;
        return mockRegistration;
      }

      const data: any = {
        guardianName,
        residentNo,
        phoneNumber,
        address,
        animalRegistrationNumber,
        animalName,
        breed,
        furColor,
        gender,
        neutering,
        birthDate: new Date(birthDate), // Date 형식으로 변환
        specialNotes,
        applicationDate: new Date(applicationDate), // Date 형식으로 변환
        signaturePath,
      };

      if (acquisitionDate) {
        data.acquisitionDate = new Date(acquisitionDate);
      }

      // Prisma를 사용하여 DB에 등록
      const registration = await this.prisma.registration.create({ data });

      return registration;
    } catch (error) {
      throw new Error(`Registration creation failed: ${(error as Error).message}`);
    }
  }

  // 모든 Registration 조회
  async findAll() {
    if (!this.isDatabaseConnected()) {
      return Object.values(this.mockData);
    }
    return await this.prisma.registration.findMany();
  }

  // 특정 Registration 조회
  async findOne(id: number) {
    if (!this.isDatabaseConnected()) {
      return this.mockData[id] || null;
    }
    return await this.prisma.registration.findUnique({
      where: { id },
    });
  }

  // 페이징 조회
  async findAllPaginated({ page, take }: { page: number; take: number }) {
    const skip = (page - 1) * take;

    if (!this.isDatabaseConnected()) {
      const items = Object.values(this.mockData).slice(skip, skip + take);
      const total = Object.keys(this.mockData).length;
      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / take),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.registration.findMany({
        skip,
        take,
        orderBy: { id: 'desc' }, // 최신 등록순
      }),
      this.prisma.registration.count(),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / take),
    };
  }
}
