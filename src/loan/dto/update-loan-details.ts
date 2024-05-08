import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateLoanDto } from './create-loan.dto';

export class UpdateLoanDetailsDto extends PartialType(CreateLoanDto){
    @IsString()
    @IsNotEmpty()
    id:string
}
