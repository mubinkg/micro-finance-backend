import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLoanDto {
  @IsString()
  @IsNotEmpty()
  status?: string;

  @IsString()
  @IsOptional()
  comments?: string;

  isIntersetPays?: boolean;
  isLoanPays?: boolean;
  previousLateFee?: number;
  paidlLateFee?: number;
  paidInterset?: number;
}
