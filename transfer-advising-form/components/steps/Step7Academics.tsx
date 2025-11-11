import { NumberInput, Switch, Stack } from '@mantine/core';

export function Step7Academics({ form }: { form: any }) {
  return (
    <Stack gap="md">
      <NumberInput
        label="What is your GPA in the previous university/college?"
        placeholder="0.00"
        required
        min={0}
        max={4.0}
        decimalScale={2}
        step={0.01}
        {...form.getInputProps('previousGPA')}
      />
      <NumberInput
        label="What GPA are you expecting to get by the end of this term?"
        placeholder="0.00"
        required
        min={0}
        max={4.0}
        decimalScale={2}
        step={0.01}
        {...form.getInputProps('expectedGPA')}
      />
      <NumberInput
        label="What is the tuition fee of previous University/College?"
        placeholder="0.00"
        min={0}
        prefix="$"
        decimalScale={2}
        {...form.getInputProps('previousTuition')}
      />
      <NumberInput
        label="What is the tuition fee of the current university/College?"
        placeholder="0.00"
        required
        min={0}
        prefix="$"
        decimalScale={2}
        {...form.getInputProps('currentTuition')}
      />
      <Switch
        label="Do you have scholarships?"
        {...form.getInputProps('hasScholarship')}
      />
      {form.values.hasScholarship && (
        <NumberInput
          label="Scholarship amount"
          placeholder="0.00"
          required
          min={0}
          prefix="$"
          decimalScale={2}
          {...form.getInputProps('scholarshipAmount')}
        />
      )}
      <NumberInput
        label="How much you are paying per semester?"
        placeholder="0.00"
        required
        min={0}
        prefix="$"
        decimalScale={2}
        {...form.getInputProps('payingPerSemester')}
      />
    </Stack>
  );
}
