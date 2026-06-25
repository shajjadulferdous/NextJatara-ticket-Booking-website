'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { clearToken } from '@/lib/api';
import ThemeToggle from './theme/ThemeToggle';

import {
  FaTrain,
  FaBars,
  FaTimes,
  FaHome,
  FaTicketAlt,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

export default function NextJatraNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    authClient
      .getSession()
      .then((res) => {
        if (!mounted) return;
        setSession(res?.data || null);
      })
      .finally(() => mounted && setHydrated(true));
    return () => { mounted = false; };
  }, [pathname]);

  const sessionUser = session?.user;
  const isLoggedIn = !!sessionUser;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      clearToken();
      toast.success('Logged out');
    } catch (e) {
      toast.error('Logout failed');
    }
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: <FaHome size={16} /> },
    { name: 'All Tickets', href: '/tickets', icon: <FaTicketAlt size={16} /> },
  ];

  if (isLoggedIn) {
    navLinks.push({
      name: 'Dashboard',
      href: `/dashboard/${sessionUser?.role || 'user'}`,
      icon: <MdDashboard size={18} />,
    });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl flex h-20 items-center justify-between px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle menu"
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <FaTrain size={26} className="text-violet-600" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              Next<span className="text-violet-600">Jatra</span>
              <span className="ml-1 text-xs font-bold text-gray-400 align-middle">/TicketBari</span>
            </span>
          </Link>
        </div>

        {/* Center */}
        <ul className="hidden sm:flex items-center gap-8">
          {navLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`font-medium transition ${
                  pathname === item.href
                    ? 'text-violet-600'
                    : 'text-slate-700 dark:text-gray-300 hover:text-violet-600'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!hydrated ? (
            <div className="w-24 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ) : !isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex font-medium text-slate-700 dark:text-gray-200 hover:text-violet-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-violet-600 text-white px-4 py-2 hover:bg-violet-700 rounded-xl font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-3">
                <span className="hidden sm:block font-medium text-slate-700 dark:text-gray-200">
                  {sessionUser?.name || 'User'}
                </span>
                <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold overflow-hidden">
                  {sessionUser?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sessionUser.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    sessionUser?.name?.slice(0, 2).toUpperCase() || 'U'
                  )}
                </div>
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="font-semibold text-violet-600 text-sm truncate">{sessionUser?.email}</p>
                </div>
                <Link
                  href={`/dashboard/${sessionUser?.role || 'user'}/profile`}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FaUser size={14} /> My Profile
                </Link>
                <Link
                  href={`/dashboard/${sessionUser?.role || 'user'}`}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <MdDashboard size={16} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl"
                >
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 border-t border-gray-100 dark:border-gray-800 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 bg-white dark:bg-gray-900 flex flex-col gap-3">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-700 dark:text-gray-200 font-medium flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          {!isLoggedIn && hydrated && (
            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Link href="/login" className="flex-1 text-center py-2 border border-gray-200 dark:border-gray-700 rounded-xl font-medium">
                Login
              </Link>
              <Link href="/register" className="flex-1 text-center py-2 bg-violet-600 text-white rounded-xl font-medium">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}