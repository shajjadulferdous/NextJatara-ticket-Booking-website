import DashboardLayout from '@/compontents/DashboardLayout';

export default function AdminLayout({ children }) {
  return <DashboardLayout role="admin">{children}</DashboardLayout>;
}