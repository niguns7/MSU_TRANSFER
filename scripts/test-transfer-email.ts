#!/usr/bin/env tsx

/**
 * Test script for Transfer Email
 * Usage: npx tsx scripts/test-transfer-email.ts
 */

import { sendTransferEmail } from '../app/actions/sendTransferEmail';

async function main() {
  console.log('🧪 Testing Transfer Email...\n');

  // Get email from command line or use default
  const testEmail = process.argv[2] || 'test@example.com';
  const testName = process.argv[3] || 'Test Student';

  console.log(`📧 Sending to: ${testEmail}`);
  console.log(`👤 Student Name: ${testName}\n`);

  try {
    const result = await sendTransferEmail({
      to: testEmail,
      studentName: testName,
      transferFormUrl: 'https://msu-transfer.com/transfer-form',
    });

    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`📬 Email ID: ${result.emailId}`);
      console.log(`💬 Message: ${result.message}`);
    } else {
      console.error('❌ Failed to send email');
      console.error(`💬 Error: ${result.message}`);
    }
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
  }
}

main();
