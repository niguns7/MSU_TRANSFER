import { TextInput, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';

export function Step1PersonalInfo({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <TextInput
        label="Full Name"
        placeholder="Enter your name as in I-20/passport"
        required
        {...form.getInputProps('fullName')}
      />
      <TextInput
        label="Email"
        placeholder="your.email@example.com"
        type="email"
        required
        {...form.getInputProps('email')}
      />
      <TextInput
        label="Phone"
        placeholder="+1 234 567 8900"
        required
        {...form.getInputProps('phone')}
      />
      <DateInput
        label="Date of Birth"
        placeholder="Select date"
        required
        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))}
        {...form.getInputProps('dateOfBirth')}
      />
    </Stack>
  );
}
