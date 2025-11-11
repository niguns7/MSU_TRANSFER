import { TextInput, NumberInput, Select, Stack } from '@mantine/core';

export function Step5TransferDestination({ form }: { form: any }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => String(currentYear + i));

  return (
    <Stack gap="md">
      <TextInput
        label="Name of the intended University/College to transfer?"
        placeholder="Intended institution"
        {...form.getInputProps('intendedCollege')}
      />
      <NumberInput
        label="Credit hours you are planning to complete by the term you want to transfer"
        placeholder="0"
        required
        min={0}
        max={200}
        {...form.getInputProps('plannedCreditHours')}
      />
      <Select
        label="What is the year of the intended term to transfer?"
        placeholder="Select year"
        required
        data={years}
        {...form.getInputProps('termYear')}
      />
      <Select
        label="What is your intended term to transfer?"
        placeholder="Select term"
        required
        data={['Fall', 'Spring', 'Summer', 'Other']}
        {...form.getInputProps('termSeason')}
      />
    </Stack>
  );
}
