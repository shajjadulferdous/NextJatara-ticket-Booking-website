"use client";
import React from 'react';
import Link from 'next/link';

import { FiLayout, FiGrid, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

const SideBarAdmin =  () => {
    return (
        <div className="drawer lg:drawer-open h-full">

            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            

            <div className="lg:hidden fixed top-4 left-4 z-50">
                <label 
                    htmlFor="dashboard-drawer" 
                    className="btn btn-sm bg-white border border-gray-100 shadow-sm text-gray-700 hover:bg-gray-50 rounded-xl px-3 flex items-center gap-1.5"
                >
                    <FiMenu className="w-4 h-4 text-[#7c3aed]" />
                    <span className="text-xs font-semibold">Menu</span>
                </label>
            </div>

            
            <div className="drawer-side z-40">
               
                <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                
             
                <div className="menu bg-white border-r border-gray-100 min-h-full w-64 p-5 flex flex-col justify-between">
                    
                   
                    <div className="w-full flex flex-col gap-8">
                       
                        <div className="flex items-center gap-2 font-black text-[#0f172a] text-xl tracking-tight px-2">
                            <svg
                                className="w-6 h-6 text-[#7c3aed]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span>Next<span className="text-[#7c3aed]">Jatra</span></span>
                        </div>

                        {/* মেনু লিংকসমূহ */}
                        <ul className="flex flex-col gap-1.5 w-full p-0">
                            <li>
                                <Link href="/vendor" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white bg-[#7c3aed] rounded-xl shadow-md shadow-purple-100 transition-all">
                                    <FiLayout className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/reviews-tickets" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#7c3aed] hover:bg-purple-50/50 rounded-xl transition-all">
                                    <FiGrid className="w-4 h-4" />
                                    <span>Manage Tickets</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/vendor/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#7c3aed] hover:bg-purple-50/50 rounded-xl transition-all">
                                    <FiSettings className="w-4 h-4" />
                                    <span>Settings</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <button onClick={async () => {await authClient.signOut(); redirect('/login');}} className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <FiLogOut className="w-4 h-4" />
                            <span>Log Out</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default SideBarAdmin;