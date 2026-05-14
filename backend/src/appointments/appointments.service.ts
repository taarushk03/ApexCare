import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorsService: DoctorsService,
  ) {}

  private normalizeTime(date: Date): string {
    // We need to format the time exactly as it is stored in the database (e.g., "09:00 AM")
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const strHours = displayHours < 10 ? '0' + displayHours : displayHours;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${strHours}:${strMinutes} ${ampm}`;
  }

  private formatDate(date: Date): string {
    // Get YYYY-MM-DD in local time to match what the doctor sees/blocks
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { doctorId, appointmentDate } = createAppointmentDto;
    const dateObj = new Date(appointmentDate);

    console.log('[BOOKING REQUEST START]', { 
      doctorId, 
      appointmentDate, 
      local: dateObj.toString(),
      iso: dateObj.toISOString() 
    });

    const dateStr = this.formatDate(dateObj);
    const timeStr = this.normalizeTime(dateObj);
    
    console.log('[VALIDATING SLOT]', { dateStr, timeStr });

    const isBlocked = await this.doctorsService.isSlotBlocked(doctorId, dateStr, timeStr);
    console.log('[AVAILABILITY DATABASE RESULT]', { isBlocked });

    if (isBlocked) {
      console.warn('[BOOKING FAILED] Attempted to book a blocked slot:', { doctorId, dateStr, timeStr });
      throw new BadRequestException('This time slot is unavailable (blocked by doctor)');
    }

    // 2. Check if slot is already booked
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId,
        appointmentDate: dateObj,
        status: Not('Cancelled'),
      },
    });

    if (existingAppointment) {
      console.warn('[BOOKING FAILED] Slot already booked:', { doctorId, appointmentDate });
      throw new BadRequestException('This slot is already booked');
    }

    const appointment = this.appointmentRepository.create(createAppointmentDto);
    const saved = await this.appointmentRepository.save(appointment);
    console.log('[BOOKING SUCCESS] Created appointment ID:', saved.id);
    return saved;
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      relations: ['patient', 'doctor'],
      order: { appointmentDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(id: number, updateData: Partial<Appointment>): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateData);
    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = 'Cancelled';
    const updated = await this.appointmentRepository.save(appointment);
    console.log(`Appointment ${id} status updated to: ${updated.status}`);
    return updated;
  }

  async findByPatient(patientId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { patientId },
      relations: ['doctor'],
      order: { appointmentDate: 'DESC' },
    });
  }

  async findByDoctor(doctorId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { doctorId },
      relations: ['patient'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findBookedSlots(doctorId: number, date: string): Promise<string[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Get real booked appointments
    const appointments = await this.appointmentRepository.find({
      where: {
        doctorId,
        appointmentDate: Between(startOfDay, endOfDay),
        status: Not('Cancelled'),
      },
    });

    const bookedTimes = appointments.map(a => 
      this.normalizeTime(new Date(a.appointmentDate))
    );

    // 2. Get manually blocked slots
    const availabilities = await this.doctorsService.findAvailability(doctorId);
    const blockedTimes = availabilities
      .filter(a => a.date === date && a.type === 'blocked')
      .map(a => a.startTime);

    // 3. Combine them
    return Array.from(new Set([...bookedTimes, ...blockedTimes]));
  }

  async cleanupDuplicates(): Promise<string> {
    const appointments = await this.appointmentRepository.find({
      where: { status: Not('Cancelled') },
      order: { appointmentDate: 'ASC', id: 'ASC' }
    });

    const seen = new Set<string>();
    let cancelledCount = 0;

    for (const app of appointments) {
      const key = `${app.doctorId}-${app.patientId}-${new Date(app.appointmentDate).toISOString()}`;
      if (seen.has(key)) {
        app.status = 'Cancelled';
        await this.appointmentRepository.save(app);
        cancelledCount++;
      } else {
        seen.add(key);
      }
    }

    return `Cleanup complete. ${cancelledCount} duplicate appointments were cancelled.`;
  }
}
