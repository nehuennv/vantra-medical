import React from 'react';
import { Sidebar } from "./Sidebar";


export function DashboardLayout({ children, currentPage, setCurrentPage }) {
    return (
        <div className="min-h-screen bg-slate-50/50 flex">

            {/* Sidebar Desktop */}
            <div className="hidden lg:block">
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>

            {/* Layout Main */}
            <div className="flex-1 flex flex-col lg:pl-[288px]"> {/* 72px * 4 = 288px width + gap */}



                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto w-full">
                    {children}
                </main>
            </div>

        </div>
    );
}