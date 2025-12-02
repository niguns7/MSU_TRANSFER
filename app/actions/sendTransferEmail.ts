'use server';

import { Resend } from 'resend';
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

    // Validate API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return {
        success: false,
        message: 'Email service is not configured. Please contact support.',
      };
    }

    // Get the base URL for the transfer form link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://msu-transfer.com';
    const formUrl = transferFormUrl || `${baseUrl}/transfer-form`;

    // Render the email template
    const emailHtml = await render(
      TransferEmail({
        studentName,
        transferFormUrl: formUrl,
      })
    );

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'MSU Transfer Advising <noreply@msu-transfer.com>',
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

    console.log('Email sent successfully:', data);

    return {
      success: true,
      message: 'Email sent successfully',
      emailId: data?.id,
    };
  } catch (error: any) {
    console.error('Error sending transfer email:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred while sending the email',
    };
  }
}

// Alternative: Send email using Nodemailer (if preferred over Resend)
export async function sendTransferEmailWithNodemailer({
  to,
  studentName,
  transferFormUrl,
}: SendTransferEmailParams): Promise<EmailResponse> {
  try {
    const nodemailer = require('nodemailer');

    // Validate email
    if (!to || !to.includes('@')) {
      return {
        success: false,
        message: 'Invalid email address provided',
      };
    }

    // Get the base URL for the transfer form link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://msu-transfer.com';
    const formUrl = transferFormUrl || `${baseUrl}/transfer-form`;

    // Render the email template
    const emailHtml = await render(
      TransferEmail({
        studentName,
        transferFormUrl: formUrl,
      })
    );

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'MSU Transfer Advising <noreply@msu-transfer.com>',
      to,
      subject: 'Complete Your Transfer Form - Midwestern State University',
      html: emailHtml,
      replyTo: process.env.EMAIL_REPLY_TO || 'admissions@abroadaxis.com',
    });

    console.log('Email sent successfully:', info.messageId);

    return {
      success: true,
      message: 'Email sent successfully',
      emailId: info.messageId,
    };
  } catch (error: any) {
    console.error('Error sending transfer email with Nodemailer:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred while sending the email',
    };
  }
}
