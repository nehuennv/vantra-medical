import React from 'react';
import { MoreHorizontal, CheckCircle2, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function AgendaWidget({ appointments }) {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="group rounded-[2rem] bg-white/50 border border-white/60 shadow-sm p-6 backdrop-blur-sm h-full flex flex-col min-h-[350px] transition-all duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-[15deg]">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 leading-none">Agenda Express</h3>
                        <p className="text-sm text-slate-500 mt-1">Próximos pacientes hoy.</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50 text-slate-400">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar"
            >
                {appointments.map((apt) => (
                    <motion.div
                        variants={itemVariants}
                        key={apt.id}
                        className="group flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 hover:translate-x-1 hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer"
                    >
                        {/* Hora */}
                        <div className="flex flex-col items-center justify-center min-w-[3.5rem] bg-white rounded-xl h-14 border border-slate-100 shadow-sm transition-transform duration-200 group-hover:scale-105">
                            <span className="text-sm font-bold text-slate-700">{apt.time}</span>
                            <span className="text-[10px] text-slate-400 font-medium">AM</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-slate-800 truncate">{apt.name}</h4>
                                {apt.status === 'confirmed' && (
                                    <div title="Confirmado por IA">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </div>
                                )}
                                {apt.status === 'pending' && (
                                    <div title="Pendiente de confirmación">
                                        <Clock className="h-4 w-4 text-amber-400" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{apt.type}</p>
                        </div>

                        {/* Actions */}
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary font-medium text-xs bg-primary/5 hover:bg-primary/10 rounded-lg">
                            Ver Ficha
                        </Button>
                    </motion.div>
                ))}
            </motion.div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <Button
                    className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 shadow-sm rounded-xl transition-all duration-200"
                    variant="outline"
                >
                    Ver Agenda Completa
                </Button>
            </div>
        </motion.div>
    );
}
