import { Injectable } from '@nestjs/common';
import { CreateMail } from './dto/create-mail.input';
const Mailjet = require('node-mailjet');

@Injectable()
export class MailService {
  myMailjet = null;
  constructor() {
    this.myMailjet = new Mailjet({
      apiKey: process.env.MILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET,
    });
  }

  sendMail(data: string, email: string, userName: string) {
    this.myMailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'noreply@zimbacash.com',
              Name: 'Zimba Cash',
            },
            To: [
              {
                Email: email,
                Name: userName,
              },
            ],
            Subject: 'Login with attached code',
            TextPart: `Your password to login to ZimbaCash : ${data}`,
          },
        ],
      })
      .then((response) => {
        console.log('Response after mail success : ', response);
      })
      .catch((error) => {
        console.log('Error after mail failed : ', error);
      });
  }

  sendMailWithBcc(data: string, email: string, userName: string) {
    this.myMailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'noreply@zimbacash.com',
              Name: 'Zimba Cash',
            },
            Bcc: [
              {
                Email: 'givenchip@yahoo.com',
                Name: 'BCC Recipient',
              },
              {
                Email: 'givenchip@gmail.com',
                Name: 'BCC Recipient',
              },
            ],
            To: [
              {
                Email: email,
                Name: userName,
              },
            ],
            Subject: 'Login with attached code',
            TextPart: `Your password to login to ZimbaCash : ${data}`,
          },
        ],
      })
      .then((response) => {
        console.log('Response after mail success : ', response);
      })
      .catch((error) => {
        console.log('Error after mail failed : ', error);
      });
  }

  sendMailFromUser(createMail: CreateMail) {
    this.myMailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: createMail.email,
              Name: createMail.firstName + ' ' + createMail.lastName,
            },
            To: [
              {
                Email: 'admin@zimbacash.com',
                Name: 'Zimba Cash',
              },
            ],
            Subject: createMail.subject,
            TextPart: createMail.body,
          },
        ],
      })
      .then((response) => { })
      .catch((error) => { });

    return 'Mail sent';
  }
}
