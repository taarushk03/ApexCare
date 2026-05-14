import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { Availability } from './entities/availability.entity';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Post(':id/availability')
  toggleAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { date: string, startTime: string }
  ): Promise<void> {
    return this.doctorsService.toggleAvailability(id, body.date, body.startTime);
  }

  @Get(':id/availability')
  findAvailability(@Param('id', ParseIntPipe) id: number): Promise<Availability[]> {
    return this.doctorsService.findAvailability(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<Doctor>): Promise<Doctor> {
    return this.doctorsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.doctorsService.remove(id);
  }
}
