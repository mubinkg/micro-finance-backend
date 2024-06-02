import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PaymentEnum } from "../enum/payment.enum";

export class CreatePaymentDto {
    
    @IsString()
    @IsMongoId()
    loanId: string

    @IsNumber()
    @IsNotEmpty()
    amount:number

    @IsEnum(PaymentEnum)
    @IsNotEmpty()
    paymentType: PaymentEnum

    userId: string
}
