import DashboardLayout from '@/compontents/DashboardLayout';

export default function UserLayout({ children }) {
  return <DashboardLayout role="user">{children}</DashboardLayout>;
}