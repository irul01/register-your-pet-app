import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  // 생성
  @Post()
  async create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return await this.registrationService.create(createRegistrationDto);
  }

  // 서버 페이징 조회
  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.max(1, parseInt(limit, 10) || 10);

    return await this.registrationService.findAllPaginated({
      page: pageNum,
      take,
    });
  }

  // 단건 조회
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.registrationService.findOne(id);
  }
}
