import { Injectable } from "@nestjs/common";
const Mailjet = require('node-mailjet');

@Injectable()
export class MailService{
    myMailjet = null
    constructor(){
        this.myMailjet = new Mailjet({
            apiKey: "22af123d4b56b8bff9c56532f46bd3e7",
            apiSecret: "6c81aa4fa5bad3b95ea1f27d615b3eb9"
        });
    }
    sendMail(){
        this.myMailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "givenchip@yahoo.com",
                Name: "Zimba Cash"
              },
              To: [
                {
                  Email: "mubin.ice.ru@gmail.com",
                  Name: "Mubin"
                }
              ],
              Subject: "Login With this code",
              TextPart: "Dear",
            }
          ]
        }).then((response) => {
          
        })
        .catch((error) => {
          
        });
    }
}