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

            {/* Right: Doctor Profile */}
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-700">Dr. Villavicencio</p>
                    <p className="text-xs text-slate-500">Cardiología</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm">
                    DV
                </div>
            </div>
        </header>
    );
}
