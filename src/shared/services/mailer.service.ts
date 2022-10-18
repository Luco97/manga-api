import { Injectable } from '@nestjs/common';
// const nodemailer = require('nodemailer');
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
  private transport: Transporter;
  constructor() {
    this.transport = createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  sendMail(email: string, subject: string, html: string) {
    this.transport.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject,
      html: html,
    });
  }
}
