import nodemailer from 'nodemailer';
import { logger } from '@tools-website/utils';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  static async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@multi-tools.com',
      to: email,
      subject: 'Verify your email address - MultiTools',
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
        <p>If you did not sign up for an account, please ignore this email.</p>
      `,
    };

    try {
      if (process.env.NODE_ENV === 'development' && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
        logger.info(`[Email Service Mock] Verification Token for ${email}: ${token}`);
        logger.info(`[Email Service Mock] Link: ${verificationUrl}`);
        return;
      }
      await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email successfully sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send verification email', error);
    }
  }

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@multi-tools.com',
      to: email,
      subject: 'Reset your password - MultiTools',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Please click the link below to set a new password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>If you did not request this, please ignore this email. This link will expire shortly.</p>
      `,
    };

    try {
      if (process.env.NODE_ENV === 'development' && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
        logger.info(`[Email Service Mock] Password Reset Token for ${email}: ${token}`);
        logger.info(`[Email Service Mock] Link: ${resetUrl}`);
        return;
      }
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email successfully sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send password reset email', error);
    }
  }
}
