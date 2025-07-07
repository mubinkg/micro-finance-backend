import { Body, Controller, Post } from '@nestjs/common';
import { CreateMail } from './dto/create-mail.input';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  createMail(@Body() createMailInput: CreateMail) {
    return this.mailService.sendMailFromUser(createMailInput);
  }
}
