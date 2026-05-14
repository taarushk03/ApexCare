import { createConnection } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Doctor } from './src/doctors/entities/doctor.entity';
import * as bcrypt from 'bcrypt';

async function seedDoctor() {
    const connection = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'taarush@123',
        database: 'apexcare',
        entities: [User, Doctor],
        synchronize: true,
    });
    const userRepository = connection.getRepository(User);
    const doctorRepository = connection.getRepository(Doctor);

    const email = 'sarah@example.com';
    const password = 'doctor123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create Doctor User
    let user = await userRepository.findOne({ where: { email } });
    if (!user) {
        user = userRepository.create({
            email,
            password: hashedPassword,
            firstName: 'Sarah',
            lastName: 'Smith',
            role: 'DOCTOR'
        });
        await userRepository.save(user);
        console.log('Doctor User created');
    } else {
        user.role = 'DOCTOR';
        await userRepository.save(user);
        console.log('User already existed, role updated to DOCTOR');
    }

    // 2. Create Doctor Profile
    let doctor = await doctorRepository.findOne({ where: { userId: user.id } });
    if (!doctor) {
        doctor = doctorRepository.create({
            fullName: 'Dr Sarah Smith',
            email: email,
            specialization: 'Cardiologist',
            experience: 12,
            qualifications: 'MD, PhD',
            clinicLocation: 'ApexCare Heart Center',
            bio: 'Senior Cardiologist specializing in heart surgery and recovery.',
            availability: 'Mon - Fri, 9 AM - 5 PM',
            userId: user.id
        });
        await doctorRepository.save(doctor);
        console.log('Doctor Profile created and linked to User');
    } else {
        doctor.userId = user.id;
        await doctorRepository.save(doctor);
        console.log('Doctor Profile updated with User ID');
    }

    await connection.close();
}

seedDoctor().catch(err => console.error(err));
