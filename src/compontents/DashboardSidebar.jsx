'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import { clearToken } from '@/lib/api';

const NAV = {
  user: [
    { href: '/dashboard/user', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/user/profile', label: 'My Profile', icon: '👤' },
    { href: '/dashboard/user/bookings', label: 'My Booked Tickets', icon: '🎫' },
    { href: '/dashboard/user/transactions', label: 'Transaction History', icon: '💳' },
  ],
  vendor: [
    { href: '/dashboard/vendor', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/vendor/profile', label: 'Vendor Profile', icon: '👤' },
    { href: '/dashboard/vendor/addticket', label: 'Add Ticket', icon: '➕' },
    { href: '/dashboard/vendor/my-tickets', label: 'My Added Tickets', icon: '🎫' },
    { href: '/dashboard/vendor/bookings', label: 'Requested Bookings', icon: '📋' },
    { href: '/dashboard/vendor/revenue', label: 'Revenue Overview', icon: '📈' },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/admin/profile', label: 'Admin Profile', icon: '👤' },
    { href: '/dashboard/admin/manage-tickets', label: 'Manage Tickets', icon: '🛠' },
    { href: '/dashboard/admin/manage-users', label: 'Manage Users', icon: '👥' },
    { href: '/dashboard/admin/advertise', label: 'Advertise Tickets', icon: '📢' },
  ],
};

export default function DashboardSidebar({ role = 'user' }) {
  const pathname = usePathname();
  const router = useRouter();
  const items = NAV[role] || NAV.user;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      clearToken();
      toast.success('Logged out');
    } catch {
      toast.error('Logout failed');
    }
    router.push('/login');
  };

  return (
    <div className="drawer lg:drawer-open h-full">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-sm bg-white border border-gray-100 shadow text-gray-700 rounded-xl px-3 flex items-center gap-1.5"
        >
          <FiMenu className="text-violet-600" />
          <span className="text-xs font-semibold">Menu</span>
        </label>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 min-h-full w-64 p-5 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-xl px-2">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Next<span className="text-violet-600">Jatra</span></span>
            </Link>

            <ul className="flex flex-col gap-1.5 w-full p-0">
              {items.map((it) => {
                const active = pathname === it.href;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition ${
                        active
                          ? 'bg-violet-600 text-white font-semibold shadow-md shadow-purple-100'
                          : 'text-gray-600 dark:text-gray-300 hover:text-violet-600 hover:bg-purple-50/50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-base">{it.icon}</span>
                      <span>{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
          >
            <FiLogOut /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}