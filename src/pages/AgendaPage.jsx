import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search,
    LayoutList, Kanban, FilterX, Clock, CheckCircle2, XCircle,
    MoreHorizontal, User, FileText, Phone, ArrowRight, Activity
} from 'lucide-react';
import { DndContext, useDraggable, useDroppable, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { calComService } from '@/services/calComService';

// --- HELPER UTIL ---
const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

// --- CONFIGURACIÓN DE ESTADOS (Mapeo Cal.com -> Kanban) ---
const STATUS_CONFIG = {
    PENDING: {
        id: 'PENDING', label: 'Pendiente', icon: Clock,
        color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500'
    },
    ACCEPTED: {
        id: 'ACCEPTED', label: 'Confirmado', icon: CheckCircle2,
        color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', bar: 'bg-indigo-500'
    },
    IN_PROGRESS: {
        id: 'IN_PROGRESS', label: 'En Consulta', icon: Activity,
        color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500'
    },
    CANCELLED: {
        id: 'CANCELLED', label: 'Cancelado', icon: XCircle,
        color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', bar: 'bg-slate-400'
    }
};

// --- COMPONENTES UI INTERNOS ---

// 1. Switch de Vistas (Lista vs Tablero)
const ViewToggle = ({ current, onChange }) => (
    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        {[
            { id: 'list', icon: LayoutList, label: 'Lista' },
            { id: 'kanban', icon: Kanban, label: 'Tablero' }
        ].map((view) => (
            <button
                key={view.id}
                onClick={() => onChange(view.id)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    current === view.id
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
            >
                <view.icon className="h-4 w-4" />
                {view.label}
            </button>
        ))}
    </div>
);

// 2. Tarjeta de Turno (Draggable)
const AppointmentCard = ({ booking, isOverlay }) => {
    const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: booking.id,
        data: booking
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "relative bg-white rounded-xl border p-4 shadow-sm transition-all group select-none",
                config.border,
                isOverlay ? "shadow-2xl scale-105 z-50 cursor-grabbing" : "hover:shadow-md cursor-grab",
                "flex flex-col gap-3"
            )}
        >
            {/* Barra lateral de color */}
            <div className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-full", config.bar)} />

            {/* Header: Hora y Status */}
            <div className="flex justify-between items-center pl-3">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {new Date(booking.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className={cn("p-1 rounded-full bg-white border", config.border)}>
                    <config.icon className={cn("h-3.5 w-3.5", config.color)} />
                </div>
            </div>

            {/* Info Paciente */}
            <div className="pl-3">
                <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">
                    {booking.attendees?.[0]?.name || "Paciente sin nombre"}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                    {booking.title || "Consulta General"}
                </p>
            </div>

            {/* Footer: Acciones rápidas (Visuales) */}
            <div className="pl-3 pt-2 border-t border-slate-50 flex gap-2 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-indigo-600 transition-colors">
                    <Phone className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-indigo-600 transition-colors">
                    <FileText className="h-3.5 w-3.5" />
                </button>
                <div className="flex-1" />
                <button className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center">
                    Ver Ficha <ArrowRight className="h-3 w-3 ml-1" />
                </button>
            </div>
        </div>
    );
};

// 3. Columna Kanban (Droppable)
const KanbanColumn = ({ id, title, count, children }) => {
    const { setNodeRef } = useDroppable({ id });
    const config = STATUS_CONFIG[id] || STATUS_CONFIG.PENDING;

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[280px] flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden">
            {/* Header Columna */}
            <div className="p-4 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", config.bg)}>
                        <config.icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">{title}</span>
                </div>
                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {count}
                </span>
            </div>

            {/* Área de Droppable */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                {children}
                {children.length === 0 && (
                    <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium italic">
                        Sin pacientes
                    </div>
                )}
            </div>
        </div>
    );
};

// --- PÁGINA PRINCIPAL ---

