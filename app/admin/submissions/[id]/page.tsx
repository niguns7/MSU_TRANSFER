'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Title,
  Button,
  Paper,
  Loader,
  Stack,
  Group,
  Text,
  Badge,
  Divider,
  Grid,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IoArrowBack, IoDownloadOutline } from 'react-icons/io5';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Submission {
  id: string;
  createdAt: string;
  formMode: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  address: string | null;
  studyLevel: string | null;
  previousCollege: string | null;
  previousCreditHours: number | null;
  currentCollege: string | null;
  currentCreditHours: number | null;
  intendedCollege: string | null;
  plannedCreditHours: number | null;
  termYear: number | null;
  termSeason: string | null;
  major: string | null;
  switchingMajor: boolean;
  switchMajorDetails: string | null;
  previousGPA: number | null;
  expectedGPA: number | null;
  previousTuition: number | null;
  currentTuition: number | null;
  hasScholarship: boolean;
  scholarshipAmount: number | null;
  payingPerSemester: number | null;
  transferReason: string | null;
  institutionReason: string | null;
  extracurriculars: string | null;
  immigrationStatus: string | null;
  specialCircumstances: string | null;
  referredBy: string | null;
  howDidYouKnow: string | null;
  preferredChannelLink: string | null;
  preferredChannel: string | null;
  consent: boolean;
  countryOfBirth: string | null;
}

