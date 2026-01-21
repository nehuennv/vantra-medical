import React from 'react';
import { Clock, CalendarDays, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function AgendaWidget({ appointments = [] }) {
    // --- 1. LOGIC: TIME FILTERING ---
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const { history, upcoming } = appointments.reduce((acc, apt) => {
        const [hours, minutes] = apt.time.split(':').map(Number);
        const aptMinutes = hours * 60 + minutes;

        if (aptMinutes < currentMinutes) {
            acc.history.push({ ...apt, _minutes: aptMinutes });
        } else {
            acc.upcoming.push({ ...apt, _minutes: aptMinutes });
        }
        return acc;
    }, { history: [], upcoming: [] });

    // Sort
    history.sort((a, b) => b._minutes - a._minutes);
    upcoming.sort((a, b) => a._minutes - b._minutes);

    // --- 2. RENDER ---
    return (
        <SpotlightCard className="w-full h-full min-h-[600px] bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden flex flex-col justify-between relative">

            {/* WRAPPER SUPERIOR: Header + Contenido (Ocupa todo el espacio disponible) */}
            <div className="flex flex-col flex-1 min-h-0 bg-transparent">
                {/* A. HEADER */}
                <div className="flex items-center gap-4 p-8 pb-6 border-b border-transparent shrink-0">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-none">Flujo de Atención</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Control general del día</p>
                    </div>
                </div>

                {/* B. MAIN CONTENT (SPLIT VIEW) */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 bg-transparent">

                    {/* LEFT COL: HISTORY */}
                    <div className="flex flex-col h-full border-r border-slate-100/50 relative overflow-hidden bg-transparent">
                        <div className="px-8 py-4 bg-slate-50/30 border-y border-slate-100 shrink-0 flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historial</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                            {history.length > 0 ? (
                                history.map((apt) => (
                                    <div key={apt.id} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-transparent hover:bg-slate-100/50 transition-colors">
                                        <span className="text-sm font-bold text-slate-400 tabular-nums">{apt.time}</span>
                                        <div className="h-1 w-1 bg-slate-300 rounded-full" />
                                        <span className="text-sm font-semibold text-slate-500 line-through decoration-slate-300 truncate">{apt.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                                    <span className="text-sm italic">Sin historial hoy</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COL: UPCOMING */}
                    <div className="flex flex-col h-full relative overflow-hidden bg-transparent">
                        <div className="px-8 py-4 bg-white/30 backdrop-blur-sm border-y border-slate-100 shrink-0 flex items-center gap-2">
                            <ArrowRight className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Próximos</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {upcoming.length > 0 ? (
                                upcoming.map((apt) => (
                                    <motion.div
                                        key={apt.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group flex items-center gap-4 p-4 rounded-3xl bg-white/80 border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="h-12 w-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                            {apt.time}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-base font-bold text-slate-800 truncate">{apt.name}</p>
                                            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{apt.type}</p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
                                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-700">¡Agenda Libre!</p>
                                        <p className="text-xs text-slate-500">No hay más pacientes.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* C. FOOTER (FIXED AT BOTTOM via Flex Layout) */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-200/60 shrink-0 z-10 relative">
                <Button
                    variant="outline"
                    className="w-full h-14 bg-white hover:bg-white text-slate-700 hover:text-primary border-slate-200 hover:border-primary/30 rounded-2xl font-bold tracking-wide shadow-sm hover:shadow-md transition-all"
                >
                    VER AGENDA COMPLETA
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

        </SpotlightCard>
    );
}
