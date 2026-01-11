import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Clock, ArrowRight, CalendarDays, Check, Copy, MoreHorizontal, Power, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DAYS = [
    { id: 'Monday', label: 'Lunes', short: 'LUN' },
    { id: 'Tuesday', label: 'Martes', short: 'MAR' },
    { id: 'Wednesday', label: 'Miércoles', short: 'MIE' },
    { id: 'Thursday', label: 'Jueves', short: 'JUE' },
    { id: 'Friday', label: 'Viernes', short: 'VIE' },
    { id: 'Saturday', label: 'Sábado', short: 'SAB' },
    { id: 'Sunday', label: 'Domingo', short: 'DOM' }
];

export function AvailabilityPage() {
    // 1. Estados
    const [schedule, setSchedule] = useState(
        DAYS.map(day => ({
            day: day.id,
            active: ['Saturday', 'Sunday'].includes(day.id) ? false : true,
            start: '09:00',
            end: '17:00'
        }))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [copiedDay, setCopiedDay] = useState(null);

    // 2. Handlers
    const handleToggleDay = (dayId) => {
        setSchedule(prev => prev.map(d =>
            d.day === dayId ? { ...d, active: !d.active } : d
        ));
        setSavedSuccess(false);
    };

    const handleChangeTime = (dayId, field, value) => {
        setSchedule(prev => prev.map(d =>
            d.day === dayId ? { ...d, [field]: value } : d
        ));
        setSavedSuccess(false);
    };

    const copyToAllDays = (sourceDay) => {
        const sourceFn = schedule.find(d => d.day === sourceDay);
        if (!sourceFn) return;

        setSchedule(prev => prev.map(d => ({
            ...d,
            active: true,
            start: sourceFn.start,
            end: sourceFn.end
        })));

        setCopiedDay(sourceDay);
        setTimeout(() => setCopiedDay(null), 2000);
        setSavedSuccess(false);
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };

    // 3. Render
    return (
        <div className="w-full max-w-[1200px] mx-auto space-y-8 pb-12 font-sans">

            {/* Header Moderno con Glassmorphism */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        Horarios
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Establezca su disponibilidad semanal estándar.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handleSave}
                        className={cn(
                            "min-w-[140px] h-12 shadow-lg transition-all duration-300 font-bold text-base rounded-xl",
                            savedSuccess
                                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:scale-105"
                        )}
                    >
                        {isLoading ? (
                            <Clock className="h-5 w-5 animate-spin mr-2" />
                        ) : savedSuccess ? (
                            <>
                                <Check className="h-5 w-5 mr-2" /> Guardado
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5 mr-2" /> Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden p-1"
            >
                <div className="grid grid-cols-1 divide-y divide-slate-100 bg-white/50 rounded-[2.3rem] overflow-hidden">
                    {DAYS.map((day, index) => {
                        const config = schedule.find(d => d.day === day.id);
                        const isActive = config.active;

                        return (
                            <div
                                key={day.id}
                                className={cn(
                                    "group p-6 transition-all duration-300 hover:bg-white/80",
                                    isActive ? "bg-white/40" : "bg-slate-50/30"
                                )}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-6">

                                    {/* Day Toggle & Label */}
                                    <div className="flex items-center gap-5 w-48 shrink-0">
                                        <button
                                            onClick={() => handleToggleDay(day.id)}
                                            className={cn(
                                                "relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out shadow-inner focus:outline-none focus:ring-4 focus:ring-primary/20",
                                                isActive ? "bg-primary" : "bg-slate-200"
                                            )}
                                        >
                                            <span className={cn(
                                                "absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center",
                                                isActive ? "translate-x-6" : "translate-x-0"
                                            )}>
                                                {isActive && <Power className="h-3 w-3 text-primary" />}
                                            </span>
                                        </button>

                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "font-bold text-base leading-none transition-colors",
                                                isActive ? "text-slate-800" : "text-slate-400"
                                            )}>
                                                {day.label}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">
                                                {isActive ? "DISPONIBLE" : "NO DISPONIBLE"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Time Intervals */}
                                    <div className="flex-1 min-h-[3.5rem] flex items-center">
                                        <AnimatePresence mode="wait">
                                            {isActive ? (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    className="flex flex-wrap items-center gap-3 w-full"
                                                >
                                                    <div className="flex items-center gap-3 bg-white p-2 pl-4 pr-2 rounded-2xl border border-slate-200 shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-primary" />
                                                            <input
                                                                type="time"
                                                                value={config.start}
                                                                onChange={(e) => handleChangeTime(day.id, 'start', e.target.value)}
                                                                className="bg-transparent font-bold text-slate-700 outline-none w-20 text-center hover:bg-slate-50 focus:bg-primary/5 rounded px-1 transition-colors cursor-pointer"
                                                            />
                                                        </div>
                                                        <ArrowRight className="h-4 w-4 text-slate-300" />
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="time"
                                                                value={config.end}
                                                                onChange={(e) => handleChangeTime(day.id, 'end', e.target.value)}
                                                                className="bg-transparent font-bold text-slate-700 outline-none w-20 text-center hover:bg-slate-50 focus:bg-primary/5 rounded px-1 transition-colors cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-slate-400 font-medium italic flex items-center gap-2"
                                                >
                                                    <CalendarDays className="h-4 w-4" /> No se aceptan turnos.
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Actions */}
                                    {isActive && (
                                        <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => copyToAllDays(day.id)}
                                                className="text-slate-400 hover:text-primary hover:bg-primary/10 h-8 text-xs font-semibold"
                                            >
                                                {copiedDay === day.id ? (
                                                    <span className="flex items-center text-emerald-600 animate-pulse">
                                                        <Check className="h-3 w-3 mr-1" /> Copiado
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <Copy className="h-3 w-3 mr-1" /> Copiar a todos
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

        </div>
    );
}

