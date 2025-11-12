'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <SessionProvider>
      {!isLoginPage && <AdminHeader />}
      {children}
    </SessionProvider>
  );
}
