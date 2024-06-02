import { Module } from '@nestjs/common';
import { PaymentsService } from './service/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entities/payment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: PaymentSchema,
        name: Payment.name
      }
    ])
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
