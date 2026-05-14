import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;
    @Column({ nullable: true })
    dob: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    blood_group: string;

    @Column({ nullable: true })
    height: string;

    @Column({ nullable: true })
    weight: string;

    @Column({ nullable: true })
    allergies: string;

    @Column({ nullable: true })
    emergency_contact_name: string;

    @Column({ nullable: true })
    emergency_contact_relation: string;

    @Column({ nullable: true })
    emergency_contact_phone: string;

    @Column({ default: 'PATIENT' })
    role: string;

    @CreateDateColumn()
    createdAt: Date;
}