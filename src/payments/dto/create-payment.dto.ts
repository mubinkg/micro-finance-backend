import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { PaymentEnum } from "../enum/payment.enum";

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    amount:number

    @IsEnum(PaymentEnum)
    @IsNotEmpty()
    paymentType: PaymentEnum
}
