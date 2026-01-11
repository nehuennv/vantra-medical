import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function TopBar() {
    return (
        <header className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100">
            {/* Left: Date Context */}
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <span className="capitalize">
                    {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </div>

            {/* Right: Global Actions */}
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary rounded-full">
                    <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary rounded-full relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary rounded-full hidden sm:flex">
                    <HelpCircle className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
