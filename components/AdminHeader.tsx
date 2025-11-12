'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Group, Button, Text, Avatar } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function AdminHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      
      notifications.show({
        title: 'Success',
        message: 'Logged out successfully',
        color: 'green',
      });

      router.push('/admin/login');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to log out',
        color: 'red',
      });
    }
  };

  if (!session) return null;

  return (
    <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #dee2e6' }}>
      <Group>
        <Avatar color="blue" radius="xl">
          {session.user?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <div>
          <Text size="sm" fw={500}>
            Admin User
          </Text>
          <Text size="xs" c="dimmed">
            {session.user?.email}
          </Text>
        </div>
      </Group>

      <Button
        variant="light"
        color="red"
        leftSection={<IconLogout size={16} />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Group>
  );
}
