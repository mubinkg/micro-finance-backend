import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './mail/mail.module';
import { LoanModule } from './loan/loan.module';
import { UploadModule } from './upload/upload.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/microfinanace'),
    UserModule,
    MailModule,
    LoanModule,
    UploadModule,
    PaymentsModule
  ]
})
export class AppModule {}
