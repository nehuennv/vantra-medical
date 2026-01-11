import React from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCorners } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, Activity, XCircle, FileText } from 'lucide-react';

// --- SUB-COMPONENTES VISUALES ---

// 1. La Tarjeta Visual (Ahora resalta más sobre el fondo gris de la columna)
const AppointmentCardVisual = React.forwardRef(({ booking, isOverlay, onClick, style, statusConfig, ...props }, ref) => {
    const config = statusConfig?.[booking.status] || {
        color: 'text-slate-600', bg: 'bg-slate-100', bar: 'bg-slate-400', border: 'border-slate-200'
    };

    const dateObj = new Date(booking.startTime);
    const timeFormatted = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const period = dateObj.getHours() >= 12 ? 'PM' : 'AM';

    return (
        <div
            ref={ref}
            style={style}
            onClick={onClick}
            className={cn(
                // BASE: Tarjeta Blanca Sólida sobre fondo gris
                "relative group w-full p-3.5 rounded-2xl cursor-grab select-none flex items-center gap-4 transition-all duration-200 ease-out",
                "bg-white shadow-sm hover:shadow-md", // Blanco puro para máximo contraste
                "border border-slate-200 hover:border-primary/50", // Borde sutil que se pinta al hover
                "hover:-translate-y-0.5", // Micro-movimiento sutil
                isOverlay && "shadow-2xl shadow-primary/20 ring-2 ring-primary/20 rotate-2 scale-105 z-50 cursor-grabbing"
            )}
            {...props}
        >
            {/* BOX DE HORA */}
            <div className="flex flex-col items-center justify-center w-14 h-14 bg-primary/10 rounded-xl border border-primary/20 text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="text-sm font-black leading-none tracking-tight">{timeFormatted}</span>
                <span className="text-[9px] font-bold text-primary/60 leading-none mt-0.5">{period}</span>
            </div>

            {/* INFO CONTENT */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Header: Nombre + Status Dot */}
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm truncate pr-2 group-hover:text-primary transition-colors">
                        {booking.attendees?.[0]?.name || "Paciente"}
                    </h4>
                    {/* Status Dot */}
                    <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", config.bar)} />
                </div>

                {/* Motivo de Consulta */}
                <div className="flex items-center gap-1.5 text-slate-500">
                    <FileText className="h-3 w-3 opacity-50" />
                    <p className="text-[11px] font-medium truncate">
                        {booking.title || "Consulta General"}
                    </p>
                </div>

                {/* Badges Footer */}
                <div className="flex items-center gap-2 mt-1">
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider", config.bg, config.color, config.border)}>
                        {config.label}
                    </span>
                </div>
            </div>
        </div>
    );
});

// 2. Wrapper Lógico
const AppointmentCard = ({ booking, statusConfig, onViewDetails }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: booking.id, data: booking });

    const style = {
        opacity: isDragging ? 0.3 : 1,
        cursor: isDragging ? 'grabbing' : 'grab'
    };

    return (
        <AppointmentCardVisual
            ref={setNodeRef}
            style={style}
            booking={booking}
            statusConfig={statusConfig}
            onClick={onViewDetails}
            {...listeners}
            {...attributes}
        />
    );
};

// 3. Columna del Tablero (AQUÍ ESTÁ EL CAMBIO DE CONTRASTE)
const KanbanColumn = ({ id, title, count, children, statusConfig }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    const config = statusConfig?.[id] || statusConfig?.PENDING;
    const Icon = config?.icon || Clock;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col h-full rounded-3xl p-3 transition-colors duration-300 min-h-[400px] w-full min-w-[320px]",
                // CAMBIO: Glassmorphism optimizado
                "bg-white/40 backdrop-blur-xl border border-white/50 shadow-sm shadow-slate-200/20",
                // Hover drop zone
                isOver ? "bg-primary/5 border-primary/20 ring-2 ring-primary/10" : ""
            )}
        >
            {/* Header de Columna */}
            <div className="px-2 py-3 mb-2 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl shadow-sm bg-white border border-slate-200", config.color)}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm tracking-tight uppercase">{title}</span>
                </div>
                <span className="bg-white text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                    {count}
                </span>
            </div>

            {/* Area de Drop */}
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar px-1 pt-2 pb-4">
                {children}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export function AgendaKanbanView({
    bookings,
    statusConfig,
    sensors,
    activeDragId,
    setActiveDragId,
    handleDragEnd,
    onViewDetails
}) {
    const COLUMNS = [
        { id: 'PENDING', title: 'Por Confirmar' },
        { id: 'ACCEPTED', title: 'Confirmados' },
        { id: 'IN_PROGRESS', title: 'En Consulta' },
        { id: 'CANCELLED', title: 'Finalizados' }
    ];

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e) => setActiveDragId(e.active.id)}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full w-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-4 pl-1">
                <div className="flex gap-6 h-full min-w-[1200px] pr-4">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="flex-1 min-w-[300px] h-full">
                            <KanbanColumn
                                id={col.id}
                                title={col.title}
                                count={bookings.filter(b => b.status === col.id).length}
                                statusConfig={statusConfig}
                            >
                                {bookings
                                    .filter(b => b.status === col.id)
                                    .map(b => (
                                        <AppointmentCard
                                            key={b.id}
                                            booking={b}
                                            statusConfig={statusConfig}
                                            onViewDetails={() => onViewDetails(b)}
                                        />
                                    ))}
                            </KanbanColumn>
                        </div>
                    ))}
                </div>
            </div>

            <DragOverlay dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
                {activeDragId ? (
                    <AppointmentCardVisual
                        booking={bookings.find(b => b.id === activeDragId)}
                        isOverlay
                        statusConfig={statusConfig}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}