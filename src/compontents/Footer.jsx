"use client";

import React from "react";
import { Link, Input, Button } from "@heroui/react";

export default function NextJatraFooter() {
  return (
    // Main footer container - styled with a light gray background and top border line
    <footer className="w-full bg-gray-50 border-t border-gray-100 text-[#334155] py-16">
      
      {/* Responsive grid wrapper - limits content width and scales columns from mobile (1) to desktop (5) */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Column 1: Brand Logo, Icon, and Brief Description */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 font-black text-[#0f172a] text-2xl tracking-tight">
            {/* Bus/Train navigation transit vector icon */}
            <svg
              className="w-7 h-7 text-[#7c3aed]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {/* Project Brand Identity Name: TicketBari */}
            <span>Ticket<span className="text-[#7c3aed]">Bari</span></span>
          </Link>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            TicketBari (NextJatra) is one of the most reliable and easiest online ticket booking platforms in Bangladesh. Book your bus, train, or launch tickets in just a few clicks.
          </p>
        </div>

        {/* Column 2: Internal Core Navigation Anchors */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[#0f172a] text-sm uppercase tracking-wider">Platform</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Home Page</Link></li>
            <li><Link href="/tickets" className="text-gray-500 hover:text-[#7c3aed] transition-colors">All Tickets</Link></li>
            <li><Link href="/dashboard" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Dashboard</Link></li>
            <li><Link href="/offers" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Special Offers</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Support & Legal Framework Resources */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[#0f172a] text-sm uppercase tracking-wider">Support</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/contact" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Contact Us</Link></li>
            <li><Link href="/privacy" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/faq" className="text-gray-500 hover:text-[#7c3aed] transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter Subscription Intake Form */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <h4 className="font-bold text-[#0f172a] text-sm uppercase tracking-wider">Newsletter</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Subscribe to get the latest deals, campaigns, and updates sent straight to your inbox.
          </p>
          <div className="flex flex-col gap-2">
            {/* HeroUI v3 structural layout bordered user text input field */}
            <Input 
              type="email" 
              placeholder="Your Email Address" 
              variant="bordered"
              size="sm"
              className="w-full bg-white text-sm rounded-xl"
            />
            {/* Call to action button colored to match the premium theme palette */}
            <Button 
              className="bg-[#7c3aed] text-white font-semibold text-sm rounded-xl py-5 hover:bg-[#6d28d9] transition-all shadow-md shadow-purple-100"
            >
              Subscribe Now
            </Button>
          </div>
        </div>

      </div>

      {/* Footer Bottom Division: Copyright declaration and social vector anchors */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 mt-12 pt-8 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Dynamic datetime object used to display current operational calendar year */}
        <p className="text-xs text-gray-400 text-center sm:text-left">
          &copy; {new Date().getFullYear()} NextJatra (TicketBari). All rights reserved.
        </p>
        
        {/* Social Profile vector glyph directories (Facebook and X) */}
        <div className="flex items-center gap-4 text-gray-400">
          {/* Facebook Brand SVG Profile Asset */}
          <a href="#" className="hover:text-[#7c3aed] transition-colors" aria-label="Facebook">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          {/* Twitter / X Brand SVG Profile Asset */}
          <a href="#" className="hover:text-[#7c3aed] transition-colors" aria-label="Twitter">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

    </footer>
  );
}