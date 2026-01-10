import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search,
    LayoutList, Kanban, FilterX, Clock, CheckCircle2, XCircle,
    MoreHorizontal, User, FileText, Phone, ArrowRight, Activity
} from 'lucide-react';
import { DndContext, useDraggable, useDroppable, DragOverlay, useSensor, useSensors, PointerSensor, closestCorners } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { calComService } from '@/services/calComService';
import { AppointmentDetailModal } from '@/components/agenda/AppointmentDetailModal';

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
        color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200', bar: 'bg-amber-500' // Darker bg for contrast
    },
    ACCEPTED: {
        id: 'ACCEPTED', label: 'Confirmado', icon: CheckCircle2,
        color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200', bar: 'bg-indigo-500' // Darker bg
    },
    IN_PROGRESS: {
        id: 'IN_PROGRESS', label: 'En Consulta', icon: Activity,
        color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', bar: 'bg-emerald-500'
    },
    CANCELLED: {
        id: 'CANCELLED', label: 'Cancelado', icon: XCircle,
        color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', bar: 'bg-slate-400'
    }
};

// --- COMPONENTES UI INTERNOS ---

// 1. Switch de Vistas (Lista vs Tablero)
const ViewToggle = ({ current, onChange }) => (
    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 h-10 w-fit">
        {[
            { id: 'list', icon: LayoutList, label: 'Lista' },
            { id: 'kanban', icon: Kanban, label: 'Tablero' }
        ].map((view) => (
            <button
                key={view.id}
                onClick={() => onChange(view.id)}
                className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    current === view.id
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
            >
                <view.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{view.label}</span>
            </button>
        ))}
    </div>
);

// 2. Componente Visual (UI Pura) - Estilo High Contrast & Responsive
const AppointmentCardVisual = React.forwardRef(({ booking, isOverlay, onClick, style, ...props }, ref) => {
    const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
    const dateObj = new Date(booking.startTime);
    // Manual strict formatting for stability
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const timeFormatted = `${hours}:${minutes}`;
    const period = dateObj.getHours() >= 12 ? 'PM' : 'AM';

    return (
        <div
            ref={ref}
            style={style}
            onClick={onClick}
            className={cn(
                "relative p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 cursor-grab group select-none flex items-center gap-4 hover:shadow-md hover:border-indigo-300",
                isOverlay
                    ? "shadow-2xl z-50 cursor-grabbing ring-1 ring-slate-900/10 rotate-1 scale-105"
                    : ""
            )}
            {...props}
        >
            {/* Time Box - Widened to prevent collapse */}
            <div className="flex flex-col items-center justify-center w-16 h-14 bg-slate-100 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
                <span className="text-sm font-black text-slate-800 leading-none mb-0.5 tracking-tight">{timeFormatted}</span>
                <span className="text-[10px] font-bold text-slate-500 leading-none">{period}</span>
            </div>

            {/* Info Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate leading-tight pr-2">
                        {booking.attendees?.[0]?.name || "Paciente"}
                    </h4>
                    {/* Status Dot */}
                    <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", config.bar)} title={config.label} />
                </div>

                <p className="text-xs text-slate-500 font-medium truncate mb-2">
                    {booking.title}
                </p>

                {/* Footer Badges */}
                <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider", config.bg, config.color, config.border)}>
                        {config.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        PARTICULAR
                    </span>
                </div>
            </div>
        </div>
    );
});

// 2.1 Wrapper Funcional (Lógica D&D)
const AppointmentCard = ({ booking, onViewDetails }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: booking.id,
        data: booking
    });

    const style = {
        opacity: isDragging ? 0.3 : 1, // Ghost styling handled by overlay usually
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <AppointmentCardVisual
            ref={setNodeRef}
            style={style}
            booking={booking}
            onClick={onViewDetails}
            {...listeners}
            {...attributes}
        />
    );
};

