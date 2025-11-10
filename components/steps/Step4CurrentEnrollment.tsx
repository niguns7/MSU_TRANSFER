import { TextInput, NumberInput, Stack } from '@mantine/core';

export function Step4CurrentEnrollment({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <TextInput
        label="What is the current university/college name?"
        placeholder="Current institution"
        required
        {...form.getInputProps('currentCollege')}
      />
      <NumberInput
        label="What is the credit hours enrolled in the current university/college?"
        placeholder="enter credit hours"
        required
        {...form.getInputProps('currentCreditHours')}
      />
    </Stack>
  );
}
