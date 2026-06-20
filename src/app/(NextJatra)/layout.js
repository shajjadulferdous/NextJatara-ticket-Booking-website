import NextJatraNavbar from '@/compontents/NavBar';
import React from 'react';
import { Toaster } from 'react-hot-toast';

const layout = ({ children }) => {
    return (
        <div>
            <NextJatraNavbar />
            {children}
             
        </div>
    );
};

export default layout;