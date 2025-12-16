'use server';

import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import TransferEmail from '@/emails/TransferEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendTransferEmailParams {
  to: string;
  studentName: string;
  transferFormUrl?: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

/**
 * Send transfer email using available email service
 * Prioritizes SMTP (Nodemailer) if configured, falls back to Resend
 */
export async function sendTransferEmail({
  to,
  studentName,
  transferFormUrl,
}: SendTransferEmailParams): Promise<EmailResponse> {
  try {
    // Validate email
    if (!to || !to.includes('@')) {
      return {
        success: false,
        message: 'Invalid email address provided',
      };
    }

    // Get the base URL for the transfer form link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URI || 'https://msu-transfer.abroadinst.com';
    const formUrl = transferFormUrl || `${baseUrl}/transfer-form`;

    // Render the email template
    const emailHtml = await render(
      TransferEmail({
        studentName,
        transferFormUrl: formUrl,
      })
    );

    // Check if SMTP is configured (preferred method)
    const hasSmtpConfig = process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD;
    
    if (hasSmtpConfig) {
      // Use Nodemailer with SMTP
      return await sendWithNodemailer({ to, emailHtml });
    } else if (process.env.RESEND_API_KEY) {
      // Fall back to Resend
      return await sendWithResend({ to, emailHtml });
    } else {
      return {
        success: false,
        message: 'No email service configured. Please set SMTP credentials or RESEND_API_KEY.',
      };
    }
  } catch (error: any) {
    console.error('Error sending transfer email:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred while sending the email',
    };
  }
}

/**
 * Send email using Nodemailer with SMTP
 */
async function sendWithNodemailer({
  to,
  emailHtml,
}: {
  to: string;
  emailHtml: string;
}): Promise<EmailResponse> {
  try {
    // Create transporter with SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_EMAIL || process.env.EMAIL,
        pass: process.env.SMTP_PASSWORD || process.env.PASS,
      },
    });

    // Verify connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${process.env.SMTP_USER || process.env.MAIL_USER} <${process.env.SMTP_EMAIL || process.env.EMAIL}>`,
      to,
      subject: 'Complete Your Transfer Form - Midwestern State University',
      html: emailHtml,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL,
    });

    console.log('Email sent via SMTP:', info.messageId);

    return {
      success: true,
      message: 'Email sent successfully via SMTP',
      emailId: info.messageId,
    };
  } catch (error: any) {
    console.error('SMTP Error:', error);
    return {
      success: false,
      message: `SMTP Error: ${error.message}`,
    };
  }
}

/**
 * Send email using Resend API
 */
async function sendWithResend({
  to,
  emailHtml,
}: {
  to: string;
  emailHtml: string;
}): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'MSU Transfer Advising <noreply@abroadinst.com>',
      to: [to],
      subject: 'Complete Your Transfer Form - Midwestern State University',
      html: emailHtml,
      replyTo: process.env.EMAIL_REPLY_TO || 'admissions@abroadaxis.com',
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        message: `Failed to send email: ${error.message}`,
      };
    }

    console.log('Email sent via Resend:', data);

    return {
      success: true,
      message: 'Email sent successfully via Resend',
      emailId: data?.id,
    };
  } catch (error: any) {
    console.error('Resend Error:', error);
    return {
      success: false,
      message: `Resend Error: ${error.message}`,
    };
  }
}
