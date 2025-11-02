import { Select, TextInput, NumberInput, Stack } from '@mantine/core';

export function Step3StudyLevel({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <Select
        label="What is your level of study?"
        placeholder="Select study level"
        required
        data={['Undergraduate', 'Graduate', 'Associate', 'Certificate', 'Other']}
        {...form.getInputProps('studyLevel')}
      />
      <TextInput
        label="Name of previous University/College"
        placeholder="Previous institution (if any)"
        {...form.getInputProps('previousCollege')}
      />
      <NumberInput
        label="Credit hours completed in previous university/college"
        placeholder="0"
        min={0}
        max={200}
        {...form.getInputProps('previousCreditHours')}
      />
    </Stack>
  );
}
