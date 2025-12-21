# Email Integration Documentation

This document provides a comprehensive guide on how email sending is integrated in this project using **Nodemailer** with Gmail SMTP and **Handlebars** templates.

---

## Table of Contents

1. [Overview](#overview)
2. [Required Packages](#required-packages)
3. [Environment Variables](#environment-variables)
4. [Configuration Files](#configuration-files)
5. [Email Templates](#email-templates)
6. [Usage Examples](#usage-examples)
7. [Gmail App Password Setup](#gmail-app-password-setup)
8. [Docker Configuration](#docker-configuration)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The email system uses:
- **Nodemailer** - Node.js module for sending emails
- **nodemailer-express-handlebars** - Handlebars templating engine integration
- **Gmail SMTP** - Production email service
- **Ethereal Email** - Development/testing email service (optional)

### Architecture Flow

```
Controller → sendEmail() → TRANSPORTER() → Gmail SMTP → Recipient
                ↓
         Handlebars Template
```

---

## Required Packages

Install the following npm packages:

```bash
npm install nodemailer nodemailer-express-handlebars
```

### Package Versions (Recommended)

```json
{
  "nodemailer": "^6.9.1",
  "nodemailer-express-handlebars": "^6.1.0"
}
```

---

## Environment Variables

Add these variables to your `.env` file:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` or `development` |
| `EMAIL` | Yes | Gmail address for SMTP authentication | `admissions@yourdomain.com` |
| `PASS` | Yes | Gmail App Password (NOT regular password) | `fzpr xgmr gzph bpct` |
| `MAIL_USER` | Yes | Display name for email sender | `Your App Name` |
| `BASE_URI` | No | Base URL for attachments/assets | `https://yourdomain.com` |

### Example .env Configuration

```env
NODE_ENV=production
MAIL_USER=Your Application Name
EMAIL=your-email@gmail.com
PASS=xxxx xxxx xxxx xxxx
BASE_URI=https://yourdomain.com
```

---

## Configuration Files

### 1. Nodemailer Transporter (`src/utils/nodemailer.js`)

This file creates and configures the email transporter:

```javascript
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const TRANSPORTER = () => {
  let transporter;
  const environment = process.env.NODE_ENV || 'production';
  
  if (environment === "development") {
    // Use Ethereal for development (fake SMTP for testing)
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
  } else {
    // Use Gmail for production
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
  }

  // Configure Handlebars templates
  const handlebarsOptions = {
    viewEngine: {
      partialDir: path.resolve("src/email"),
      defaultLayout: false,
    },
    viewPath: path.resolve("src/email"),
  };

  transporter.use("compile", hbs(handlebarsOptions));
  
  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error(`❌ Email transporter verification failed: ${error.message}`);
    } else {
      console.log(`✅ Email transporter is ready to send emails`);
    }
  });

  return transporter;
};

module.exports = { TRANSPORTER };
```

### 2. Mailer Utility (`src/utils/mailer.js`)

This file provides the `sendEmail` helper function:

```javascript
const { TRANSPORTER } = require("./nodemailer");

/**
 * Send an email using templates
 * @param {string|Array} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} template - Handlebars template name (without extension)
 * @param {Object} context - Variables to pass to template
 * @param {boolean} attach - Whether to include attachments
 * @returns {Promise<Object>} - Result with success status
 */
const sendEmail = async ({ to, subject, template, context, attach }) => {
  try {
    let transporter = TRANSPORTER();
    
    const mailOptions = {
      from: `"${process.env.MAIL_USER}" <${process.env.EMAIL}>`,
      to,
      subject,
      template,  // template name (e.g., "welcome" for welcome.handlebars)
      context,   // variables for the template
      attachments: attach
        ? [
          {
            filename: "logo.png",
            path: `${process.env.BASE_URI}/files/logo.png`,
            cid: "logo",  // Content-ID for inline images
          },
        ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
};

module.exports = { sendEmail };
```

---

## Email Templates

### Directory Structure

```
src/
└── email/
    ├── welcome.handlebars
    ├── reset-password.handlebars
    ├── notification.handlebars
    ├── general.handlebars
    └── ... (other templates)
```

### Template Syntax

Handlebars templates use `{{variable}}` syntax for dynamic content.

#### Example: Basic Template (`general.handlebars`)

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #4A90A4;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #f9f9f9;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="cid:logo" alt="Logo" style="max-width: 150px;">
    <h1>{{title}}</h1>
  </div>
  
  <div class="content">
    <p>Hello {{name}},</p>
    <p>{{message}}</p>
    
    {{#if link}}
    <p>
      <a href="{{link}}" style="background-color: #4A90A4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        {{linkText}}
      </a>
    </p>
    {{/if}}
  </div>
  
  <div class="footer">
    <p>&copy; {{year}} Your Company Name. All rights reserved.</p>
  </div>
</body>
</html>
```

#### Example: Welcome Email Template (`welcome.handlebars`)

```handlebars
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #4A90A4;">Welcome to Our Platform!</h1>
  
  <p>Hello {{name}},</p>
  
  <p>Thank you for joining us. Your account has been successfully created.</p>
  
  <p><strong>Your login details:</strong></p>
  <ul>
    <li>Email: {{email}}</li>
    <li>Password: {{password}}</li>
  </ul>
  
  <p>
    <a href="{{loginLink}}" style="background-color: #4A90A4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
      Login to Your Account
    </a>
  </p>
  
  <p>If you have any questions, feel free to contact our support team.</p>
  
  <p>Best regards,<br>The Team</p>
</body>
</html>
```

---

## Usage Examples

### Basic Email Sending

```javascript
const { sendEmail } = require("../utils/mailer");

// Send a welcome email
const sendWelcomeEmail = async (user) => {
  const result = await sendEmail({
    to: user.email,
    subject: "Welcome to Our Platform!",
    template: "welcome",
    context: {
      name: user.name,
      email: user.email,
      password: user.tempPassword,
      loginLink: "https://yourapp.com/login",
    },
    attach: true,
  });

  return result;
};
```

### Sending to Multiple Recipients

```javascript
const { sendEmail } = require("../utils/mailer");

const sendBulkNotification = async (emails, message) => {
  const result = await sendEmail({
    to: emails.join(", "),  // "user1@email.com, user2@email.com"
    subject: "Important Notification",
    template: "notification",
    context: {
      message: message,
      date: new Date().toLocaleDateString(),
    },
    attach: false,
  });

  return result;
};
```

### Using Transporter Directly

```javascript
const { TRANSPORTER } = require("../utils/nodemailer");

const sendDirectEmail = async () => {
  const transporter = TRANSPORTER();
  
  const info = await transporter.sendMail({
    from: `"${process.env.MAIL_USER}" <${process.env.EMAIL}>`,
    to: "recipient@example.com",
    subject: "Test Email",
    template: "general",
    context: {
      title: "Hello",
      name: "User",
      message: "This is a test email",
      year: new Date().getFullYear(),
    },
  });

  console.log("Message sent:", info.messageId);
  return info;
};
```

### Controller Example

```javascript
// src/controllers/mailer.controller.js
const { sendEmail } = require("../utils/mailer");

const sendNotificationEmail = async (req, res) => {
  try {
    const { to, subject, template, data } = req.body;

    const result = await sendEmail({
      to,
      subject,
      template,
      context: data,
      attach: true,
    });

    if (result.success) {
      return res.status(200).json({
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return res.status(500).json({
        message: "Failed to send email",
        error: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { sendNotificationEmail };
```

---

## Gmail App Password Setup

Since this integration uses Gmail SMTP, you need to generate an **App Password** instead of using your regular Gmail password.

### Steps to Generate App Password

1. **Enable 2-Step Verification**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "2-Step Verification"
   - Follow the prompts to enable it

2. **Generate App Password**
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter a name (e.g., "My Node.js App")
   - Click "Generate"

3. **Copy the Password**
   - Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
   - Use this as the `PASS` environment variable

### Important Notes

- App passwords only work with 2-Step Verification enabled
- Store the password securely - you won't be able to see it again
- You can revoke app passwords anytime from Google Account settings
- Each app should have its own app password for security

---

## Docker Configuration

### docker-compose.yml Example

```yaml
version: '3.8'

services:
  your-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MAIL_USER=Your Application Name
      - EMAIL=your-email@gmail.com
      - PASS=xxxx xxxx xxxx xxxx
      - BASE_URI=https://yourdomain.com
    volumes:
      - ./src/email:/app/src/email  # Mount email templates
```

### Environment File with Docker

```yaml
services:
  your-app:
    env_file:
      - .env
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Failed

**Error:** `Invalid login: 535-5.7.8 Username and Password not accepted`

**Solution:**
- Ensure you're using an App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Check that the email and password are correct in `.env`

#### 2. Template Not Found

**Error:** `ENOENT: no such file or directory, open '.../src/email/template.handlebars'`

**Solution:**
- Verify the template file exists in `src/email/` directory
- Check the template name matches exactly (case-sensitive)
- Ensure the file has `.handlebars` extension

#### 3. Connection Timeout

**Error:** `Connection timeout` or `ETIMEDOUT`

**Solution:**
- Check your network connection
- Verify firewall isn't blocking SMTP ports
- Try using port 587 instead of 465

#### 4. Less Secure App Access

**Note:** Google no longer supports "Less Secure Apps." You must use App Passwords.

### Debug Mode

Enable debug logging for Nodemailer:

```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  debug: true,  // Enable debug output
  logger: true, // Log to console
});
```

### Testing Emails in Development

For development, use [Ethereal Email](https://ethereal.email/) - a fake SMTP service:

```javascript
// Create test account
const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

// After sending, get preview URL
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
```

---

## Quick Start Checklist

- [ ] Install required packages (`nodemailer`, `nodemailer-express-handlebars`)
- [ ] Set up environment variables in `.env`
- [ ] Create `src/utils/nodemailer.js` with transporter configuration
- [ ] Create `src/utils/mailer.js` with `sendEmail` function
- [ ] Create `src/email/` directory for templates
- [ ] Add Handlebars templates (`.handlebars` files)
- [ ] Generate Gmail App Password
- [ ] Test email sending

---

## File Reference

| File Path | Description |
|-----------|-------------|
| `src/utils/nodemailer.js` | Nodemailer transporter configuration |
| `src/utils/mailer.js` | `sendEmail` helper function |
| `src/email/` | Directory containing Handlebars templates |
| `src/controllers/mailer.controller.js` | Email-related API controllers |

---

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Handlebars Documentation](https://handlebarsjs.com/)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Google App Passwords](https://support.google.com/accounts/answer/185833)

---

*Last updated: December 2025*
