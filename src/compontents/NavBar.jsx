"use client";

import React, { useState } from "react";
import { Link, Button, Dropdown, Avatar } from "@heroui/react";
import { redirect, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

import {
  FaTrain,
  FaBars,
  FaTimes,
  FaHome,
  FaTicketAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { MdDashboard } from "react-icons/md";

export default function NextJatraNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user;
  const isLoggedIn = !!sessionUser;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
    redirect("/login");
  };

  const navLinks = [
    {
      name: "Home",
      href: "/",
      icon: <FaHome size={16} />,
    },
    {
      name: "Tickets",
      href: "/tickets",
      icon: <FaTicketAlt size={16} />,
    },
  ];

  if (isLoggedIn) {
    navLinks.push({
      name: "Dashboard",
      href: `/dashboard/${sessionUser?.role || "user"}`,
      icon: <MdDashboard size={18} />,
    });
  }

  if (isPending) {
    return <div className="h-20 w-full bg-gray-100 animate-pulse" />;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
      <header className="mx-auto max-w-7xl flex h-20 items-center justify-between px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <FaTrain size={28} className="text-violet-600" />
            <span className="text-2xl font-black text-slate-900">
              Next<span className="text-violet-600">Jatra</span>
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
                    ? "text-violet-600"
                    : "text-slate-700 hover:text-violet-600"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex font-medium text-slate-700 hover:text-violet-600"
              >
                Login
              </Link>

              <Link
              
                href="/register"
                className="bg-violet-600 text-white px-4 py-2 hover:bg-violet-700 rounded-xl"
              >
                Register
              </Link>
            </>
          ) : (
            <Dropdown>
              <Dropdown.Trigger>
                <div className="flex items-center gap-3 cursor-pointer">
                  <span className="hidden sm:block font-medium text-slate-700">
                    {sessionUser?.name || "User"}
                  </span>

                  <Avatar>
                  <Avatar.Image alt="John Doe" src={sessionUser?.image || "https://images.unsplash.com/photo-1781824093311-803b9f9b7c5c"}/>
                  <Avatar.Fallback>{sessionUser?.name?.slice(0, 2).toUpperCase() || "U"}</Avatar.Fallback>
                </Avatar>
                </div>
              </Dropdown.Trigger>

              <Dropdown.Popover>
                <Dropdown.Menu className="w-52">
                  <Dropdown.Item key="info" className="pointer-events-none opacity-80">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="font-semibold text-violet-600 text-sm">
                      {sessionUser?.email}
                    </p>
                  </Dropdown.Item>

                  <Dropdown.Item key="profile" as={Link} href="/profile">
                    <div className="flex items-center gap-2">
                      <FaUser size={16} />
                      Profile
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item key="dashboard" as={Link} href="/dashboard">
                    <div className="flex items-center gap-2">
                      <MdDashboard size={18} />
                      Dashboard
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item key="logout" color="danger" onClick={handleLogout}>
                    <div className="flex items-center gap-2">
                      <FaSignOutAlt size={16} />
                      Logout
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 bg-white border-t flex flex-col gap-4">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </div>
            </Link>
          ))}

          {!isLoggedIn && (
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Link href="/login" variant="light">
                Login
              </Link>

              <Link
                href="/register"
                className="bg-violet-600 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}