export default function SubmissionDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/submissions/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setSubmission(data);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch submission details',
        color: 'red',
      });
      router.push('/admin/submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, params.id]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !submission) return;

    setGenerating(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.save(`application-${submission.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);

      notifications.show({
        title: 'Success',
        message: 'PDF downloaded successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to generate PDF',
        color: 'red',
      });
    } finally {
      setGenerating(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Container size="lg" py={80} ta="center">
        <Loader size="xl" />
      </Container>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header Actions */}
        <Group justify="space-between">
          <Button
            variant="subtle"
            leftSection={<IoArrowBack />}
            onClick={() => router.push('/admin/submissions')}
          >
            Back to Submissions
          </Button>
          <Button
            leftSection={<IoDownloadOutline />}
            onClick={handleDownloadPDF}
            loading={generating}
            styles={{
              root: {
                background: '#840029',
                '&:hover': {
                  background: '#6d0021',
                },
              },
            }}
          >
            Save as PDF
          </Button>
        </Group>

        {/* Application Report */}
        <Paper ref={reportRef} shadow="lg" p="xl" radius="md" style={{ border: '2px solid #f0f0f0' }}>
          {/* Header */}
          <Box mb="xl" style={{ textAlign: 'center', borderBottom: '3px solid #840029', paddingBottom: '20px' }}>
            <Title order={1} style={{ color: '#840029', marginBottom: '10px' }}>
              Transfer Advising Application
            </Title>
            <Text size="lg" c="dimmed">
              Midwestern State University Transfer Program
            </Text>
            <Badge size="lg" color={submission.formMode === 'full' ? 'blue' : 'gray'} mt="sm">
              {submission.formMode.toUpperCase()} APPLICATION
            </Badge>
          </Box>

          {/* Application ID and Date */}
          <Grid mb="xl">
            <Grid.Col span={6}>
              <Text size="sm" c="dimmed">Application ID</Text>
              <Text fw={500}>{submission.id}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" c="dimmed">Submission Date</Text>
              <Text fw={500}>{new Date(submission.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</Text>
            </Grid.Col>
          </Grid>

          <Divider my="xl" />

          {/* Initial Form - Only Basic Information */}
          {submission.formMode === 'initial' && (
            <>
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Application Information
                </Title>
                <Grid>
                  <Grid.Col span={6}>
                    <InfoField label="Full Name" value={submission.fullName} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Phone" value={submission.phone} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Email" value={submission.email} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Study Level" value={submission.studyLevel || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Current College" value={submission.currentCollege || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Intended Major" value={submission.major || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Transfer Time" value={submission.termSeason || 'N/A'} />
                  </Grid.Col>
                </Grid>
              </Box>
            </>
          )}

          {/* Personal Information - For Partial and Full Forms */}
          {(submission.formMode === 'partial' || submission.formMode === 'full') && (
            <>
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Personal Information
                </Title>
                <Grid>
                  <Grid.Col span={6}>
                    <InfoField label="Full Name" value={submission.fullName} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Email" value={submission.email} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Phone" value={submission.phone} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Date of Birth" 
                      value={submission.dateOfBirth ? new Date(submission.dateOfBirth).toLocaleDateString() : 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <InfoField label="Address" value={submission.address || 'N/A'} />
                  </Grid.Col>
                  {submission.countryOfBirth && (
                    <Grid.Col span={6}>
                      <InfoField label="Country of Birth" value={submission.countryOfBirth} />
                    </Grid.Col>
                  )}
                </Grid>
              </Box>

              <Divider my="xl" />
            </>
          )}

          {/* Partial Form Specific Information */}
          {submission.formMode === 'partial' && (
            <>
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Transfer Information
                </Title>
                <Grid>
                  <Grid.Col span={6}>
                    <InfoField label="Study Level" value={submission.studyLevel || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Previous College" value={submission.previousCollege || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Intended Term" value={submission.termSeason || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Major" value={submission.major || 'N/A'} />
                  </Grid.Col>
                </Grid>
              </Box>

              <Divider my="xl" />
            </>
          )}

          {/* Academic Information */}
          {submission.formMode === 'full' && (
            <>
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Academic Background
                </Title>
                <Grid>
                  <Grid.Col span={6}>
                    <InfoField label="Study Level" value={submission.studyLevel || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Previous GPA" 
                      value={submission.previousGPA ? Number(submission.previousGPA).toFixed(2) : 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Previous College" value={submission.previousCollege || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Previous Credit Hours" 
                      value={submission.previousCreditHours ? String(submission.previousCreditHours) : 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Current College" value={submission.currentCollege || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Current Credit Hours" 
                      value={submission.currentCreditHours ? String(submission.currentCreditHours) : 'N/A'} 
                    />
                  </Grid.Col>
                </Grid>
              </Box>

              <Divider my="xl" />

              {/* Transfer Plans */}
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Transfer Plans
                </Title>
                <Grid>
                  <Grid.Col span={6}>
                    <InfoField label="Intended College" value={submission.intendedCollege || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Planned Credit Hours" 
                      value={submission.plannedCreditHours ? String(submission.plannedCreditHours) : 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Term Year" 
                      value={submission.termYear ? String(submission.termYear) : 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Term Season" value={submission.termSeason || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField label="Major" value={submission.major || 'N/A'} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Expected GPA" 
                      value={submission.expectedGPA ? Number(submission.expectedGPA).toFixed(2) : 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <InfoField 
                      label="Switching Major?" 
                      value={submission.switchingMajor ? 'Yes' : 'No'} 
                    />
                  </Grid.Col>
                  {submission.switchingMajor && submission.switchMajorDetails && (
                    <Grid.Col span={12}>
                      <InfoField label="Major Switch Details" value={submission.switchMajorDetails} />
                    </Grid.Col>
                  )}
                </Grid>
              </Box>

              <Divider my="xl" />

              {/* Financial Information */}
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Financial Information
                </Title>
                <Grid>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Previous Tuition" 
                      value={submission.previousTuition ? `$${Number(submission.previousTuition).toLocaleString()}` : 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Current Tuition" 
                      value={submission.currentTuition ? `$${Number(submission.currentTuition).toLocaleString()}` : 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Has Scholarship?" 
                      value={submission.hasScholarship ? 'Yes' : 'No'} 
                    />
                  </Grid.Col>
                  {submission.hasScholarship && (
                    <Grid.Col span={6}>
                      <InfoField 
                        label="Scholarship Amount" 
                        value={submission.scholarshipAmount ? `$${Number(submission.scholarshipAmount).toLocaleString()}` : 'N/A'} 
                      />
                    </Grid.Col>
                  )}
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Paying Per Semester" 
                      value={submission.payingPerSemester ? `$${Number(submission.payingPerSemester).toLocaleString()}` : 'N/A'} 
                    />
                  </Grid.Col>
                </Grid>
              </Box>

              <Divider my="xl" />

              {/* Motivation & Background */}
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Motivation & Background
                </Title>
                <Stack gap="md">
                  <InfoField 
                    label="Transfer Reason" 
                    value={submission.transferReason || 'N/A'} 
                    multiline 
                  />
                  <InfoField 
                    label="Why This Institution?" 
                    value={submission.institutionReason || 'N/A'} 
                    multiline 
                  />
                  <InfoField 
                    label="Extracurricular Activities" 
                    value={submission.extracurriculars || 'N/A'} 
                    multiline 
                  />
                </Stack>
              </Box>

              <Divider my="xl" />

              {/* Immigration & Special Circumstances */}
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Immigration & Special Circumstances
                </Title>
                <Stack gap="md">
                  <InfoField 
                    label="Immigration Status" 
                    value={submission.immigrationStatus || 'N/A'} 
                  />
                  <InfoField 
                    label="Special Circumstances" 
                    value={submission.specialCircumstances || 'N/A'} 
                    multiline 
                  />
                </Stack>
              </Box>

              <Divider my="xl" />
            </>
          )}

          {/* Contact Preferences - Only for Partial and Full Forms */}
          {(submission.formMode === 'partial' || submission.formMode === 'full') && (
            <>
              <Box mb="xl">
                <Title order={3} mb="md" style={{ color: '#840029' }}>
                  Contact Preferences
                </Title>
                <Grid>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Preferred Channel" 
                      value={submission.preferredChannel || 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Channel Link" 
                      value={submission.preferredChannelLink || 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="Referred By" 
                      value={submission.referredBy || 'N/A'} 
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <InfoField 
                      label="How Did You Know?" 
                      value={submission.howDidYouKnow || 'N/A'} 
                    />
                  </Grid.Col>
                </Grid>
              </Box>
            </>
          )}

          {/* Footer */}
          <Box mt="xl" pt="md" style={{ borderTop: '2px solid #f0f0f0', textAlign: 'center' }}>
            <Text size="sm" c="dimmed">
              This application was submitted on {new Date(submission.createdAt).toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Midwestern State University Transfer Advising Program
            </Text>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}

// Helper component for displaying information fields
function InfoField({ 
  label, 
  value, 
  multiline = false 
}: { 
  label: string; 
  value: string | number; 
  multiline?: boolean;
}) {
  return (
    <Box>
      <Text size="sm" c="dimmed" fw={500} mb={4}>
        {label}
      </Text>
      <Text 
        size="md" 
        style={{ 
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
          wordBreak: 'break-word'
        }}
      >
        {value}
      </Text>
    </Box>
  );
}
