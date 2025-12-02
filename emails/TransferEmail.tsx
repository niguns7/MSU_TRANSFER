import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface TransferEmailProps {
  studentName?: string;
  transferFormUrl?: string;
}

export const TransferEmail = ({
  studentName = 'Student',
  transferFormUrl = 'https://msu-transfer.com/transfer-form',
}: TransferEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Complete Your Transfer Form - Midwestern State University</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* MSU Logo */}
          <Section style={logoSection}>
            <Img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Midwestern_State_University_seal.svg/1200px-Midwestern_State_University_seal.svg.png"
              width="150"
              height="60"
              alt="Midwestern State University"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            {/* Greeting */}
            <Heading style={heading}>Hi, {studentName}</Heading>

            {/* Thank you paragraph */}
            <Text style={paragraph}>
              Thank you for your interest in transferring to Midwestern State University.
            </Text>

            {/* Highlighted instruction */}
            <Text style={instructionText}>
              To move forward, please complete the detailed transfer form using the link below:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={transferFormUrl}>
                Complete Full Transfer Form
              </Button>
            </Section>

            {/* Info Box */}
            <Section style={infoBox}>
              <Text style={infoText}>
                This form helps us review your credits, major, and eligibility so we can guide you properly.
              </Text>
            </Section>

            {/* Support message */}
            <Text style={supportText}>
              If you need help at any point, just reply to this email. We&apos;re here to support you.
            </Text>

            {/* Thank you */}
            <Text style={thankYouText}>Thank you.</Text>

            {/* Team signature */}
            <Text style={teamSignature}>
              <strong>Transfer Advising Team</strong>
            </Text>
          </Section>

          {/* Footer (optional) */}
          <Section style={footer}>
            <Text style={footerText}>
              Midwestern State University
              <br />
              3410 Taft Blvd, Wichita Falls, TX 76308
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TransferEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '20px 40px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const contentSection = {
  padding: '20px 40px 40px',
  backgroundColor: '#FEF3E2',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.4',
  fontWeight: '600',
  color: '#5A1F33',
  marginBottom: '16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333333',
  marginBottom: '16px',
};

const instructionText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#8B2635',
  marginBottom: '24px',
  fontWeight: '500',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#FCB116',
  borderRadius: '8px',
  color: '#5A1F33',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  cursor: 'pointer',
};

const infoBox = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '24px',
  marginBottom: '24px',
  border: '1px solid #E5E5E5',
};

const infoText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#666666',
  margin: '0',
  textAlign: 'center' as const,
};

const supportText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#333333',
  marginTop: '24px',
  marginBottom: '16px',
};

const thankYouText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#333333',
  marginBottom: '8px',
};

const teamSignature = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#5A1F33',
  fontWeight: '700',
  marginTop: '4px',
};

const footer = {
  padding: '20px 40px',
  textAlign: 'center' as const,
  borderTop: '1px solid #E5E5E5',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#999999',
  margin: '0',
};
