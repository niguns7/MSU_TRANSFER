# Email Service Configuration Guide

## Overview

Your email service has been optimized with a unified, robust implementation that supports multiple email providers with intelligent fallback mechanisms.

## Features

- ✅ **React Email Template Integration**: Uses the optimized TransferEmail component
- ✅ **Multi-Provider Support**: SMTP (Nodemailer) and Resend API
- ✅ **Intelligent Fallback**: Automatically tries SMTP first, then Resend
- ✅ **Comprehensive Error Handling**: Detailed error messages and logging
- ✅ **Environment Flexibility**: Works in development and production
- ✅ **Type Safety**: Full TypeScript support with proper interfaces

## Configuration

### SMTP Configuration (Recommended)

Set these environment variables for SMTP support:

```bash
# Enable SMTP
SMTP_ENABLED=true

# SMTP Server Settings
SMTP_HOST=smtp.gmail.com  # or your SMTP host
SMTP_PORT=587
SMTP_SECURE=false  # true for 465, false for other ports

# Authentication
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password for Gmail
SMTP_EMAIL=your-email@gmail.com  # Alternative variable name

# Email Settings
EMAIL_FROM=MSU Transfer Advising <noreply@abroadinst.com>
EMAIL_REPLY_TO=admissions@abroadaxis.com
```

### Resend API Configuration (Fallback)

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Application URLs

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
BASE_URI=https://your-domain.com  # Alternative
APP_URL=https://your-domain.com  # For admin links
```

## Email Service Priority

1. **SMTP** (if `SMTP_ENABLED=true` and credentials are provided)
2. **Resend** (if SMTP fails or isn't configured and `RESEND_API_KEY` is set)
3. **Error** (if no service is configured)

## Usage

### In Server Actions

```typescript
import { sendTransferEmail } from '@/lib/email';

const result = await sendTransferEmail({
  to: 'student@example.com',
  studentName: 'John Doe',
  transferFormUrl: 'https://your-site.com/form'  // Optional
});

if (result.success) {
  console.log(`Email sent via ${result.provider}: ${result.emailId}`);
} else {
  console.error(`Email failed: ${result.message}`);
}
```

### For Custom Emails

```typescript
import { sendEmail } from '@/lib/email';

const result = await sendEmail({
  to: 'recipient@example.com',
  subject: 'Your Subject',
  html: '<h1>Your HTML content</h1>',
  text: 'Your plain text content'  // Optional
});
```

## Testing

### Test Transfer Email

```bash
# Test with default values
npx tsx scripts/test-optimized-email.ts

# Test with specific email and name
npx tsx scripts/test-optimized-email.ts john@example.com "John Doe"
```

### Test Legacy SMTP (if needed)

```bash
npx tsx scripts/test-email-smtp.ts test@example.com "Test User"
```

## Email Template

The service uses the React Email template at `emails/TransferEmail.tsx` which provides:

- 📱 **Mobile Responsive**: Works on all devices
- 🎨 **Brand Consistent**: Uses MSU colors and styling
- 🔗 **Action Buttons**: Clear call-to-action buttons
- 📧 **Email Client Compatible**: Works across all major email clients

## Error Handling

The service provides detailed error responses:

```typescript
interface EmailResponse {
  success: boolean;
  message: string;
  emailId?: string;  // Email ID from the provider
  provider?: 'smtp' | 'resend';  // Which provider was used
}
```

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SMTP_ENABLED` | Enable SMTP service | No | `false` |
| `SMTP_HOST` | SMTP server hostname | If SMTP enabled | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | No | `587` |
| `SMTP_SECURE` | Use secure connection | No | `false` |
| `SMTP_USER` | SMTP username | If SMTP enabled | - |
| `SMTP_PASS` | SMTP password | If SMTP enabled | - |
| `RESEND_API_KEY` | Resend API key | For Resend | - |
| `EMAIL_FROM` | From email address | No | `MSU Transfer Advising <noreply@abroadinst.com>` |
| `EMAIL_REPLY_TO` | Reply-to address | No | `admissions@abroadaxis.com` |

## Migration from Old System

The new system is backward compatible:

1. ✅ All existing server actions continue to work
2. ✅ Environment variables are preserved
3. ✅ Admin notifications still function
4. ✅ Email templates are enhanced, not replaced

## Troubleshooting

### Common Issues

1. **Gmail SMTP**: Use App Passwords, not your regular password
2. **Port 587 vs 465**: Use 587 with `SMTP_SECURE=false`, or 465 with `SMTP_SECURE=true`
3. **Resend Domain**: Ensure your domain is verified in Resend
4. **Environment Variables**: Check that all required variables are set correctly

### Debug Logging

The service uses the built-in logger for debugging. Check your logs for detailed error information.

## Support

If you encounter issues:

1. Check environment variable configuration
2. Test with the provided test scripts
3. Review logs for detailed error messages
4. Verify SMTP/Resend account settings