import SideBar from '@/compontents/SideBar';
import React from 'react';

const VendorPage = () => {
    return (

        <div className='flex h-screen w-full bg-gray-50 overflow-hidden'>
            
            
            <div className='h-screen sticky top-0 flex-shrink-0 z-20'>
                <SideBar />
            </div>
            
            {/* মেইন ড্যাশবোর্ড কনটেন্ট এরিয়া - এটি আলাদাভাবে স্ক্রল হবে */}
            <div className='flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8'>
                
                {/* ভেতরের মূল কন্টেন্ট কার্ড */}
                <div className='w-full min-h-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
                    <h1 className='text-2xl font-bold text-[#0f172a]'>Vendor Dashboard</h1>
                    <p className='text-gray-500 text-sm mt-1'>Welcome to your NextJatra vendor portal.</p>
                    
                    {/* এখানে আপনার ড্যাশবোর্ডের বাকি সব কনটেন্ট বা চার্ট বসবে */}
                    <div className='mt-6 border-2 border-dashed border-gray-100 rounded-xl h-[80vh] flex items-center justify-center text-gray-300 font-medium'>
                        Content Placeholder
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VendorPage;