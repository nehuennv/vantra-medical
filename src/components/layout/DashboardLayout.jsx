import React, { useState } from 'react';
import { Sidebar } from "./Sidebar";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function DashboardLayout({ children, currentPage, setCurrentPage }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-slate-50/50 to-indigo-100/40 flex flex-col lg:flex-row">

            {/* Mobile Header (Visible < lg) */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
                <div className="font-bold text-lg text-slate-800">
                    Vantra<span className="text-primary">Med</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Sidebar Navigation (Drawer) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden p-4"
                        >
                            {/* Close Button placed absolutely or inside content? 
                                Sidebar component has its own header. 
                                We can pass a close action or just rely on clicking outside. 
                                But better to have a close button on the sidebar or overlay.
                            */}
                            <Sidebar
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                className="static h-full w-full"
                                onClose={() => setIsMobileMenuOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar Desktop (Visible >= lg) */}
            <div className="hidden lg:block relative z-30">
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>

            {/* Layout Main */}
            {/* 
                Calculated Padding: 
                Sidebar Width (w-72 = 18rem) + Left Position (left-4 = 1rem) + Gap (1rem) = 20rem (pl-80)
            */}
            <div className="flex-1 flex flex-col lg:pl-80 transition-[padding] duration-300">
                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto w-full">
                    {children}
                </main>
            </div>

        </div>
    );
}