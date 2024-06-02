import { Module } from '@nestjs/common';
import { PaymentsService } from './service/payments.service';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
