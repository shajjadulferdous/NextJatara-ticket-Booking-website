'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function NextJatraFooter() {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 text-[#334155] dark:text-gray-300 py-14 mt-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 font-black text-[#0f172a] dark:text-white text-2xl tracking-tight">
            <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>Ticket<span className="text-violet-600">Bari</span></span>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Book bus, train, launch &amp; flight tickets easily with NextJatra — Bangladesh&apos;s most reliable online ticket booking platform.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[#0f172a] dark:text-white text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/" className="hover:text-violet-600 transition">Home</Link></li>
            <li><Link href="/tickets" className="hover:text-violet-600 transition">All Tickets</Link></li>
            <li><Link href="/contact" className="hover:text-violet-600 transition">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-violet-600 transition">About</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[#0f172a] dark:text-white text-sm uppercase tracking-wider">Contact Info</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2"><FaEnvelope className="text-violet-600" /> support@nextjatra.com</li>
            <li className="flex items-center gap-2"><FaPhoneAlt className="text-violet-600" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><FaFacebookF className="text-violet-600" /> facebook.com/NextJatra</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[#0f172a] dark:text-white text-sm uppercase tracking-wider">Payment Methods</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Secure payments powered by Stripe.
          </p>
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200">VISA</div>
            <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200">MasterCard</div>
            <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-violet-600">Stripe</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} NextJatra (TicketBari). All rights reserved.</p>
        <div className="flex items-center gap-4 text-gray-400">
          <a href="#" aria-label="Facebook" className="hover:text-violet-600"><FaFacebookF /></a>
          <a href="#" aria-label="X" className="hover:text-violet-600"><FaXTwitter /></a>
        </div>
      </div>
    </footer>
  );
}