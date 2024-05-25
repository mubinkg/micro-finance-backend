import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Loan, LoanSchema } from './entities/loan.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: LoanSchema,
        name: Loan.name
      }
    ]),
    UserModule
  ],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
