import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  specialization: string;

  @IsNumber()
  @Min(0)
  experience: number;

  @IsString()
  qualifications: string;

  @IsString()
  clinicLocation: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsString()
  availability: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
