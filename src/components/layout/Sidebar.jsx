import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion'; // <--- Usamos NavLink
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Settings,
    MessageSquare,
    Clock,
    Activity,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clientConfig } from "@/config/client";

const MENU_ITEMS = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'agenda', icon: CalendarDays, label: 'Agenda Médica', path: '/agenda' },
    { id: 'patients', icon: Users, label: 'Pacientes', path: '/pacientes' },
    { id: 'availability', icon: Clock, label: 'Disponibilidad', path: '/disponibilidad' },
    { id: 'messages', icon: MessageSquare, label: 'Mensajes', path: '/mensajes', badge: 3 },
    { id: 'settings', icon: Settings, label: 'Configuración', path: '/configuracion' },
];

export function Sidebar() {
    return (
        <aside className="w-20 lg:w-72 bg-white border-r border-slate-200 h-full flex flex-col transition-all duration-300 relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">

            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="font-bold text-xl tracking-tight text-slate-900 leading-none">Medical<span className="text-primary">App</span></h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Consultorio Digital</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-2 mb-4 hidden lg:block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu Principal</span>
                </div>

                {MENU_ITEMS.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                            !isActive && "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                            isActive && "text-white"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className="absolute inset-0 bg-primary rounded-xl shadow-md shadow-primary/20"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <item.icon className={cn(
                                    "relative z-10 h-5 w-5 transition-transform duration-300",
                                    isActive ? "scale-110" : "group-hover:scale-110",
                                    !isActive && "text-slate-400 group-hover:text-primary"
                                )} />

                                <span className="relative z-10 font-semibold text-sm hidden lg:block flex-1">
                                    {item.label}
                                </span>

                                {item.badge && (
                                    <span className={cn(
                                        "relative z-10 hidden lg:flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                                        isActive ? "bg-white text-primary" : "bg-primary/10 text-primary"
                                    )}>
                                        {item.badge}
                                    </span>
                                )}

                                {isActive && (
                                    <ChevronRight className="relative z-10 h-4 w-4 hidden lg:block animate-in slide-in-from-left-2 opacity-50" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-slate-100">
                <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-white shadow-sm overflow-hidden">
                            <img src={clientConfig.identity.avatar} alt="User" className="h-full w-full object-cover" />
                        </div>
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="hidden lg:block text-left">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{clientConfig.identity.name}</p>
                        <p className="text-xs text-slate-400">{clientConfig.identity.specialty}</p>
                    </div>
                    <LogOut className="h-4 w-4 text-slate-400 ml-auto hidden lg:block group-hover:text-rose-500 transition-colors" />
                </button>
            </div>
        </aside>
    );
}