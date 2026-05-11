import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }
    @Patch(':id')
    updateProfile(
        @Param('id') id: string,
        @Body() updateData: any,
    ) {
        return this.usersService.updateProfile(Number(id), updateData);
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(Number(id));
    }

}