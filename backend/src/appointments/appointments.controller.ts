import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Post('cleanup')
  cleanupDuplicates(): Promise<string> {
    return this.appointmentsService.cleanupDuplicates();
  }

  @Get()
  findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get('patient/:patientId')
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number): Promise<Appointment[]> {
    return this.appointmentsService.findByPatient(patientId);
  }

  @Get('booked-slots')
  findBookedSlots(
    @Query('doctorId', ParseIntPipe) doctorId: number,
    @Query('date') date: string,
  ): Promise<string[]> {
    return this.appointmentsService.findBookedSlots(doctorId, date);
  }

  @Get('doctor/:doctorId')
  findByDoctor(@Param('doctorId', ParseIntPipe) doctorId: number): Promise<Appointment[]> {
    return this.appointmentsService.findByDoctor(doctorId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<Appointment>): Promise<Appointment> {
    return this.appointmentsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return this.appointmentsService.remove(id);
  }
}
