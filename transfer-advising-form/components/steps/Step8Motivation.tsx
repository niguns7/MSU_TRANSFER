import { Textarea, Stack } from '@mantine/core';

export function Step8Motivation({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <Textarea
        label="Why are you planning to transfer?"
        placeholder="Explain your reasons for transferring"
        required
        minRows={4}
        {...form.getInputProps('transferReason')}
      />
      <Textarea
        label="Why are you choosing this institution for transfer?"
        placeholder="Explain why this institution"
        required
        minRows={4}
        {...form.getInputProps('institutionReason')}
      />
      <Textarea
        label="Do you have any extracurricular activities, volunteer experience, or awards?"
        placeholder="List your achievements"
        minRows={3}
        {...form.getInputProps('extracurriculars')}
      />
    </Stack>
  );
}
