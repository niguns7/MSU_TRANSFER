'use client';

import { useRouter } from 'next/navigation';
import { Container, Paper, Stepper, Button, Group, Title, Text, Box, Progress, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { CombinedStep1PersonalAddress } from './steps/CombinedStep1PersonalAddress';
import { CombinedStep2StudyLevelCurrent } from './steps/CombinedStep2StudyLevelCurrent';
import { CombinedStep3MajorAcademics } from './steps/CombinedStep3MajorAcademics';
import { CombinedStep4TransferMotivation } from './steps/CombinedStep4TransferMotivation';
import { CombinedStep5ImmigrationContact } from './steps/CombinedStep5ImmigrationContact';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface FullFormWizardProps {
  onBack?: () => void;
}

export function FullFormWizard({ onBack }: FullFormWizardProps) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      formMode: 'full' as const,
      fullName: '',
      // email: '',
      phone: '',
      dateOfBirth: null,
      address: '',
      studyLevel: 'Undergraduate' as const,
      previousCollege: '',
      previousCreditHours: null,
      currentCollege: '',
      currentCreditHours: 0,
      intendedCollege: '',
      plannedCreditHours: 0,
      termYear: new Date().getFullYear() + 1,
      termSeason: 'Fall' as const,
      major: '',
      switchingMajor: false,
      switchMajorDetails: '',
      previousGPA: 0,
      expectedGPA: 0,
      previousTuition: null,
      currentTuition: 0,
      hasScholarship: false,
      scholarshipAmount: null,
      payingPerSemester: 0,
      transferReason: '',
      institutionReason: '',
      extracurriculars: '',
      immigrationStatus: '',
      specialCircumstances: '',
      referredBy: '',
      howDidYouKnow: '',
      preferredChannelLink: '',
      preferredChannel: 'Email' as const,
      consent: false,
    },
  });

  const nextStep = async () => {
    // If it's the first step, POST the data with only Step 1 fields
    if (active === 0 && !submissionId) {
      setLoading(true);
      try {
        // Only send Step 1 fields (Personal Info & Address)
        const step1Data = {
          formMode: 'full' as const,
          fullName: form.values.fullName,
          phone: form.values.phone,
          dateOfBirth: form.values.dateOfBirth,
          address: form.values.address,
          consent: form.values.consent,
          // Set other required fields to null/default to pass validation
          studyLevel: null,
          previousCollege: null,
          previousCreditHours: null,
          currentCollege: null,
          currentCreditHours: null,
          intendedCollege: null,
          plannedCreditHours: null,
          termYear: null,
          termSeason: null,
          major: null,
          switchingMajor: false,
          switchMajorDetails: null,
          previousGPA: null,
          expectedGPA: null,
          previousTuition: null,
          currentTuition: null,
          hasScholarship: false,
          scholarshipAmount: null,
          payingPerSemester: null,
          transferReason: null,
          institutionReason: null,
          extracurriculars: null,
          immigrationStatus: null,
          specialCircumstances: null,
          referredBy: null,
          howDidYouKnow: null,
          preferredChannelLink: null,
          preferredChannel: null,
        };
        
        console.log('Submitting Step 1 data:', step1Data);
        
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(step1Data),
        });

        const data = await response.json();
        console.log('Response:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to save form');
        }

        setSubmissionId(data.id);
        notifications.show({
          title: 'Progress Saved',
          message: 'Your information has been saved. Continue to the next step.',
          color: 'green',
        });
        
        // Move to next step
        setActive((current) => (current < 4 ? current + 1 : current));
      } catch (error: any) {
        console.error('Submission error:', error);
        notifications.show({
          title: 'Error',
          message: error.message || 'Failed to save form. Please try again.',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    } 
    // For subsequent steps, PATCH the data
    else if (submissionId) {
      setLoading(true);
      try {
        // Only send the fields relevant to the current step
        const stepData: any = {};
        
        if (active === 1) {
          // Step 2: Study Level & Current
          stepData.studyLevel = form.values.studyLevel;
          stepData.previousCollege = form.values.previousCollege || null;
          stepData.previousCreditHours = form.values.previousCreditHours;
          stepData.currentCollege = form.values.currentCollege || null;
          stepData.currentCreditHours = form.values.currentCreditHours;
        } else if (active === 2) {
          // Step 3: Major & Academics
          stepData.intendedCollege = form.values.intendedCollege || null;
          stepData.plannedCreditHours = form.values.plannedCreditHours;
          stepData.termYear = form.values.termYear;
          stepData.termSeason = form.values.termSeason;
          stepData.major = form.values.major || null;
          stepData.switchingMajor = form.values.switchingMajor;
          stepData.switchMajorDetails = form.values.switchMajorDetails || null;
          stepData.previousGPA = form.values.previousGPA;
          stepData.expectedGPA = form.values.expectedGPA;
        } else if (active === 3) {
          // Step 4: Transfer & Motivation
          stepData.previousTuition = form.values.previousTuition;
          stepData.currentTuition = form.values.currentTuition;
          stepData.hasScholarship = form.values.hasScholarship;
          stepData.scholarshipAmount = form.values.scholarshipAmount;
          stepData.payingPerSemester = form.values.payingPerSemester;
          stepData.transferReason = form.values.transferReason || null;
          stepData.institutionReason = form.values.institutionReason || null;
          stepData.extracurriculars = form.values.extracurriculars || null;
        } else if (active === 4) {
          // Step 5: Immigration & Contact
          stepData.immigrationStatus = form.values.immigrationStatus || null;
          stepData.specialCircumstances = form.values.specialCircumstances || null;
          stepData.referredBy = form.values.referredBy || null;
          stepData.howDidYouKnow = form.values.howDidYouKnow || null;
          stepData.preferredChannelLink = form.values.preferredChannelLink || null;
          stepData.preferredChannel = form.values.preferredChannel || null;
        }
        
        console.log(`Step ${active + 1} data to update:`, stepData);
        console.log('Submission ID:', submissionId);
        
        const response = await fetch(`/api/submissions/${submissionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stepData),
        });

        const data = await response.json();
        console.log('Update response:', data);

        if (!response.ok) {
          console.error('Update failed with status:', response.status);
          console.error('Error details:', data);
          throw new Error(data.message || 'Failed to update form');
        }

        notifications.show({
          title: 'Progress Updated',
          message: 'Your changes have been saved.',
          color: 'green',
        });
        
        // Move to next step
        setActive((current) => (current < 4 ? current + 1 : current));
      } catch (error: any) {
        console.error('Update error:', error);
        notifications.show({
          title: 'Error',
          message: error.message || 'Failed to update form. Please try again.',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Just move to next step if no submission needed
      setActive((current) => (current < 4 ? current + 1 : current));
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (values: any) => {
    console.log('handleSubmit called with values:', values);
    setLoading(true);
    
    try {
      // If we have a submissionId, first update with Step 5 data, then mark as complete
      if (submissionId) {
        // Update with Step 5 data
        const step5Data = {
          immigrationStatus: form.values.immigrationStatus || null,
          specialCircumstances: form.values.specialCircumstances || null,
          referredBy: form.values.referredBy || null,
          howDidYouKnow: form.values.howDidYouKnow || null,
          preferredChannelLink: form.values.preferredChannelLink || null,
          preferredChannel: form.values.preferredChannel || null,
        };
        
        console.log('Final submission with Step 5 data:', step5Data);
        
        const response = await fetch(`/api/submissions/${submissionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(step5Data),
        });

        const data = await response.json();
        console.log('Final submission response:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit form');
        }

        notifications.show({
          title: 'Success!',
          message: 'Your transfer advising form has been submitted successfully.',
          color: 'teal',
        });

        // Track Lead conversion
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead');
        }

        form.reset();
        setActive(0);
        setSubmissionId(null);
        if (onBack) onBack();
        // Redirect to transfer advising success page
        router.push('/success/transfer-advising');
      } else {
        // Fallback: create new submission if no ID exists
        console.log('Creating new submission with all data');
        
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log('New submission response:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit form');
        }

        notifications.show({
          title: 'Success!',
          message: 'Your transfer advising form has been submitted successfully.',
          color: 'teal',
        });

        // Track Lead conversion
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead');
        }

        form.reset();
        setActive(0);
        if (onBack) onBack();
        // Redirect to transfer advising success page
        router.push('/success/transfer-advising');
      }
    } catch (error: any) {
      console.error('Final submission error:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to submit form. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = ((active + 1) / 5) * 100;

  return (
    <Box>
      {/* Progress Header */}
      {/* <Paper shadow="sm" p="lg" radius="md" mb="xl" style={{ background: 'linear-gradient(135deg, #840029 0%, #BA4F21 100%)' }} className="!p-4 sm:!p-6">
        <Group justify="space-between" mb="sm" wrap="wrap" gap="sm">
          <Box>
            <Text c="white" size="sm" fw={600} tt="uppercase" mb={4} className="!text-xs sm:!text-sm">
              {
                ['Personal & Address', 'Study & Current', 
                 'Major & Academics', 'Transfer & Motivation', 
                 'Immigration & Contact'][active]
              }
            </Text>
            <Text c="#FCB116" size="xl" fw={700} className="!text-lg sm:!text-xl">
              Step {active + 1} of 5
            </Text>
          </Box>

        </Group>
        <Progress
          value={progress}
          size="lg"
          radius="xl"
          className="!h-2 sm:!h-3"
          styles={{
            root: { backgroundColor: 'rgba(255,255,255,0.2)' },
            section: { background: 'linear-gradient(90deg, #FCB116 0%, #FCD34D 100%)' },
          }}
        />
      </Paper> */}

        <Stack gap="md" mb="xl">
                <div style={{ textAlign: 'center' }}>
                  <Title
                    order={1}
                    size="h2"
                    fw={800}
                    style={{
                      background: 'linear-gradient(135deg, #7B0E2F 0%, #F7B500 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '0.5rem',
                    }}
                  >
                    MIDWESTERN STATE UNIVERSITY
                  </Title>
                  <Title order={2} size="h4" fw={500}>
                    TRANSFER ADVISING FORM
                  </Title>
                </div>
      
                <Paper
                  p="md"
                  radius="md"
                  style={{
                    background: 'linear-gradient(135deg, #7B0E2F 0%, #A13A1F 50%, #F7B500 100%)',
                    textAlign: 'center',
                  }}
                >
                  <Text c="white" fw={500} size="md" className='font-semibold'>
                    Please provide your details as in I-20/passport.
                  </Text>
                </Paper>
              </Stack>

      {/* Form Content */}
      <Paper shadow="lg" p="xl" radius="md" style={{ border: '2px solid #f0f0f0' }} className="!p-4 sm:!p-6 md:!p-8">
        {/* Desktop Stepper */}
        <Box className="hidden md:block mb-8">
          <Stepper 
            active={active} 
            onStepClick={setActive}
            size="md"
            color="msuRed"
            orientation="horizontal"
            completedIcon={<Text size="sm" fw={700}>✓</Text>}
            styles={{
              step: {
                padding: 8,
                flex: 1,
                flexDirection: 'column',
              },
              stepIcon: {
                borderWidth: 3,
                borderColor: '#840029',
                width: 44,
                height: 44,
                fontSize: 16,
                fontWeight: 700,
              },
              stepCompletedIcon: {
                borderColor: '#840029',
                backgroundColor: '#840029',
                borderRadius: 20,
              },
              separator: {
                background: '#e0e0e0',
                height: 3,
                marginLeft: 4,
                marginRight: 4,
                marginTop: -30,
              },
              stepBody: {
                marginTop: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
              stepLabel: {
                fontSize: 13,
                fontWeight: 600,
                color: '#840029',
                textAlign: 'center',
                display: 'hidden',
              },
            }}
          >
            <Stepper.Step label="Personal & Address"  />
            <Stepper.Step label="Study & Current"  />
            <Stepper.Step label="Major & Academics"  />
            <Stepper.Step label="Transfer & Why"  />
            <Stepper.Step label="Immigration & Contact"  />
          </Stepper>
        </Box>

        {/* Mobile Stepper - Horizontal with numbers only */}
        {/* <Box className="block md:hidden mb-8">
          <Stepper 
            active={active} 
            size="sm"
            color="msuRed"
            orientation="horizontal"
            completedIcon={<Text size="xs" fw={700}>✓</Text>}
            styles={{
              step: {
                padding: 4,
                flex: 1,
              },
              stepIcon: {
                borderWidth: 2,
                borderColor: '#840029',
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 700,
                minWidth: 32,
              },
              stepCompletedIcon: {
                borderColor: '#840029',
                backgroundColor: '#840029',
              },
              separator: {
                background: '#e0e0e0',
                height: 2,
                marginLeft: 2,
                marginRight: 2,
              },
              stepBody: {
                display: 'none',
              },
            }}
          >
            <Stepper.Step />
            <Stepper.Step />
            <Stepper.Step />
            <Stepper.Step />
            <Stepper.Step />
          </Stepper>
        </Box> */}


        <form onSubmit={form.onSubmit(handleSubmit)}>
          {active === 0 && <CombinedStep1PersonalAddress form={form} />}
          {active === 1 && <CombinedStep2StudyLevelCurrent form={form} />}
          {active === 2 && <CombinedStep3MajorAcademics form={form} />}
          {active === 3 && <CombinedStep4TransferMotivation form={form} />}
          {active === 4 && <CombinedStep5ImmigrationContact form={form} />}

          <Group justify="space-between" mt="xl" pt="xl" style={{ borderTop: '2px solid #f0f0f0' }} wrap="wrap" gap="md">
            <Button 
              variant="outline" 
              color="gray"
              size="lg"
              className="!text-sm sm:!text-base w-full xs:w-auto"
              leftSection={<IoChevronBack />}
              onClick={prevStep} 
              disabled={active === 0}
              styles={{
                root: {
                  borderColor: '#6E6565',
                  color: '#6E6565',
                  '&:hover': {
                    background: '#f9f9f9',
                  },
                },
              }}
            >
              Previous
            </Button>
            {active < 4 ? (
              <Button 
                size="lg"
                className="!text-sm sm:!text-base w-full xs:w-auto"
                rightSection={<IoChevronForward />}
                onClick={nextStep}
                loading={loading}
                styles={{
                  root: {
                    background: 'linear-gradient(135deg, #840029 0%, #BA4F21 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6d0021 0%, #9a3f1a 100%)',
                    },
                  },
                }}
              >
                {active === 0 ? 'Save & Continue' : 'Next Step'}
              </Button>
            ) : (
              <Button 
                type="submit" 
                size="lg"
                className="!text-sm sm:!text-base w-full xs:w-auto cursor-pointer"
                loading={loading}
                styles={{
                  root: {
                    background: '#FCB116',
                    color: '#840029',
                    fontWeight: 700,
                    '&:hover': {
                      background: '#f59e0b',
                    },
                  },
                }}
              >
                Check Your Eligibility
              </Button>
            )}
          </Group>
        </form>
      </Paper>
    </Box>
  );
}
