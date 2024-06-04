import { Module } from '@nestjs/common';
import { PaymentsService } from './service/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { LoanModule } from 'src/loan/loan.module';
import { Loan, LoanSchema } from 'src/loan/entities/loan.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: PaymentSchema,
        name: Payment.name
      },
      {
        schema: LoanSchema,
        name: Loan.name
      }
    ]),
    LoanModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
