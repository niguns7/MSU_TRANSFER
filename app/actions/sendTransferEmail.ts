'use server';

import { sendTransferEmail as sendTransferEmailService } from '@/lib/email';

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
 * Server action to send transfer email
 * This is a thin wrapper around the optimized email service
 */
export async function sendTransferEmail({
  to,
  studentName,
  transferFormUrl,
}: SendTransferEmailParams): Promise<EmailResponse> {
  try {
    return await sendTransferEmailService({
      to,
      studentName,
      transferFormUrl,
    });
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
