import { TextInput, Textarea, Stack } from '@mantine/core';

export function Step9Immigration({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <TextInput
        label="Immigration status"
        placeholder="F-1, J-1, H-4, PR, Citizen, etc."
        required
        {...form.getInputProps('immigrationStatus')}
      />
      <Textarea
        label="Do you have any special circumstances to mention?"
        placeholder="Enter 'None' if not applicable"
        required
        minRows={4}
        {...form.getInputProps('specialCircumstances')}
      />
    </Stack>
  );
}
