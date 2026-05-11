import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    age: number;

    @Column()
    gender: string;

    @Column()
    phoneNumber: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    emergencyCase: boolean;
}