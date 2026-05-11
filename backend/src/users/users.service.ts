import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll() {
        return this.usersRepository.find();
    }

    async updateProfile(id: number, updateData: Partial<User>) {

        await this.usersRepository.update(id, updateData);

        return this.usersRepository.findOne({
            where: { id },
        });
    }

    async findOne(id: number) {
        return this.usersRepository.findOne({
            where: { id },
            select: [
                'id',
                'email',
                'firstName',
                'lastName',
                'role',
                'dob',
                'phone',
                'address',
                'blood_group',
                'height',
                'weight',
                'allergies',
                'emergency_contact_name',
                'emergency_contact_relation',
                'emergency_contact_phone',
            ],
        });
    }

}