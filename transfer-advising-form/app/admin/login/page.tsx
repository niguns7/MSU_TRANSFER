'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters'),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        throw new Error('Invalid credentials');
      }

      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      });

      router.push('/admin/submissions');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to log in',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Paper shadow="md" p={30} radius="md">
        <Title order={2} ta="center" mb="xl">
          Admin Login
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="admin@example.com"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />
            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
