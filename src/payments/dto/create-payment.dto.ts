import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { PaymentEnum } from "../enum/payment.enum";

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    amount:number

    @IsNumber()
    @IsNotEmpty()
    lateFee:number

    @IsEnum(PaymentEnum)
    @IsNotEmpty()
    paymentType: PaymentEnum
}
