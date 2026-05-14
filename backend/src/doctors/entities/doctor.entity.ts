import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  specialization: string;

  @Column()
  experience: number;

  @Column()
  qualifications: string;

  @Column()
  clinicLocation: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column()
  availability: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  userId: number; // Optional link to User account

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
