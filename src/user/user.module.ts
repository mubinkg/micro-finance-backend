import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    MailModule,
    JwtModule.register({
      global: true,
      secret: 'lsjhf8w7r98usjdhfjhsfkjhdsufw7r8OOPPhsjf',
      signOptions: { expiresIn: '60d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
