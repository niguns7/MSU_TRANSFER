'use client';

import { Container, Paper, Stepper, Button, Group, Title, Text, Box, Progress } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { fullFormSchema } from '@/lib/validations';
import { Step1PersonalInfo } from './steps/Step1PersonalInfo';
import { Step2Address } from './steps/Step2Address';
import { Step3StudyLevel } from './steps/Step3StudyLevel';
import { Step4CurrentEnrollment } from './steps/Step4CurrentEnrollment';
import { Step5TransferDestination } from './steps/Step5TransferDestination';
import { Step6MajorPlan } from './steps/Step6MajorPlan';
import { Step7Academics } from './steps/Step7Academics';
import { Step8Motivation } from './steps/Step8Motivation';
import { Step9Immigration } from './steps/Step9Immigration';
import { Step10Communication } from './steps/Step10Communication';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface FullFormWizardProps {
  onBack?: () => void;
}

export function FullFormWizard({ onBack }: FullFormWizardProps) {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(fullFormSchema),
    initialValues: {
      formMode: 'full' as const,
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: null,
      formDate: new Date(),
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

  const nextStep = () => {
    // Validate current step before proceeding
    if (!form.isValid()) {
      form.validate();
      return;
    }
    setActive((current) => (current < 9 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      notifications.show({
        title: 'Success!',
        message: 'Your transfer advising form has been submitted successfully.',
        color: 'teal',
      });

      form.reset();
      setActive(0);
      if (onBack) onBack();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to submit form. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = ((active + 1) / 10) * 100;

  return (
    <Box>
      {/* Progress Header */}
      <Paper shadow="sm" p="lg" radius="md" mb="xl" style={{ background: 'linear-gradient(135deg, #840029 0%, #BA4F21 100%)' }} className="!p-4 sm:!p-6">
        <Group justify="space-between" mb="sm" wrap="wrap" gap="sm">
          <Box>
            <Text c="white" size="sm" fw={600} tt="uppercase" mb={4} className="!text-xs sm:!text-sm">
              Transfer Application Progress
            </Text>
            <Text c="#FCB116" size="xl" fw={700} className="!text-lg sm:!text-xl">
              Step {active + 1} of 10
            </Text>
          </Box>
          {onBack && (
            <Button
              variant="white"
              color="red"
              size="sm"
              leftSection={<IoChevronBack />}
              onClick={onBack}
              className="!text-xs sm:!text-sm"
            >
              <span className="hidden sm:inline">Back to Form Selection</span>
              <span className="sm:hidden">Back</span>
            </Button>
          )}
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
      </Paper>

      {/* Form Content */}
      <Paper shadow="lg" p="xl" radius="md" style={{ border: '2px solid #f0f0f0' }} className="!p-4 sm:!p-6 md:!p-8">
        {/* Desktop Stepper */}
        <Box className="hidden md:block mb-8">
          <Stepper 
            active={active} 
            onStepClick={setActive}
            size="lg"
            color="msuRed"
            completedIcon={<Text size="md" fw={700}>✓</Text>}
            styles={{
              step: {
                padding: 12,
                minWidth: 100,
              },
              stepIcon: {
                borderWidth: 3,
                borderColor: '#840029',
                width: 48,
                height: 48,
                fontSize: 18,
                fontWeight: 700,
              },
              stepCompletedIcon: {
                borderColor: '#840029',
                backgroundColor: '#840029',
              },
              separator: {
                background: '#e0e0e0',
                height: 3,
                marginLeft: 8,
                marginRight: 8,
              },
              stepBody: {
                marginTop: 8,
              },
              stepLabel: {
                fontSize: 14,
                fontWeight: 600,
                color: '#840029',
              },
              stepDescription: {
                fontSize: 12,
                color: '#6E6565',
              },
            }}
          >
            <Stepper.Step label="Personal Info" description="Contact details" />
            <Stepper.Step label="Address" description="Location" />
            <Stepper.Step label="Study Level" description="Education" />
            <Stepper.Step label="Current" description="Institution" />
            <Stepper.Step label="Transfer Plan" description="Destination" />
            <Stepper.Step label="Major" description="Program" />
            <Stepper.Step label="Academics" description="GPA & Tuition" />
            <Stepper.Step label="Motivation" description="Why transfer" />
            <Stepper.Step label="Immigration" description="Status" />
            <Stepper.Step label="Contact" description="Preferences" />
          </Stepper>
        </Box>

        {/* Mobile Stepper - Simplified */}
        <Box className="block md:hidden mb-8">
          <Stepper 
            active={active} 
            size="md"
            color="msuRed"
            orientation="horizontal"
            completedIcon={<Text size="sm" fw={700}>✓</Text>}
            styles={{
              step: {
                padding: 4,
              },
              stepIcon: {
                borderWidth: 2,
                borderColor: '#840029',
                width: 36,
                height: 36,
                fontSize: 14,
                fontWeight: 700,
              },
              stepCompletedIcon: {
                borderColor: '#840029',
                backgroundColor: '#840029',
              },
              separator: {
                background: '#e0e0e0',
                height: 2,
              },
              stepBody: {
                display: 'none',
              },
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
              <Stepper.Step key={step} />
            ))}
          </Stepper>
        </Box>

        <Box mb="xl" p={{ base: 'sm', sm: 'md' }} style={{ background: '#fef3c7', borderRadius: 8, borderLeft: '4px solid #840029' }}>
          <Text size="md" fw={600} c="#840029" mb={4} className="text-sm sm:text-base">
            {
              ['Personal Identity & Contact', 'Complete Address', 'Study Level & Prior Education', 
               'Current Enrollment', 'Transfer Destination & Timing', 'Major Plan', 
               'Academics, Tuition & Scholarships', 'Motivation & Profile Highlights', 
               'Immigration & Special Circumstances', 'Referral & Communication Preferences'][active]
            }
          </Text>
          <Text size="sm" c="#6E6565" className="text-xs sm:text-sm">
            All fields marked with <Text component="span" c="red">*</Text> are required for the full application.
          </Text>
        </Box>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          {active === 0 && <Step1PersonalInfo form={form} />}
          {active === 1 && <Step2Address form={form} />}
          {active === 2 && <Step3StudyLevel form={form} />}
          {active === 3 && <Step4CurrentEnrollment form={form} />}
          {active === 4 && <Step5TransferDestination form={form} />}
          {active === 5 && <Step6MajorPlan form={form} />}
          {active === 6 && <Step7Academics form={form} />}
          {active === 7 && <Step8Motivation form={form} />}
          {active === 8 && <Step9Immigration form={form} />}
          {active === 9 && <Step10Communication form={form} />}

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
            {active < 9 ? (
              <Button 
                size="lg"
                className="!text-sm sm:!text-base w-full xs:w-auto"
                rightSection={<IoChevronForward />}
                onClick={nextStep}
                styles={{
                  root: {
                    background: 'linear-gradient(135deg, #840029 0%, #BA4F21 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6d0021 0%, #9a3f1a 100%)',
                    },
                  },
                }}
              >
                Next Step
              </Button>
            ) : (
              <Button 
                type="submit" 
                size="lg"
                className="!text-sm sm:!text-base w-full xs:w-auto"
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
                Submit Application
              </Button>
            )}
          </Group>
        </form>
      </Paper>
    </Box>
  );
}