// 3. Columna Kanban (Responsive & Contrast)
const KanbanColumn = ({ id, title, count, children, loading }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    const config = STATUS_CONFIG[id] || STATUS_CONFIG.PENDING;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col h-full rounded-2xl bg-slate-50/80 border border-slate-200/60 p-1 transition-colors min-h-[400px]",
                isOver ? "bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-500/10" : ""
            )}
        >
            {/* Header Columna */}
            <div className="p-3 mb-2 flex justify-between items-center bg-white/50 rounded-xl border border-slate-100/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg border shadow-sm bg-white", config.border)}>
                        <config.icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{title}</span>
                </div>
                <span className="bg-white text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                    {count}
                </span>
            </div>

            {/* Droppable Area */}
            <div className="flex-1 p-2 space-y-3 overflow-y-auto custom-scrollbar">
                {children}
                {!loading && React.Children.count(children) === 0 && (
                    <div className="h-40 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 m-1">
                        <span className="text-xs font-semibold opacity-60">Sin turnos</span>
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

    // Sensores
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    // Cargar Turnos
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setBookings([]);

            const start = new Date(currentDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(currentDate);
            end.setHours(23, 59, 59, 999);

            try {
                const rawData = await calComService.getBookings(start, end);
                const sanitizedData = rawData.reduce((acc, booking) => {
                    if (!booking || !booking.startTime) return acc;

                    let status = 'PENDING';
                    const apiStatus = booking.status?.toUpperCase();
                    if (apiStatus === 'ACCEPTED') status = 'ACCEPTED';
                    else if (apiStatus === 'PENDING') status = 'PENDING';
                    else if (apiStatus === 'IN_PROGRESS') status = 'IN_PROGRESS';
                    else if (['CANCELLED', 'REJECTED'].includes(apiStatus)) status = 'CANCELLED';

                    acc.push({
                        ...booking,
                        status,
                        attendees: booking.attendees?.length > 0 ? booking.attendees : [{ name: 'Paciente Desconocido' }],
                        startTime: new Date(booking.startTime).toISOString(),
                        title: booking.title || 'Consulta',
                    });
                    return acc;
                }, []);
                setBookings(sanitizedData);
            } catch (e) {
                console.error(e);
                setBookings([]);
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

    // D&D Handlers
    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragId(null);
        if (!over) return;
        const bookingId = active.id;
        const newStatus = over.id;
        const currentBooking = bookings.find(b => b.id === bookingId);
        if (currentBooking && currentBooking.status !== newStatus) {
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));
            calComService.updateBookingStatus?.(bookingId, newStatus);
        }
    };

    const handleViewDetails = (booking) => setSelectedBooking(booking);

    const navigateDate = (days) => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + days);
        setCurrentDate(date);
    };




    return (
        <div className="h-full p-4 lg:p-8 max-w-[1920px] mx-auto flex flex-col gap-6">
            {/* HEADER RESPONSIVE */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white border border-slate-200 shadow-sm rounded-3xl p-4 lg:p-5 flex-shrink-0">
                {/* 1. Date Nav */}
                <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar">
                    <Button variant="outline" size="icon" onClick={() => navigateDate(-1)} className="rounded-full flex-shrink-0 h-10 w-10 border-slate-200">
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </Button>

                    <div className="flex-1 xl:min-w-[200px] text-center px-4 whitespace-nowrap">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {currentDate.getFullYear()}
                        </span>
                        <div className="flex items-center justify-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-indigo-500 hidden sm:block" />
                            <span className="text-lg font-black text-slate-800 capitalize leading-none">
                                {currentDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" size="icon" onClick={() => navigateDate(1)} className="rounded-full flex-shrink-0 h-10 w-10 border-slate-200">
                        <ChevronRight className="h-5 w-5 text-slate-600" />
                    </Button>

                    {!isSameDay(currentDate, new Date()) && (
                        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="ml-2 rounded-full text-indigo-600 bg-indigo-50 font-bold whitespace-nowrap">
                            Hoy
                        </Button>
                    )}
                </div>

                {/* 2. Tools */}
                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                    </div>
                    <ViewToggle current={view} onChange={setView} />
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 min-h-0 relative">
                {view === 'kanban' ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={(e) => setActiveDragId(e.active.id)}
                        onDragEnd={handleDragEnd}
                    >
                        {/* GRID RESPONSIVE: 1 Col Mobile -> 2 Col Tablet -> 4 Col Desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full overflow-y-auto pb-20 px-1 custom-scrollbar">
                            {[
                                { id: 'PENDING', title: 'Por Confirmar' },
                                { id: 'ACCEPTED', title: 'Confirmados' },
                                { id: 'IN_PROGRESS', title: 'En Consulta' },
                                { id: 'CANCELLED', title: 'Finalizados' }
                            ].map(column => (
                                <KanbanColumn
                                    key={column.id}
                                    id={column.id}
                                    title={column.title}
                                    count={loading ? '...' : filteredBookings.filter(b => b.status === column.id).length}
                                    loading={loading}
                                >
                                    {loading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
                                        ))
                                    ) : (
                                        filteredBookings
                                            .filter(b => b.status === column.id)
                                            .map(b => (
                                                <AppointmentCard key={b.id} booking={b} onViewDetails={() => handleViewDetails(b)} />
                                            ))
                                    )}
                                </KanbanColumn>
                            ))}
                        </div>
                        <DragOverlay dropAnimation={null}>
                            {activeDragId ? (
                                <AppointmentCardVisual
                                    booking={bookings.find(b => b.id === activeDragId)}
                                    isOverlay
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden h-full flex flex-col">
                        {/* List Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                            <div className="col-span-2 sm:col-span-1">Hora</div>
                            <div className="col-span-6 sm:col-span-4">Paciente</div>
                            <div className="hidden md:block md:col-span-3">Motivo de Consulta</div>
                            <div className="col-span-4 sm:col-span-2">Estado</div>
                            <div className="hidden sm:block sm:col-span-2 text-right">Acciones</div>
                        </div>

                        {/* List Rows */}
                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {filteredBookings.map((booking) => {
                                const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
                                const dateObj = new Date(booking.startTime);
                                const timeFormatted = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

                                return (
                                    <motion.div
                                        key={booking.id}
                                        onClick={() => handleViewDetails(booking)}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                                        className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-slate-50 hover:border-slate-100 transition-all cursor-pointer items-center rounded-xl group"
                                    >
                                        {/* Time */}
                                        <div className="col-span-2 sm:col-span-1">
                                            <span className="font-black text-slate-700 text-sm">{timeFormatted}</span>
                                        </div>

                                        {/* Patient */}
                                        <div className="col-span-6 sm:col-span-4 flex items-center gap-3">
                                            <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0", config.bar)}>
                                                {booking.attendees?.[0]?.name?.charAt(0) || "P"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-sm truncate">{booking.attendees[0].name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100/50">PARTICULAR</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reason (Desktop) */}
                                        <div className="hidden md:block md:col-span-3 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                                                    <FileText className="h-3.5 w-3.5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-700 truncate">{booking.title}</p>
                                                    <p className="text-[11px] text-slate-400 truncate">{booking.description || "Sin observaciones"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-4 sm:col-span-2">
                                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border max-w-full truncate", config.bg, config.color, config.border)}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.bar)} />
                                                {config.label}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="hidden sm:block sm:col-span-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600">
                                                <span className="text-xs font-bold mr-2">Ver Detalles</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <AppointmentDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
        </div>
    );
}