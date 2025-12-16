import nodemailer from 'nodemailer';
import logger from './logger';

const SMTP_ENABLED = process.env.SMTP_ENABLED === 'true';

const transporter = SMTP_ENABLED
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SMTP_ENABLED || !transporter) {
    logger.info('SMTP disabled, skipping email send');
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@example.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logger.info({ to: options.to, subject: options.subject }, 'Email sent successfully');
    return true;
  } catch (error) {
    logger.error({ error, to: options.to }, 'Failed to send email');
    return false;
  }
}

export async function sendAdminNotification(submission: {
  id: string;
  fullName: string;
  email: string | null;
  formMode: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@example.com';

  const html = `
    <h2>New Transfer Advising Form Submission</h2>
    <p>A new ${submission.formMode} form has been submitted.</p>
    <h3>Details:</h3>
    <ul>
      <li><strong>ID:</strong> ${submission.id}</li>
      <li><strong>Name:</strong> ${submission.fullName}</li>
      <li><strong>Email:</strong> ${submission.email || 'Not provided'}</li>
      <li><strong>Form Type:</strong> ${submission.formMode}</li>
    </ul>
      <li><strong>Submission ID:</strong> ${submission.id}</li>
      <li><strong>Name:</strong> ${submission.fullName}</li>
      <li><strong>Email:</strong> ${submission.email}</li>
      <li><strong>Form Mode:</strong> ${submission.formMode}</li>
    </ul>
    <p>
      <a href="${process.env.APP_URL}/admin/submissions">View in Admin Panel</a>
    </p>
  `;

  await sendEmail({
    to: adminEmail,
    subject: 'New Transfer Advising Form Submission',
    html,
    text: `New ${submission.formMode} form submission from ${submission.fullName} (${submission.email})`,
  });
}
