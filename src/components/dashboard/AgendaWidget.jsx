import React from 'react';
import { MoreHorizontal, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgendaWidget({ appointments }) {

    return (
        <div className="rounded-[2rem] bg-white/50 border border-white/60 shadow-sm p-6 backdrop-blur-sm h-full flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Agenda Express</h3>
                    <p className="text-sm text-slate-500">Próximos pacientes hoy.</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50 text-slate-400">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {appointments.map((apt) => (
                    <div key={apt.id} className="group flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-white/60 border border-transparent hover:border-white/50">
                        {/* Hora */}
                        <div className="flex flex-col items-center justify-center min-w-[3.5rem] bg-white rounded-xl h-14 border border-slate-100 shadow-sm">
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
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-lg shadow-slate-200" size="sm">
                    Ver Agenda Completa
                </Button>
            </div>
        </div>
    );
}
