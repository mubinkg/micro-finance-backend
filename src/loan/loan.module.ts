import { Module } from '@nestjs/common';
import { LoanService } from './services/loan.service';
import { LoanController } from './controllers/loan.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Loan, LoanSchema } from './entities/loan.entity';
import { UserModule } from 'src/user/user.module';
import { LoanPaymentService } from './services/loan-payment.service';
import { LoanLateFeeService } from './services/loan-late-fee.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: LoanSchema,
        name: Loan.name,
      },
    ]),
    UserModule,
  ],
  controllers: [LoanController],
  providers: [LoanService, LoanPaymentService, LoanLateFeeService],
  exports: [LoanPaymentService, LoanLateFeeService, LoanService],
})
export class LoanModule {}
