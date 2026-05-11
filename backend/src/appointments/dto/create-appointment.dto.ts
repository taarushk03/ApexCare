import { IsDateString, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  doctorId: number;

  @IsDateString()
  appointmentDate: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsEnum(['Pending', 'Confirmed', 'Cancelled', 'Completed'])
  status?: string;
}
