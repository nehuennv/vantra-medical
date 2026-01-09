import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MoreHorizontal, Filter, Plus, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { calComService } from '@/services/calComService';
import { mockPatients } from '@/data/mockPatients';

export function AgendaPage() {
    const [view, setView] = useState('day'); // 'day' | 'week'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, [currentDate, view]);

    const loadBookings = async () => {
        setIsLoading(true);
        // Calculate start/end based on view
        const start = new Date(currentDate);
        const end = new Date(currentDate);

        if (view === 'week') {
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            start.setDate(diff); // Monday
            end.setDate(diff + 6); // Sunday
        } else {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }

        try {
            const data = await calComService.getBookings(start, end);
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateDate = (direction) => {
        const newDate = new Date(currentDate);
        if (view === 'day') {
            newDate.setDate(newDate.getDate() + direction);
        } else {
            newDate.setDate(newDate.getDate() + (direction * 7));
        }
        setCurrentDate(newDate);
    };

    // Format Helpers
    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    };

    const getDayName = (date) => {
        return date.toLocaleDateString('es-AR', { weekday: 'long' });
    };

    // Generate time slots for display grid (08:00 - 20:00)
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
        <div className="h-full flex flex-col bg-slate-50/50 -m-4 sm:-m-6 lg:-m-8">

            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Agenda <span className="text-slate-400 font-normal">|</span> <span className="text-indigo-600 capitalize">{currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
                        </h1>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setView('day')}
                            className={cn("px-4 py-1.5 rounded-lg text-sm font-bold transition-all", view === 'day' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                        >
                            Día
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={cn("px-4 py-1.5 rounded-lg text-sm font-bold transition-all", view === 'week' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                        >
                            Semana
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm">
                        <button onClick={() => navigateDate(-1)} className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-l-xl border-r border-slate-100 transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                            Hoy
                        </button>
                        <button onClick={() => navigateDate(1)} className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-r-xl border-l border-slate-100 transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-xl font-bold h-10 gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo Turno
                    </Button>
                </div>
            </div>

            {/* Calendar Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">

                {/* DAY VIEW */}
                {view === 'day' && (
                    <div className="min-h-full bg-white relative">
                        {/* Day Header */}
                        <div className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 px-20 py-4 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full mb-1 uppercase tracking-wider">
                                    {getDayName(currentDate)}
                                </span>
                                <span className={cn(
                                    "text-4xl font-bold rounded-full h-14 w-14 flex items-center justify-center",
                                    currentDate.toDateString() === new Date().toDateString() ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-800"
                                )}>
                                    {currentDate.getDate()}
                                </span>
                            </div>
                        </div>

                        {/* Timeline Grid */}
                        <div className="relative py-8 px-8 max-w-5xl mx-auto">
                            {/* Current Time Line Indicator */}
                            {currentDate.toDateString() === new Date().toDateString() && (
                                <div
                                    className="absolute left-20 right-0 border-t-2 border-red-500 z-10 flex items-center"
                                    style={{ top: '34%' }} // Mock position for ~10:30 AM (approx calculation needed in real app)
                                >
                                    <div className="h-3 w-3 rounded-full bg-red-500 -ml-1.5" />
                                </div>
                            )}

                            {hours.map(hour => {
                                // Find bookings for this hour
                                const hourBookings = bookings.filter(b => {
                                    const d = new Date(b.startTime);
                                    return d.getHours() === hour && d.toDateString() === currentDate.toDateString();
                                });

                                return (
                                    <div key={hour} className="flex group min-h-[140px]">
                                        {/* Time Column */}
                                        <div className="w-20 pr-6 text-right relative">
                                            <span className="text-sm font-bold text-slate-400 -mt-2.5 block group-hover:text-indigo-500 transition-colors">
                                                {hour}:00
                                            </span>
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1 border-t border-slate-100 relative pb-4 group-hover:border-slate-200 transition-colors">
                                            {hourBookings.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-2 pt-2">
                                                    {hourBookings.map(booking => (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            key={booking.id}
                                                            className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 hover:shadow-md hover:border-indigo-200 hover:bg-white transition-all cursor-pointer flex justify-between items-start group/card relative overflow-hidden"
                                                        >
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                                            <div>
                                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                                    {booking.attendees[0].name}
                                                                    {mockPatients.find(p => p.name === booking.attendees[0].name) && (
                                                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200 uppercase font-black tracking-tighter">Paciente</span>
                                                                    )}
                                                                </h4>
                                                                <div className="flex items-center gap-4 mt-2">
                                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                                        <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                                                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                                        <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                                                                        Consultorio 1
                                                                    </div>
                                                                </div>
                                                                <div className="mt-3 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm text-xs font-medium text-slate-600">
                                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                    {booking.title}
                                                                </div>
                                                            </div>
                                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                                                <MoreHorizontal className="h-5 w-5" />
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="h-full w-full rounded-2xl border-2 border-dashed border-transparent group-hover:border-slate-100 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm">
                                                        <Plus className="h-4 w-4" /> Agregar Turno
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* WEEK VIEW */}
                {view === 'week' && (
                    <div className="min-h-full bg-white p-6">
                        <div className="flex h-full">
                            {/* Render 5-7 days columns here for Week view... simplified for brevity */}
                            <div className="flex-1 flex items-center justify-center text-slate-400">
                                <div className="text-center">
                                    <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-slate-200" />
                                    <h3 className="text-lg font-bold text-slate-600">Vista Semanal</h3>
                                    <p>Próximamente disponible en esta versión demo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
