import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column()
  doctorId: number;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column()
  reason: string;

  @Column({ default: 'Pending' })
  status: string; // Pending, Confirmed, Cancelled, Completed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
