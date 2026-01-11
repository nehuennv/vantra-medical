import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search,
    LayoutList, Kanban, Clock, CheckCircle2, XCircle, CalendarX, Plus,
    Activity
} from 'lucide-react';
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core'; // Only sensors needed? No, sensors were for DndContext. AgendaKanbanView needs sensors?
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentDetailModal } from '@/components/agenda/AppointmentDetailModal';
import { AgendaKanbanView } from '@/components/agenda/AgendaKanbanView';
import { AgendaListView } from '@/components/agenda/AgendaListView';

// --- HELPERS ---
const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

// Estilos de estado unificados
const STATUS_CONFIG = {
    PENDING: { id: 'PENDING', label: 'Pendiente', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' },
    ACCEPTED: { id: 'ACCEPTED', label: 'Confirmado', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50', bar: 'bg-indigo-500' },
    IN_PROGRESS: { id: 'IN_PROGRESS', label: 'En Consulta', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
    CANCELLED: { id: 'CANCELLED', label: 'Cancelado', icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-50', bar: 'bg-slate-400' }
};

// --- ESTILOS REUTILIZABLES (GLASSMORPHISM) ---
// Clave: border-white/60 para el efecto "borde de luz" y backdrop-blur
const GLASS_CARD_STYLE = "bg-white/80 hover:bg-white backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-all duration-300";
const GLASS_CONTAINER_STYLE = "bg-slate-100/50 backdrop-blur-xl border border-white/50 shadow-inner";

// --- UI COMPONENTS ---

const ViewToggle = ({ current, onChange }) => (
    <div className="flex bg-white/50 p-1 rounded-xl border border-white/60 shadow-sm h-10 w-fit shrink-0 backdrop-blur-sm">
        {[{ id: 'list', icon: LayoutList, label: 'Lista' }, { id: 'kanban', icon: Kanban, label: 'Tablero' }].map((view) => (
            <button
                key={view.id}
                onClick={() => onChange(view.id)}
                className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                    current === view.id
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                )}
            >
                <view.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{view.label}</span>
            </button>
        ))}
    </div>
);

// --- SKELETON ALTO CONTRASTE ---
const AgendaSkeleton = ({ view, isStatic = false }) => {
    // Si es estático (fondo vacío), se ve sólido. Si carga, pulsa.
    const animClass = isStatic ? "" : "animate-pulse";
    const opacityClass = isStatic ? "opacity-30 grayscale" : "opacity-100";

    // Usamos bg-gray-200 para que SE VEA BIEN la forma
    const blockColor = "bg-gray-200";

    return (
        <div className={cn("h-full w-full pointer-events-none select-none p-1 transition-opacity duration-500", opacityClass)}>
            {view === 'kanban' ? (
                <div className="flex gap-6 h-full min-w-[1200px]">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-1 min-w-[300px] h-full flex flex-col gap-4 rounded-2xl p-4 border-2 border-dashed border-slate-300/50 bg-slate-50/50">
                            {/* Header Column Fake */}
                            <div className={cn("flex justify-between items-center mb-2", animClass)}>
                                <div className={`h-6 w-32 ${blockColor} rounded-md`} />
                                <div className={`h-6 w-8 ${blockColor} rounded-md`} />
                            </div>
                            {/* Cards Fake */}
                            <div className={cn("space-y-4", animClass)}>
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="h-32 bg-white rounded-2xl border border-white shadow-sm" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full w-full bg-white/60 rounded-3xl border border-white shadow-sm overflow-hidden flex flex-col">
                    <div className="h-12 border-b border-slate-100 bg-white/40 w-full" />
                    <div className={cn("p-4 space-y-3", animClass)}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={`h-16 w-full ${blockColor} rounded-xl opacity-50`} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- EMPTY STATE CARD (Glass Premium) ---
const EmptyStateCard = ({ date, onCreate }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="absolute inset-0 z-10 flex items-center justify-center p-4"
    >
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 shadow-2xl rounded-[2.5rem] p-10 max-w-sm w-full text-center relative overflow-hidden ring-1 ring-white">
            <div className="mx-auto h-20 w-20 bg-indigo-50/80 rounded-full flex items-center justify-center mb-6 text-indigo-500 shadow-inner ring-1 ring-indigo-100">
                <CalendarX className="h-9 w-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Agenda Libre</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                No hay pacientes para el <br />
                <span className="text-indigo-600 font-bold text-base">{date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' })}</span>.
            </p>

            <Button onClick={onCreate} className="w-full bg-indigo-600 text-white hover:bg-indigo-700 h-12 rounded-xl font-bold shadow-xl shadow-indigo-200/50 transition-transform hover:scale-[1.02]">
                <Plus className="h-5 w-5 mr-2" />
                Agendar Turno
            </Button>
        </div>
    </motion.div>
);

// --- MAIN PAGE ---

export function AgendaPage() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('kanban');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDragId, setActiveDragId] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const { bookings, loading, updateStatus } = useAppointments(currentDate);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const filteredBookings = useMemo(() => bookings.filter(b =>
        b.attendees?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [bookings, searchTerm]);

    const handleDragEnd = ({ active, over }) => {
        setActiveDragId(null);
        if (!over) return;
        const current = bookings.find(b => b.id === active.id);
        if (current && current.status !== over.id) updateStatus(active.id, over.id);
    };

    const navigateDate = (days) => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + days);
        setCurrentDate(date);
    };

    return (
        // FONDO BASE DE LA PÁGINA: Gris muy suave para que el Glass resalte (IMPORTANTE)
        <div className="h-full w-full flex flex-col gap-6 overflow-hidden bg-slate-50/50">

            {/* Header Fijo (Glass) */}
            <div className="w-full flex-shrink-0 flex flex-col xl:flex-row gap-4 justify-between items-center bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-3xl p-4 z-20">
                <div className="flex items-center justify-center gap-3 w-full xl:w-auto">
                    <Button variant="outline" size="icon" onClick={() => navigateDate(-1)} className="rounded-full flex-shrink-0 h-10 w-10 border-slate-200 hover:bg-white"><ChevronLeft className="h-5 w-5 text-slate-600" /></Button>
                    <div className="w-[280px] text-center flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{currentDate.getFullYear()}</span>
                        <div className="flex items-center justify-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-indigo-600 hidden sm:block" />
                            <span className="text-lg font-black text-slate-800 capitalize leading-none whitespace-nowrap">{currentDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => navigateDate(1)} className="rounded-full flex-shrink-0 h-10 w-10 border-slate-200 hover:bg-white"><ChevronRight className="h-5 w-5 text-slate-600" /></Button>
                    {!isSameDay(currentDate, new Date()) && <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="ml-2 rounded-full text-indigo-600 bg-indigo-50 font-bold h-9 hover:bg-indigo-100">Hoy</Button>}
                </div>
                <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Buscar paciente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
                    </div>
                    <ViewToggle current={view} onChange={setView} />
                </div>
            </div>

            {/* Contenido Dinámico */}
            <div className="flex-1 min-h-0 w-full relative overflow-hidden">

                {/* 1. LAYER BASE (Skeleton Estático) - Siempre visible si no hay datos */}
                {(loading || bookings.length === 0) && (
                    <div className="absolute inset-0 z-0">
                        <AgendaSkeleton view={view} isStatic={!loading} />
                    </div>
                )}

                {/* 2. OVERLAY (Empty State Card) */}
                <AnimatePresence>
                    {!loading && bookings.length === 0 && (
                        <EmptyStateCard date={currentDate} onCreate={() => navigate('/nuevo-turno', { state: { preSelectedDate: currentDate.toISOString() } })} />
                    )}
                </AnimatePresence>

                {/* 3. CONTENIDO REAL */}
                <AnimatePresence mode="wait">
                    {!loading && bookings.length > 0 && (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full w-full relative z-10"
                        >
                            {view === 'kanban' ? (
                                <AgendaKanbanView
                                    bookings={filteredBookings}
                                    statusConfig={STATUS_CONFIG}
                                    glassStyle={GLASS_CARD_STYLE}
                                    sensors={sensors}
                                    activeDragId={activeDragId}
                                    setActiveDragId={setActiveDragId}
                                    handleDragEnd={handleDragEnd}
                                    onViewDetails={(b) => { setSelectedBooking(b); setDetailModalOpen(true); }}
                                />
                            ) : (
                                <AgendaListView
                                    bookings={filteredBookings}
                                    statusConfig={STATUS_CONFIG}
                                    glassContainerStyle={GLASS_CONTAINER_STYLE}
                                    glassCardStyle={GLASS_CARD_STYLE}
                                    onViewDetails={(b) => { setSelectedBooking(b); setDetailModalOpen(true); }}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AppointmentDetailModal isOpen={detailModalOpen} booking={selectedBooking} onClose={() => setDetailModalOpen(false)} />
        </div>
    );
}