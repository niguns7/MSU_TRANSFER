'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Button,
  Table,
  TextInput,
  Select,
  Group,
  Paper,
  Loader,
  Stack,
  Pagination,
  Badge,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

export default function AdminSubmissionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [formMode, setFormMode] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubmissions();
    }
  }, [status, page, search, formMode]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(formMode && { formMode }),
      });

      const response = await fetch(`/api/admin/submissions?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.submissions);
        setTotal(data.pagination.pages);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch submissions',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(formMode && { formMode }),
      });

      const response = await fetch(`/api/admin/submissions/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to export submissions',
        color: 'red',
      });
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <Container size="lg" py={80} ta="center">
        <Loader size="xl" />
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>Submissions</Title>
          <Button onClick={handleExport}>Export CSV</Button>
        </Group>

        <Paper shadow="sm" p="md">
          <Group gap="md">
            <TextInput
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by form mode"
              data={[
                { value: '', label: 'All' },
                { value: 'partial', label: 'Partial' },
                { value: 'full', label: 'Full' },
              ]}
              value={formMode}
              onChange={(value) => setFormMode(value || '')}
              w={200}
            />
          </Group>
        </Paper>

        {loading ? (
          <Loader />
        ) : (
          <>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Phone</Table.Th>
                  <Table.Th>Form Mode</Table.Th>
                  <Table.Th>Major</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {submissions.map((submission) => (
                  <Table.Tr key={submission.id}>
                    <Table.Td>{new Date(submission.createdAt).toLocaleDateString()}</Table.Td>
                    <Table.Td>{submission.fullName}</Table.Td>
                    <Table.Td>{submission.email}</Table.Td>
                    <Table.Td>{submission.phone}</Table.Td>
                    <Table.Td>
                      <Badge color={submission.formMode === 'full' ? 'blue' : 'gray'}>
                        {submission.formMode}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{submission.major || '-'}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Group justify="center">
              <Pagination value={page} onChange={setPage} total={total} />
            </Group>
          </>
        )}
      </Stack>
    </Container>
  );
}
