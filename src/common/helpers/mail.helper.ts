// src/common/helpers/mail.helper.ts

import * as nodemailer from 'nodemailer';

export class MailHelper {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,  // Move sensitive data to environment variables
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Method to send email
  static async sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    });
  }
}
