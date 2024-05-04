import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLoanDto {
    @IsString()
    @IsNotEmpty()
    status:string
}
