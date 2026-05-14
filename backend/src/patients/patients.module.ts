import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Appointment, User])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule { }