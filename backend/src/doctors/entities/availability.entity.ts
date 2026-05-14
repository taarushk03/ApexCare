import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('doctor_availability')
@Unique(['doctorId', 'date', 'startTime'])
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: number;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column()
  startTime: string; // e.g., "09:00 AM"

  @Column({ default: 'blocked' })
  type: string; // blocked, available

  @CreateDateColumn()
  createdAt: Date;
}
