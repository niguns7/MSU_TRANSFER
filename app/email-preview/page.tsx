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
        <h1 style={{ marginBottom: '20px', color: '#333' }}>Email Template Preview</h1>
        
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
      </div>
    </div>
  );
}
