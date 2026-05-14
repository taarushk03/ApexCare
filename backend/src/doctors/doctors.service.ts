import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { Availability } from './entities/availability.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return await this.doctorRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return await this.doctorRepository.find();
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOneBy({ id });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(id: number, updateData: Partial<Doctor>): Promise<Doctor> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, updateData);
    return await this.doctorRepository.save(doctor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.doctorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
  }

  async toggleAvailability(doctorId: number, date: string, startTime: string): Promise<void> {
    if (!doctorId || !date || !startTime) {
      throw new BadRequestException('Missing required fields: doctorId, date, or startTime');
    }

    const existing = await this.availabilityRepository.findOne({
      where: { doctorId, date, startTime }
    });

    if (existing) {
      await this.availabilityRepository.remove(existing);
    } else {
      try {
        const availability = this.availabilityRepository.create({
          doctorId,
          date,
          startTime,
          type: 'blocked'
        });
        await this.availabilityRepository.save(availability);
      } catch (error) {
        // If it was created by another request in the meantime, we ignore the error
        // as the final state (blocked) is what we wanted anyway.
        if (error.code !== '23505') { // Postgres Unique violation code
           throw error;
        }
      }
    }
  }

  async findAvailability(doctorId: number): Promise<Availability[]> {
    return await this.availabilityRepository.find({
      where: { doctorId },
      order: { date: 'ASC', startTime: 'ASC' }
    });
  }

  async isSlotBlocked(doctorId: number, date: string, startTime: string): Promise<boolean> {
    const blocked = await this.availabilityRepository.findOne({
      where: { doctorId, date, startTime, type: 'blocked' }
    });
    return !!blocked;
  }
}
