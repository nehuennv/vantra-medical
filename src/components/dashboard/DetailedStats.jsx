import React from 'react';
import { cn } from "@/lib/utils";
import { MessageCircle, Globe, Phone, Users, UserPlus, Umbrella } from "lucide-react";

export function DetailedStats({ stats }) {
    if (!stats) return null;

    return (
        <div className="rounded-[2rem] bg-white/60 border border-white/60 shadow-sm p-8 backdrop-blur-md flex flex-col gap-8 h-full">

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Análisis de Práctica</h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Últimos 30 días</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">

                {/* 1. Fuentes de Reserva */}
                <div className="flex flex-col justify-center space-y-4">
                    <p className="text-sm font-semibold text-slate-500 mb-2 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" /> Canales de Turnos
                    </p>
                    {stats.patientSources.map((source, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-slate-700">{source.label}</span>
                                <span className="text-slate-500">{source.value}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full", source.color)}
                                    style={{ width: `${source.value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Retención (Pie Chart Simulado / Doughnut) */}
                <div className="flex flex-col items-center justify-center relative border-x border-slate-100 px-4">
                    <p className="text-sm font-semibold text-slate-500 mb-4 flex items-center gap-2 w-full text-left md:text-center justify-center">
                        <Users className="h-4 w-4" /> Fidelización
                    </p>

                    <div className="relative h-28 w-28 flex items-center justify-center">
                        {/* Simulación visual de Pie Chart con bordes CSS */}
                        <div className="absolute inset-0 rounded-full border-[12px] border-indigo-500 opacity-20"></div>
                        <div
                            className="absolute inset-0 rounded-full border-[12px] border-indigo-500 border-l-transparent border-b-transparent transform -rotate-45"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
                        ></div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-slate-800">{stats.retention.recurringPatients}%</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Recurrentes</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span className="text-slate-600">Pacientes Fieles</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-100"></span>
                            <span className="text-slate-400">Nuevos</span>
                        </div>
                    </div>
                </div>

                {/* 3. Ausentismo / IA Insight */}
                <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold text-slate-500 mb-4 flex items-center gap-2">
                        <Umbrella className="h-4 w-4" /> Ausentismo
                    </p>

                    <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-3xl font-bold text-rose-600">{stats.noShowRate.rate}%</span>
                            <span className="text-xs text-rose-400 font-medium">No-Show Rate</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">
                            <span className="font-bold text-slate-700">IA Insight:</span> {stats.noShowRate.prediction}
                        </p>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 text-center">
                        4 citas rellenadas automáticamente esta semana.
                    </div>
                </div>

            </div>
        </div>
    );
}
