import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Loan, LoanSchema } from './entities/loan.entity';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'upload'); // Specify the destination folder
        },
        filename: function (req, file, cb) {
          const extension = path.extname(file.originalname); // Extract extension
          cb(null, Date.now() + extension); // Combine timestamp and extension
        },
      }),
    }),
    MongooseModule.forFeature([
      {
        schema: LoanSchema,
        name: Loan.name
      }
    ])
  ],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
