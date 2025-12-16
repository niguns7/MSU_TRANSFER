#!/usr/bin/env tsx

/**
 * Test script for Email with SMTP Configuration
 * Usage: npx tsx scripts/test-email-smtp.ts <email> <name>
 * Example: npx tsx scripts/test-email-smtp.ts test@example.com "Test Student"
 */

import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import TransferEmail from '../emails/TransferEmail';

async function testEmailSMTP() {
  console.log('🧪 Testing Email with SMTP (Abroad Institute Configuration)...\n');

  const testEmail = process.argv[2] || 'test@example.com';
  const testName = process.argv[3] || 'Test Student';

  console.log(`📧 Sending to: ${testEmail}`);
  console.log(`👤 Student Name: ${testName}`);
  console.log(`🔧 SMTP Host: smtp.gmail.com`);
  console.log(`📬 From: admissions@abroadinst.com\n`);

  try {
    // Create transporter with Abroad Institute SMTP config
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'admissions@abroadinst.com',
        pass: 'qogmtpqdeibwgkyu', // App password from your config
      },
    });

    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Render email template
    console.log('📝 Rendering email template...');
    const emailHtml = await render(
      TransferEmail({
        studentName: testName,
        transferFormUrl: 'https://msu-transfer.abroadinst.com/transfer-form',
      })
    );
    console.log('✅ Email template rendered\n');

    // Send email
    console.log('📤 Sending email...');
    const info = await transporter.sendMail({
      from: 'MSU Transfer Advising <admissions@abroadinst.com>',
      to: testEmail,
      subject: 'Complete Your Transfer Form - Midwestern State University',
      html: emailHtml,
      replyTo: 'admissions@abroadaxis.com',
    });

    console.log('\n✅ Email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📊 Response: ${info.response}`);
    console.log(`\n💡 Check the inbox of ${testEmail}`);
  } catch (error: any) {
    console.error('\n❌ Error sending email:');
    console.error(`   ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed. Please check:');
      console.error('   - Email address is correct');
      console.error('   - App password is correct');
      console.error('   - 2-Step Verification is enabled in Gmail');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Please check:');
      console.error('   - SMTP host and port are correct');
      console.error('   - Firewall allows SMTP connections');
      console.error('   - Internet connection is stable');
    }
    
    console.error('\n📖 For more help, see EMAIL_CONFIGURATION_GUIDE.md');
  }
}

testEmailSMTP();
