import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';


@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  // Registration 생성
  async create(createRegistrationDto: CreateRegistrationDto) {
    const {
      guardianName,
      residentNo,
      phoneNumber,
      address,
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
      // Prisma를 사용하여 DB에 등록
      const registration = await this.prisma.registration.create({
        data: {
          guardianName,
          residentNo,
          phoneNumber,
          address,
          animalName,
          breed,
          furColor,
          gender,
          neutering,
          birthDate: new Date(birthDate), // Date 형식으로 변환
          acquisitionDate: new Date(acquisitionDate), // Date 형식으로 변환
          specialNotes,
          applicationDate: new Date(applicationDate), // Date 형식으로 변환
          signaturePath,
        },
      });

      return registration;
    } catch (error) {
      throw new Error(`Registration creation failed: ${error.message}`);
    }
  }

  // 모든 Registration 조회
  async findAll() {
    return await this.prisma.registration.findMany();
  }

  // 특정 Registration 조회
  async findOne(id: number) {
    return await this.prisma.registration.findUnique({
      where: { id },
    });
  }


// ...생략
  async findAllPaginated({ page, take }: { page: number; take: number }) {
    const skip = (page - 1) * take;

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
