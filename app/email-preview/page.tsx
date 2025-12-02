/**
 * Preview page for email templates
 * Visit: http://localhost:3000/email-preview
 * 
 * This page allows you to preview email templates in the browser
 * before sending them to actual recipients.
 */

import TransferEmail from '@/emails/TransferEmail';

export default function EmailPreviewPage() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f6f9fc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            Transfer Email Preview
          </h1>
          <p style={{ margin: '0', color: '#666' }}>
            This is how the email will appear to students.
          </p>
        </div>

        {/* Email Template Preview */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <TransferEmail
            studentName="John Doe"
            transferFormUrl="https://msu-transfer.com/transfer-form"
          />
        </div>

        {/* Usage Instructions */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          marginTop: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: '0', fontSize: '18px' }}>
            Testing Instructions
          </h2>
          <ol style={{ lineHeight: '1.8', color: '#333' }}>
            <li>Configure your <code>RESEND_API_KEY</code> in <code>.env.local</code></li>
            <li>Run the test script: <code>npx tsx scripts/test-transfer-email.ts your-email@example.com</code></li>
            <li>Check your inbox for the test email</li>
            <li>Customize the template in <code>/emails/TransferEmail.tsx</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
