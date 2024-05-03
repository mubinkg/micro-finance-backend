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
    sendMail(data:string, email:string){
        this.myMailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "noreply@zimbacash.com",
                Name: "Zimba Cash"
              },
              To: [
                {
                  Email:email,
                  Name: "Mubin"
                }
              ],
              Subject: "Login With this code",
              TextPart: `Your password to login zimbacash : ${data}`,
            }
          ]
        }).then((response) => {
          
        })
        .catch((error) => {
          
        });
    }
}