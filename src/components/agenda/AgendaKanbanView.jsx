import React from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCorners } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, ArrowRight } from 'lucide-react';

// --- COMPONENTS LOCAL TO KANBAN ---

const AppointmentCardVisual = React.forwardRef(({ booking, isOverlay, onClick, style, statusConfig, glassStyle, ...props }, ref) => {
    const config = statusConfig[booking.status] || statusConfig.PENDING;
    const dateObj = new Date(booking.startTime);
    const timeFormatted = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const period = dateObj.getHours() >= 12 ? 'PM' : 'AM';

    return (
        <div
            ref={ref}
            style={style}
            onClick={onClick}
            className={cn(
                glassStyle,
                "relative p-3 rounded-2xl cursor-grab group select-none flex items-center gap-4 w-full",
                isOverlay && "shadow-2xl z-50 cursor-grabbing ring-2 ring-indigo-500/20 rotate-1 scale-105 bg-white"
            )}
            {...props}
        >
            {/* BOX DE HORA */}
            <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50/80 rounded-xl border border-white/60 shadow-inner flex-shrink-0">
                <span className="text-sm font-black text-slate-800 leading-none mb-0.5 tracking-tight">{timeFormatted}</span>
                <span className="text-[9px] font-bold text-slate-400 leading-none">{period}</span>
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-800 text-sm truncate pr-2 group-hover:text-indigo-700 transition-colors">
                        {booking.attendees?.[0]?.name || "Paciente"}
                    </h4>
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0 shadow-sm", config.bar)} />
                </div>

                <p className="text-[11px] text-slate-500 font-medium truncate mb-2">
                    {booking.title}
                </p>

                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider backdrop-blur-sm", config.bg, config.color, "border-white/50 shadow-sm")}>
                    {config.label}
                </span>
            </div>
        </div>
    );
});

const AppointmentCard = ({ booking, statusConfig, glassStyle, onViewDetails }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: booking.id, data: booking });
    const style = { opacity: isDragging ? 0.3 : 1, cursor: isDragging ? 'grabbing' : 'grab' };

    return (
        <AppointmentCardVisual
            ref={setNodeRef}
            style={style}
            booking={booking}
            statusConfig={statusConfig}
            glassStyle={glassStyle}
            onClick={onViewDetails}
            {...listeners}
            {...attributes}
        />
    );
};

const KanbanColumn = ({ id, title, count, children, statusConfig }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    const config = statusConfig[id] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col h-full rounded-3xl bg-slate-100/40 border border-white/40 p-2 transition-colors min-h-[400px] w-full min-w-[300px]",
                isOver && "bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-500/10"
            )}
        >
            <div className="p-2 mb-2 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg bg-white shadow-sm border border-white/60")}>
                        <Icon className={cn("h-3.5 w-3.5", config.color)} />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">{title}</span>
                </div>
                <span className="bg-white/80 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md border border-white/50 shadow-sm">{count}</span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar px-1 pb-2">
                {children}
            </div>
        </div>
    );
};

export function AgendaKanbanView({
    bookings,
    statusConfig,
    glassStyle,
    sensors,
    activeDragId,
    setActiveDragId,
    handleDragEnd,
    onViewDetails
}) {
    // Columns definition derived from status config or static list?
    // Using the static list from original file to maintain order
    const COLUMNS = [
        { id: 'PENDING', title: 'Por Confirmar' },
        { id: 'ACCEPTED', title: 'Confirmados' },
        { id: 'IN_PROGRESS', title: 'En Consulta' },
        { id: 'CANCELLED', title: 'Finalizados' }
    ];

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={(e) => setActiveDragId(e.active.id)} onDragEnd={handleDragEnd}>
            <div className="h-full w-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-2">
                <div className="flex gap-6 h-full min-w-[1200px] px-1">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="flex-1 min-w-[300px] h-full">
                            <KanbanColumn
                                id={col.id}
                                title={col.title}
                                count={bookings.filter(b => b.status === col.id).length}
                                statusConfig={statusConfig}
                            >
                                {bookings.filter(b => b.status === col.id).map(b => (
                                    <AppointmentCard
                                        key={b.id}
                                        booking={b}
                                        statusConfig={statusConfig}
                                        glassStyle={glassStyle}
                                        onViewDetails={() => onViewDetails(b)}
                                    />
                                ))}
                            </KanbanColumn>
                        </div>
                    ))}
                </div>
            </div>
            <DragOverlay dropAnimation={null}>
                {activeDragId ? (
                    <AppointmentCardVisual
                        booking={bookings.find(b => b.id === activeDragId)}
                        isOverlay
                        statusConfig={statusConfig}
                        glassStyle={glassStyle}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