export function AgendaPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('kanban'); // 'list' | 'kanban'
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDragId, setActiveDragId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    // Sensores para Drag & Drop (Mouse y Touch)
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    // Cargar Turnos
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const start = new Date(currentDate); start.setHours(0, 0, 0, 0);
            const end = new Date(currentDate); end.setHours(23, 59, 59, 999);
            try {
                const data = await calComService.getBookings(start, end);
                // Mapeamos status de Cal.com a los nuestros si es necesario
                // Por defecto Cal usa ACCEPTED, PENDING, CANCELLED.
                // Podemos simular "IN_PROGRESS" localmente si quisiéramos.
                setBookings(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [currentDate]);

    // Filtrado
    const filteredBookings = useMemo(() => {
        return bookings.filter(b =>
            b.attendees?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bookings, searchTerm]);

    // Acción al Drop (Simulada para MVP)
    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragId(null);

        if (over && active.id !== over.id) {
            const newStatus = over.id;
            // Update local state AND persistent mock storage
            setBookings(prev => prev.map(b =>
                b.id === active.id ? { ...b, status: newStatus } : b
            ));
            // Actualizar en el servicio mock también para persistir el cambio
            calComService.updateBookingStatus?.(active.id, newStatus);
        }
    };

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
    };

    // Navegación Fecha
    const navigateDate = (days) => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + days);
        setCurrentDate(date);
    };

    // --- RENDERIZADO DEL MODAL (Detalle Premium) ---
    const DetailModal = () => (
        <AnimatePresence>
            {selectedBooking && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedBooking(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="h-32 bg-slate-900 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 opacity-90"></div>

                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full h-8 w-8 flex items-center justify-center transition-all z-20"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>

                            <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end gap-5 transform translate-y-6">
                                <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl relative z-10 ring-4 ring-white/10">
                                    <span className="text-3xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {selectedBooking.attendees?.[0]?.name?.charAt(0) || "P"}
                                    </span>
                                </div>
                                <div className="pb-6 text-white mb-2">
                                    <h2 className="text-2xl font-bold leading-none tracking-tight">
                                        {selectedBooking.attendees?.[0]?.name || "Paciente"}
                                    </h2>
                                    <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mt-1.5 opacity-80">
                                        {selectedBooking.title}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-8 pt-12 pb-8 space-y-8 bg-white">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5 group">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <CalendarIcon className="h-3 w-3" /> Fecha
                                    </label>
                                    <p className="font-bold text-slate-700 text-sm bg-slate-50/50 p-2.5 rounded-xl">
                                        {new Date(selectedBooking.startTime).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-1.5 group">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" /> Horario
                                    </label>
                                    <p className="font-bold text-slate-700 text-sm bg-slate-50/50 p-2.5 rounded-xl">
                                        {new Date(selectedBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="space-y-3 col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <FileText className="h-3 w-3" /> Motivo / Notas
                                    </label>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium min-h-[80px]">
                                        {selectedBooking.description || "Sin notas adicionales."}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-50">
                                <Button className="flex-1 bg-slate-900 text-white font-bold h-12 rounded-xl">
                                    <User className="h-4 w-4 mr-2" />
                                    Ver Ficha Completa
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="h-full flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
            {/* ... Header and other parts remain ... */}

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 min-h-0 relative">
                {/* ... existing loading logic ... */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    </div>
                )}

                {view === 'kanban' ? (
                    <DndContext sensors={sensors} onDragStart={(e) => setActiveDragId(e.active.id)} onDragEnd={handleDragEnd}>
                        <div className="h-full overflow-x-auto pb-4">
                            <div className="flex gap-4 h-full min-w-[1000px]">
                                <KanbanColumn id="PENDING" title="Por Confirmar" count={filteredBookings.filter(b => b.status === 'PENDING').length}>
                                    {filteredBookings.filter(b => b.status === 'PENDING').map(b => (
                                        <AppointmentCard key={b.id} booking={b} onViewDetails={() => handleViewDetails(b)} />
                                    ))}
                                </KanbanColumn>

                                <KanbanColumn id="ACCEPTED" title="Confirmados" count={filteredBookings.filter(b => b.status === 'ACCEPTED').length}>
                                    {filteredBookings.filter(b => b.status === 'ACCEPTED').map(b => (
                                        <AppointmentCard key={b.id} booking={b} onViewDetails={() => handleViewDetails(b)} />
                                    ))}
                                </KanbanColumn>

                                <KanbanColumn id="IN_PROGRESS" title="En Consulta" count={filteredBookings.filter(b => b.status === 'IN_PROGRESS').length}>
                                    {filteredBookings.filter(b => b.status === 'IN_PROGRESS').map(b => (
                                        <AppointmentCard key={b.id} booking={b} onViewDetails={() => handleViewDetails(b)} />
                                    ))}
                                </KanbanColumn>

                                <KanbanColumn id="CANCELLED" title="Finalizados" count={filteredBookings.filter(b => b.status === 'CANCELLED' || b.status === 'REJECTED').length}>
                                    {filteredBookings.filter(b => b.status === 'CANCELLED' || b.status === 'REJECTED').map(b => (
                                        <AppointmentCard key={b.id} booking={b} onViewDetails={() => handleViewDetails(b)} />
                                    ))}
                                </KanbanColumn>
                            </div>
                        </div>
                        <DragOverlay>
                            {activeDragId ? (
                                <AppointmentCard
                                    booking={bookings.find(b => b.id === activeDragId)}
                                    isOverlay
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    // VISTA DE LISTA
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} onClick={() => handleViewDetails(booking)} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer">
                                    <div className="col-span-2 font-mono text-sm font-bold text-slate-600">
                                        {new Date(booking.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="col-span-4">
                                        <div className="font-bold text-slate-800 text-sm">{booking.attendees?.[0]?.name}</div>
                                    </div>
                                    <div className="col-span-3">
                                        <span className="text-xs font-bold text-indigo-600">{booking.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <DetailModal />
        </div>
    );
}