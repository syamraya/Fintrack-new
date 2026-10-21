import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private client: BrevoClient;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is required for MailService');
    }

    this.client = new BrevoClient({
      apiKey,
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    // Evaluasi sender email dan name secara langsung saat fungsi dipanggil
    const senderEmail = process.env.EMAIL_FROM || 'fintrack444@gmail.com';
    const senderName = process.env.MAIL_FROM_NAME || 'FinTrack Admin';

    try {
      const response = await this.client.transactionalEmails.sendTransacEmail({
        to: [{ email: to }],
        subject,
        htmlContent: html,
        sender: { name: senderName, email: senderEmail },
      });

      console.log('[MailService] Brevo transaction response:', response);
      return response;
    } catch (error) {
      console.error('[MailService] Brevo sendTransacEmail error:', error);
      throw new InternalServerErrorException('Failed to send email via Brevo');
    }
  }
}