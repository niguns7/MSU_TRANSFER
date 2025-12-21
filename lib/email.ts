import nodemailer from 'nodemailer';
import path from 'path';
import logger from './logger';

// Type for nodemailer-express-handlebars
interface HandlebarsMailOptions extends nodemailer.SendMailOptions {
  template?: string;
  context?: Record<string, unknown>;
}

/**
 * Email Configuration
 * Uses environment variables from docker-compose.yml:
 * - MAIL_USER: Display name for sender
 * - EMAIL: Gmail address for SMTP authentication
 * - PASS: Gmail App Password
 */
const EMAIL_CONFIG = {
  mailUser: process.env.MAIL_USER || 'MSU Transfer Advising',
  email: process.env.EMAIL || process.env.SMTP_EMAIL || '',
  pass: process.env.PASS || process.env.SMTP_PASSWORD || '',
  baseUri:
    process.env.BASE_URI ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://midwesternstateuniversity.transfer-advising-form.abroadinst.com',
};

/**
 * Create and configure the Nodemailer transporter with Gmail SMTP
 * Using inline HTML templates for reliability
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_CONFIG.email,
      pass: EMAIL_CONFIG.pass,
    },
  });
};

// Interfaces
export interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, unknown>;
  html?: string;
  text?: string;
}

export interface TransferEmailOptions {
  to: string;
  studentName: string;
  transferFormUrl?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

/**
 * Send an email using Gmail SMTP
 * Supports both Handlebars templates and inline HTML
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  // Validate configuration
  if (!EMAIL_CONFIG.email || !EMAIL_CONFIG.pass) {
    logger.error('Email credentials not configured');
    return {
      success: false,
      message:
        'Email credentials not configured. Set EMAIL and PASS environment variables.',
    };
  }

  // Validate recipient
  if (!options.to || !options.to.includes('@')) {
    return {
      success: false,
      message: 'Invalid email address provided',
    };
  }

  try {
    const transporter = createTransporter();

    const mailOptions: HandlebarsMailOptions = {
      from: `"${EMAIL_CONFIG.mailUser}" <${EMAIL_CONFIG.email}>`,
      to: options.to,
      subject: options.subject,
    };

    // Use template if provided, otherwise use inline HTML
    if (options.template) {
      mailOptions.template = options.template;
      mailOptions.context = options.context;
    } else if (options.html) {
      mailOptions.html = options.html;
    }

    if (options.text) {
      mailOptions.text = options.text;
    }

    const info = await transporter.sendMail(mailOptions);

    logger.info(
      { to: options.to, messageId: info.messageId },
      'Email sent successfully'
    );

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error({ error, to: options.to }, 'Failed to send email');
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send transfer form email to student
 */
export async function sendTransferEmail({
  to,
  studentName,
  transferFormUrl,
}: TransferEmailOptions): Promise<EmailResponse> {
  const formUrl =
    transferFormUrl || `${EMAIL_CONFIG.baseUri}/transfer-advising-full-form`;

  return await sendEmail({
    to,
    subject: 'Complete Your Transfer Form - Midwestern State University',
    html: createTransferEmailHTML(studentName, formUrl),
    text: `Hi ${studentName}, please complete your transfer form at: ${formUrl}`,
  });
}

/**
 * Send admin notification when a new form is submitted
 */
export async function sendAdminNotification(submission: {
  id: string;
  fullName: string;
  email: string | null;
  formMode: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@abroadinst.com';
  const adminUrl = `${EMAIL_CONFIG.baseUri}/admin/submissions/${submission.id}`;

  await sendEmail({
    to: adminEmail,
    subject: `New Transfer Form: ${submission.fullName}`,
    html: createAdminNotificationHTML(submission, adminUrl),
    text: `New ${submission.formMode} form submission from ${submission.fullName} (${submission.email || 'No email'})`,
  });
}

/**
 * Inline HTML template for transfer email
 */
function createTransferEmailHTML(
  studentName: string,
  transferFormUrl: string
): string {
  const logoUrl = `${EMAIL_CONFIG.baseUri}/images/msutexas-logo.png`;
  
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
          <div style="padding-bottom: 20px; text-align: left;">
            <img src="${logoUrl}" width="120" height="48" alt="Midwestern State University" style="display: block;">
          </div>
          <div style="text-align: center; padding: 0;">
            <h1 style="color: #5A1F33; font-size: 24px; font-weight: 600; margin: 10px 0 16px 0;">Hi, ${studentName}</h1>
            <p style="font-size: 15px; color: #333333; margin-bottom: 16px; line-height: 1.5;">
              Thank you for your interest in transferring to Midwestern State University.
            </p>
            <p style="font-size: 15px; color: #8B2635; margin-bottom: 24px; font-weight: 500;">
              To move forward, please complete the detailed transfer form using the link below:
            </p>
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
            <div style="margin: 32px 0; height: 2px; background: linear-gradient(to right, rgba(255,255,255,0), #8a3040, rgba(255,255,255,0));"></div>
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
 * Inline HTML template for admin notification
 */
function createAdminNotificationHTML(
  submission: { id: string; fullName: string; email: string | null; formMode: string },
  adminUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Transfer Advising Form Submission</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f9fc; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #5A1F33; margin-top: 0;">New Transfer Advising Form Submission</h2>
        
        <p style="color: #333; font-size: 15px;">A new <strong>${submission.formMode}</strong> form has been submitted.</p>
        
        <h3 style="color: #5A1F33; border-bottom: 2px solid #FEF3E2; padding-bottom: 8px;">Details:</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">ID:</td>
            <td style="padding: 8px 0; color: #333;">${submission.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Name:</td>
            <td style="padding: 8px 0; color: #333;">${submission.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0; color: #333;">${submission.email || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Form Type:</td>
            <td style="padding: 8px 0; color: #333;">${submission.formMode}</td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="${adminUrl}" style="background-color: #5A1F33; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            View in Admin Panel
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}
