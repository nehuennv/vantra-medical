import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, ArrowRight, FileText } from 'lucide-react';

export function AgendaListView({
    bookings,
    statusConfig,
    glassContainerStyle,
    glassCardStyle,
    onViewDetails
}) {
    return (
        <div className={cn("flex flex-col h-full w-full rounded-3xl overflow-hidden", glassContainerStyle, "bg-white/40")}>
            <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full bg-white/60 backdrop-blur-md border-b border-white/50">
                <div className="col-span-2 sm:col-span-1 text-center">Hora</div>
                <div className="col-span-5 sm:col-span-4 pl-2">Paciente</div>
                <div className="hidden md:block md:col-span-3">Detalle</div>
                <div className="col-span-3 sm:col-span-2">Estado</div>
                <div className="hidden sm:block sm:col-span-2 text-right pr-2">Acciones</div>
            </div>
            <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-2 custom-scrollbar pt-2">
                <AnimatePresence>
                    {bookings.map((booking, index) => {
                        const config = statusConfig[booking.status] || statusConfig.PENDING;
                        const dateObj = new Date(booking.startTime);
                        return (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                onClick={() => onViewDetails(booking)}
                                className="group relative grid grid-cols-12 gap-4 items-center p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 cursor-pointer hover:border-transparent z-0 hover:z-10"
                            >
                                <div className="col-span-2 sm:col-span-1 flex justify-center">
                                    <div className="text-slate-900 font-black text-sm text-center leading-tight">
                                        {dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </div>
                                </div>
                                <div className="col-span-5 sm:col-span-4 flex items-center gap-4 pl-2">
                                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-sm ring-2 ring-white transition-transform group-hover:scale-105", config.bar)}>
                                        {booking.attendees?.[0]?.name?.charAt(0) || "P"}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-slate-800 text-sm truncate group-hover:text-primary">
                                            {booking.attendees?.[0]?.name || "Paciente"}
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Particular</span>
                                    </div>
                                </div>
                                <div className="hidden md:block md:col-span-3 min-w-0">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <FileText className="h-3.5 w-3.5" />
                                        <span className="text-xs truncate">{booking.title}</span>
                                    </div>
                                </div>
                                <div className="col-span-3 sm:col-span-2">
                                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm", config.bg, config.color, "border-white/50 shadow-sm")}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", config.bar)} /> {config.label}
                                    </span>
                                </div>
                                <div className="hidden sm:flex sm:col-span-2 justify-end items-center gap-2 opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:text-primary hover:bg-white/50">
                                        <Phone className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button size="sm" className="h-8 rounded-full bg-primary text-white hover:bg-primary/90 text-xs px-3 shadow-md">
                                        Ver <ArrowRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
