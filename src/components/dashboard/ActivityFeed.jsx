import React from 'react';
import { Bot, MoreHorizontal } from "lucide-react";

export function ActivityFeed({ logs }) {

    // Helper to get iconography and colors based on log type
    const getLogStyles = (type) => {
        switch (type) {
            case 'payment':
                return "bg-emerald-100 text-emerald-600 border-emerald-200";
            case 'success':
                return "bg-blue-100 text-blue-600 border-blue-200";
            case 'system':
                return "bg-amber-100 text-amber-600 border-amber-200";
            default:
                return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    return (
        <div className="rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-6 h-full flex flex-col hover:shadow-md transition-shadow duration-300 min-h-[350px]">

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 leading-tight">Secretaria IA</h3>
                        <p className="text-xs text-slate-500 font-medium">Actividad en tiempo real</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-6 pl-2 relative flex-1 overflow-y-auto no-scrollbar pt-2">
                {/* Connector Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 block"></div>

                {logs.map((log) => {
                    const styleClass = getLogStyles(log.type);
                    const Icon = log.icon;

                    return (
                        <div key={log.id} className="relative flex gap-4 items-start group">
                            {/* Icon Node */}
                            <div className={`relative z-10 h-10 w-10 rounded-xl border-2 border-white shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${styleClass}`}>
                                {Icon && <Icon className="h-4 w-4" />}
                            </div>

                            <div className="pt-1">
                                <p className="text-sm font-medium text-slate-700 leading-snug group-hover:text-primary transition-colors">
                                    {log.text}
                                </p>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{log.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
