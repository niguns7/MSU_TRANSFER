import { TextInput, Switch, Textarea, Stack } from '@mantine/core';

export function Step6MajorPlan({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <TextInput
        label="What is your major?"
        placeholder="Your major"
        required
        {...form.getInputProps('major')}
      />
      <Switch
        label="Are you planning to switch major?"
        {...form.getInputProps('switchingMajor')}
      />
      {form.values.switchingMajor && (
        <Textarea
          label="If you are planning to switch, what will be that major and why?"
          placeholder="Explain your reasons for switching major"
          required
          minRows={3}
          {...form.getInputProps('switchMajorDetails')}
        />
      )}
    </Stack>
  );
}
