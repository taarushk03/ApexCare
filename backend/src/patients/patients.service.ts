import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findByDoctor(doctorId: number) {
    const appointments = await this.appointmentRepository.find({
      where: { doctorId },
      relations: ['patient'],
    });

    // Extract unique users (patients) from appointments
    const patientsMap = new Map<number, User>();
    appointments.forEach(app => {
      if (app.patient) {
        patientsMap.set(app.patient.id, app.patient);
      }
    });

    return Array.from(patientsMap.values());
  }

  create(createPatientDto: CreatePatientDto) {
    const patient = this.patientRepository.create(createPatientDto);
    return this.patientRepository.save(patient);
  }

  findAll() {
    return this.patientRepository.find();
  }

  async findOne(id: number) {
    const patient = await this.patientRepository.findOneBy({ id });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.findOne(id);

    Object.assign(patient, updatePatientDto);

    return this.patientRepository.save(patient);
  }

  async remove(id: number) {
    const patient = await this.findOne(id);

    await this.patientRepository.delete(id);

    return {
      message: `Patient ${patient.fullName} deleted successfully`,
    };
  }
}