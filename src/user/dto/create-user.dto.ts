import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsString()
    @IsNotEmpty()
    @Transform((value) => value.toString().toLowerCase())
    email: string
}

