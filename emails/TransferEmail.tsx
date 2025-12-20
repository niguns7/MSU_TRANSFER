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
import Image from "next/image";
import * as React from 'react';

interface TransferEmailProps {
  studentName?: string;
  transferFormUrl?: string;
}

export const TransferEmail = ({
  studentName = 'Student',
  transferFormUrl = 'https://midwesternstateuniversity.transfer-advising-application.abroadinst.com/transfer-advising-full-form',
}: TransferEmailProps) => {

  return (
    <Html>
      <Head />
      <Preview>Complete Your Transfer Form - Midwestern State University</Preview>

      <Body style={main}>
        <Container style={outerWrapper}>
          {/* Cream Card - Centered at 50% width */}
          <Container style={card}>

            {/* Logo */}
            <Section style={logoSection}>
              <Img
                src="/images/msutexas-logo.png"
                width="120"
                height="48"
                alt="Midwestern State University"
                style={logo}
              />
            </Section>

            {/* Main Content */}
            <Section style={contentSection}>
              <Heading style={heading}>Hi, {studentName}</Heading>

              <Text style={paragraph}>
                Thank you for your interest in transferring to Midwestern State University.
              </Text>

              <Text style={highlightText}>
                To move forward, please complete the detailed transfer form using the link below:
              </Text>

              {/* Button */}
              <Section style={buttonContainer}>
                <Button style={button} href={transferFormUrl}>
                  Complete Full Transfer Form
                </Button>
              </Section>

              {/* Book Session Button */}
              <Section style={buttonContainer}>
                <Button style={secondaryButton} href="https://calendly.com/admissions-abroadinst/30min">
                  Book a Counseling Session
                </Button>
              </Section>

              {/* Horizontal Rule below buttons */}
              <Section style={hrSection}>
                <div style={fancyHr}></div>
              </Section>

              {/* Info Box */}
              <Section style={infoBox}>
                <Text style={infoText}>
                  This form helps us review your credits, major, and eligibility so we can guide you properly.
                </Text>
              </Section>

              <Text style={supportText}>
                If you need help at any point, just reply to this email. We&apos;re here to support you.
              </Text>

              <Text style={thankYouText}>Thank you.</Text>
              <Text style={teamSignature}>
                <strong>Transfer Advising Team</strong>
              </Text>
            </Section>
          </Container>
        </Container>
      </Body>
    </Html>
  );
};

export default TransferEmail;

// =========================
// Styles
// =========================
const main = {
  backgroundColor: '#FFFFFF',
  padding: '40px 20px',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
};

const outerWrapper = {
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const card = {
  backgroundColor: '#FEF3E2',
  borderRadius: '8px',
  padding: '30px 40px 40px',
  overflow: 'hidden',
  width: '94%',
  maxWidth: '800px',
  margin: '0 auto',
  boxSizing: 'border-box' as const,
};

const logoSection = {
  paddingBottom: '20px',
  textAlign: 'left' as const,
};

const logo = {
  display: 'block',
};

const contentSection = {
  textAlign: 'center' as const,
  padding: '0',
};

const heading = {
  color: '#5A1F33',
  fontSize: '24px',
  fontWeight: '600',
  marginTop: '10px',
  marginBottom: '16px',
  textAlign: 'center' as const,
};

const paragraph = {
  fontSize: '15px',
  color: '#333333',
  marginBottom: '16px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};

const highlightText = {
  fontSize: '15px',
  color: '#8B2635',
  marginBottom: '24px',
  fontWeight: '500',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#FCB116',
  borderRadius: '24px',
  fontSize: '15px',
  padding: '12px 30px',
  color: '#fff',
  fontWeight: '700',
  textDecoration: 'none',
  display: 'inline-block',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '2px solid #8B2635',
  borderRadius: '24px',
  fontSize: '15px',
  padding: '10px 30px',
  color: '#8B2635',
  fontWeight: '700',
  textDecoration: 'none',
  display: 'inline-block',
  marginTop: '12px',
};

const hrSection = {
  margin: '24px 0',
  textAlign: 'center' as const,
};

const hr = {
  border: 'none',
  borderTop: '1px solid #D4A574',
  height: '1px',
  margin: '0 auto',
  width: '100%',
};
const fancyHr = {
  border: 0,
  height: '2px',
  width: '100%',
  margin: '32px 0',
  background:
    'linear-gradient(to right, rgba(255,255,255,0), #8a3040, rgba(255,255,255,0))',
};


const infoBox = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #E5E5E5',
};

const infoText = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '1.6',
  margin: 0,
  textAlign: 'center' as const,
};

const supportText = {
  fontSize: '14px',
  color: '#333333',
  marginTop: '24px',
  marginBottom: '12px',
  textAlign: 'center' as const,
};

const thankYouText = {
  fontSize: '14px',
  color: '#333333',
  marginBottom: '8px',
  textAlign: 'center' as const,
};

const teamSignature = {
  fontSize: '15px',
  color: '#5A1F33',
  fontWeight: '700',
  textAlign: 'center' as const,
};
