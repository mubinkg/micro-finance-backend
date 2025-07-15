import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMail {
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  body?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string;
}
