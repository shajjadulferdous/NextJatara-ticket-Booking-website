'use client';

import React from 'react';
import DashboardSidebar from '@/compontents/DashboardSidebar';
import Spinner from '@/compontents/ui/Spinner';
import { useAuth } from '@/lib/useAuth';

export default function DashboardLayout({ role, children }) {
  const { user, ready, isPending } = useAuth({ requireRole: [role, role === 'vendor' ? 'admin' : role] });
  if (isPending || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={36} />
      </div>
    );
  }
  if (!user) return null;
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="h-screen sticky top-0 flex-shrink-0 z-20">
        <DashboardSidebar role={role} />
      </div>
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}