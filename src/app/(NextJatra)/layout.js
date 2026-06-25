import NextJatraNavbar from '@/compontents/NavBar';
import NextJatraFooter from '@/compontents/Footer';
import React from 'react';

export default function NextJatraLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col">
            <NextJatraNavbar />
            <main className="flex-1 pt-4">{children}</main>
            <NextJatraFooter />
        </div>
    );
}