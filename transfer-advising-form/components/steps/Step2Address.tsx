import { Textarea, Stack } from '@mantine/core';

export function Step2Address({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <Textarea
        label="Complete Address"
        placeholder="Street, City, State, Zip Code"
        required
        minRows={4}
        {...form.getInputProps('address')}
      />
    </Stack>
  );
}
