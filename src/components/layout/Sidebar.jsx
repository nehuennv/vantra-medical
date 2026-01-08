import React from 'react';
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    MessageSquare,
    Settings,
    Activity,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    { icon: CalendarDays, label: "Agenda", id: "agenda" },
    { icon: Users, label: "Pacientes", id: "patients" },
    { icon: MessageSquare, label: "Mensajes IA", id: "messages", badge: 3 },
    { icon: Settings, label: "Ajustes", id: "settings" },
];

export function Sidebar({ currentPage, setCurrentPage, className, onClose }) {
    return (
        // CONTENEDOR FLOTANTE
        <aside className={cn("fixed left-4 top-4 bottom-4 w-72 flex flex-col z-50", className)}>

            {/* CÁPSULA DE VIDRIO (GLASSMORPHISM) */}
            <div className="flex-1 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm flex flex-col overflow-hidden relative transition-all">

                {/* Decoración interna (luz) */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* HEADER */}
                <div className="h-24 flex items-center px-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight text-slate-800 leading-none">Vantra<span className="text-primary">Med</span></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Workspace</span>
                        </div>
                    </div>
                </div>

                {/* NAVEGACIÓN */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto relative z-10">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                                console.log("Sidebar clicked:", item.id);
                                setCurrentPage(item.id);
                                if (onClose) onClose();
                            }}
                            className={cn(
                                "group w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden text-left cursor-pointer",
                                currentPage === item.id
                                    ? "bg-primary text-white"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <item.icon className={cn(
                                    "h-5 w-5 transition-transform duration-300",
                                    currentPage === item.id ? "text-white" : "text-slate-400 group-hover:scale-110 group-hover:text-primary"
                                )} />
                                <span className="font-medium text-sm tracking-wide">{item.label}</span>
                            </div>

                            {item.badge && (
                                <span className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold relative z-10",
                                    currentPage === item.id ? "bg-white text-primary" : "bg-primary/10 text-primary"
                                )}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* FOOTER */}
                <div className="p-4 mt-auto relative z-10">
                    <div className="bg-white/50 rounded-2xl p-4 border border-white/50 backdrop-blur-sm transition-colors hover:bg-white/80">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    alt="Doctor"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold text-slate-800 truncate">Dr. Vantra</span>
                                <span className="text-xs text-slate-500 truncate">Cardiólogo</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 h-8 text-xs rounded-xl">
                            <LogOut className="h-3 w-3 mr-2" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}