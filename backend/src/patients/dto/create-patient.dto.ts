import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNumber,
    IsString,
    Length,
    Matches,
    Max,
    Min,
} from 'class-validator';

export class CreatePatientDto {
    @IsString()
    @Length(3, 50)
    fullName: string;

    @IsNumber()
    @Min(0)
    @Max(120)
    age: number;

    @IsEnum(['Male', 'Female', 'Other'])
    gender: string;

    @Matches(/^[0-9]{10}$/)
    phoneNumber: string;

    @IsEmail()
    email: string;

    @IsBoolean()
    emergencyCase: boolean;
}