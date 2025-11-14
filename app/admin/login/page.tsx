'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Stack, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export const dynamic = 'force-dynamic';

const REMEMBER_ME_KEY = 'adminRememberMe';
const STORED_EMAIL_KEY = 'adminEmail';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(STORED_EMAIL_KEY);
    const wasRemembered = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    
    if (savedEmail && wasRemembered) {
      form.setFieldValue('email', savedEmail);
      setRememberMe(true);
    }
  }, []);

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

      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem(STORED_EMAIL_KEY, values.email);
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      } else {
        localStorage.removeItem(STORED_EMAIL_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
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
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.currentTarget.checked)}
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
