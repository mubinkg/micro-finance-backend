import { IsOptional, IsString } from 'class-validator';

export class UserSigninDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
