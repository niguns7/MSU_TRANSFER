'use server';

import { Resend } from 'resend';
import nodemailer from 'nodemailer';

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

// Simple HTML email template
function createTransferEmailHtml(studentName: string, transferFormUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your Transfer Form - Midwestern State University</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #FFFFFF; padding: 40px 20px; margin: 0;">
        <div style="max-width: 800px; margin: 0 auto; background-color: #FEF3E2; border-radius: 8px; padding: 30px 40px 40px; overflow: hidden;">
          <!-- Logo -->
          <div style="padding-bottom: 20px; text-align: left;">
            <img src="https://midwesternstateuniversity.transfer-advising-form.abroadinst.com/images/msutexas-logo.png" width="120" height="48" alt="Midwestern State University" style="display: block;">
          </div>
          
          <!-- Main Content -->
          <div style="text-align: center; padding: 0;">
            <h1 style="color: #5A1F33; font-size: 24px; font-weight: 600; margin: 10px 0 16px 0;">Hi, ${studentName}</h1>
            
            <p style="font-size: 15px; color: #333333; margin-bottom: 16px; line-height: 1.5;">
              Thank you for your interest in transferring to Midwestern State University.
            </p>
            
            <p style="font-size: 15px; color: #8B2635; margin-bottom: 24px; font-weight: 500;">
              To move forward, please complete the detailed transfer form using the link below:
            </p>
            
            <!-- Buttons -->
            <div style="text-align: center; margin-bottom: 12px;">
              <a href="${transferFormUrl}" style="background-color: #FCB116; border-radius: 24px; font-size: 15px; padding: 12px 30px; color: #fff; font-weight: 700; text-decoration: none; display: inline-block;">
                Complete Full Transfer Form
              </a>
            </div>
            
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://calendly.com/admissions-abroadinst/30min" style="background-color: transparent; border: 2px solid #8B2635; border-radius: 24px; font-size: 15px; padding: 10px 30px; color: #8B2635; font-weight: 700; text-decoration: none; display: inline-block;">
                Book a Counseling Session
              </a>
            </div>
            
            <!-- Horizontal Rule -->
            <div style="margin: 32px 0; height: 2px; background: linear-gradient(to right, rgba(255,255,255,0), #8a3040, rgba(255,255,255,0));"></div>
            
            <!-- Info Box -->
            <div style="background-color: #FFFFFF; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #E5E5E5;">
              <p style="font-size: 14px; color: #666666; line-height: 1.6; margin: 0;">
                This form helps us review your credits, major, and eligibility so we can guide you properly.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #333333; margin: 24px 0 12px 0;">
              If you need help at any point, just reply to this email. We're here to support you.
            </p>
            
            <p style="font-size: 14px; color: #333333; margin-bottom: 8px;">Thank you.</p>
            <p style="font-size: 15px; color: #5A1F33; font-weight: 700; margin: 0;">
              <strong>Transfer Advising Team</strong>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
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

    // Create the email HTML
    const emailHtml = createTransferEmailHtml(studentName, formUrl);

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
