import React from 'react';
import { Sparkles, CircleDollarSign, CalendarCheck, Settings2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActivityFeed({ logs }) {

    // Helper to map log types to clear categories and visual styles
    const getLogConfig = (type) => {
        switch (type) {
            case 'payment':
                return {
                    label: "FINANZAS",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    border: "border-emerald-100",
                    icon: CircleDollarSign
                };
            case 'success':
                return {
                    label: "AGENDA",
                    color: "text-primary",
                    bg: "bg-primary/10",
                    border: "border-primary/20",
                    icon: CalendarCheck
                };
            case 'system':
                return {
                    label: "SISTEMA",
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    border: "border-amber-100",
                    icon: Settings2
                };
            default:
                return {
                    label: "GENERAL",
                    color: "text-slate-600",
                    bg: "bg-slate-50",
                    border: "border-slate-100",
                    icon: Activity
                };
        }
    };

    return (
        <div className="group rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-6 h-full flex flex-col min-h-[350px] transition-all duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]">

            {/* Header Redesigned */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-[15deg]">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">Secretaria IA</h3>
                    <p className="text-xs text-slate-500 font-medium">Gestionando tu consultorio</p>
                </div>
            </div>

            {/* Content List Redesigned */}
            <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
                {logs.map((log, index) => {
                    const config = getLogConfig(log.type);
                    const Icon = config.icon;
                    const isLast = index === logs.length - 1;

                    return (
                        <div
                            key={log.id}
                            className={cn(
                                "group relative flex items-center gap-4 p-4 transition-colors duration-200 hover:bg-slate-50 rounded-2xl cursor-default",
                                !isLast && "border-b border-slate-100/50"
                            )}
                        >
                            {/* Icon with Subtle Background */}
                            <div className={cn("h-12 w-12 flex items-center justify-center rounded-2xl shrink-0 transition-transform group-hover:scale-105", config.bg, config.color)}>
                                <Icon className="h-6 w-6" />
                            </div>

                            {/* Content Structured - Centered */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <p className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-black transition-colors mb-0.5">
                                    {log.action}
                                </p>
                                <span className="text-[11px] font-medium text-slate-400">
                                    {log.time}
                                </span>
                            </div>

                            {/* Chevron for affordance */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
