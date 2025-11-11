import { TextInput, Select, Stack, Checkbox } from '@mantine/core';

export function Step10Communication({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <TextInput
        label="Are you referred by someone?"
        placeholder="Referrer name (optional)"
        {...form.getInputProps('referredBy')}
      />
      <TextInput
        label="How did you know about us?"
        placeholder="Optional"
        {...form.getInputProps('howDidYouKnow')}
      />
      <TextInput
        label="Please provide the link for your preferred channel"
        placeholder="https://facebook.com/yourprofile"
        required
        {...form.getInputProps('preferredChannelLink')}
      />
      <Select
        label="What communication channel do you prefer?"
        placeholder="Select channel"
        required
        data={['Facebook', 'LinkedIn', 'Whatsapp', 'Instagram', 'Twitter', 'Email', 'Phone']}
        {...form.getInputProps('preferredChannel')}
      />
      <Checkbox
        label="I consent to be contacted regarding my transfer application"
        {...form.getInputProps('consent', { type: 'checkbox' })}
      />
    </Stack>
  );
}
