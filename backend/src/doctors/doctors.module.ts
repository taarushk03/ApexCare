import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Availability } from './entities/availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Availability])],
  providers: [DoctorsService],
  controllers: [DoctorsController],
  exports: [DoctorsService],
})
export class DoctorsModule {}
