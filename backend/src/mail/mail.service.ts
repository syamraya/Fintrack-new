import { Injectable } from '@nestjs/common';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private client: BrevoClient;

  constructor() {
    this.client = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY,
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    return this.client.transactionalEmails.sendTransacEmail({
      to: [{ email: to }],
      subject,
      htmlContent: html,
      sender: { name: 'FinTrack Admin', email: 'fintrack444@gmail.com' },
    });
  }
}