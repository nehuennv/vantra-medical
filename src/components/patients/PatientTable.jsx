import React from 'react';
import { Eye, MessageCircle, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, calculateAge, getAvatarColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.02
        }
    }
};

// MEMOIZED ROW FOR MAXIMUM PERFORMANCE
// This component prevents re-renders if props don't change and removes overhead of Tooltips/Motion
const PatientRow = React.memo(({ patient, onClick }) => {
    return (
        <tr
            onClick={() => onClick(patient)}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(patient);
                }
            }}
            // CSS Native Transition for Hover - Zero Lag
            className="group transition-colors duration-200 cursor-pointer hover:bg-slate-100 border-b border-indigo-100/40 last:border-none focus:outline-none focus:bg-slate-50 focus:ring-2 focus:ring-inset focus:ring-primary/20"
        >
            {/* Paciente */}
            <td className="px-6 py-4 pl-8">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white",
                        getAvatarColor(patient.name)
                    )}>
                        {patient.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                        <p className="text-xs text-slate-500">{patient.contact.email}</p>
                    </div>
                </div>
            </td>

            {/* Identificación */}
            <td className="px-6 py-4">
                <div>
                    <p className="text-sm font-bold text-slate-800">
                        {patient.dni || '-'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wide">
                        {calculateAge(patient.birthDate)} AÑOS
                    </p>
                </div>
            </td>

            {/* Cobertura */}
            <td className="px-6 py-4">
                {patient.insurance === 'Particular' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100/50">
                        Particular
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50">
                        {patient.insurance || 'Sin Cobertura'}
                    </span>
                )}
            </td>

            {/* Última Visita */}
            <td className="px-6 py-4">
                {patient.last_visit ? (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                            {new Date(patient.last_visit).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                            Hace {Math.floor((new Date() - new Date(patient.last_visit)) / (1000 * 60 * 60 * 24))} días
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 italic">Nunca</span>
                )}
            </td>

            {/* Próximo Turno - Consistent Format */}
            <td className="px-6 py-4 pr-8 text-right">
                <div className="flex flex-col items-end">
                    {patient.next_appointment ? (
                        <>
                            <span className="text-sm font-bold text-slate-700">
                                {new Date(patient.next_appointment).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                {patient.next_appointment.includes('T') || patient.next_appointment.includes(' ')
                                    ? new Date(patient.next_appointment).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                                    : '09:00'}
                            </span>
                        </>
                    ) : (
                        <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            Sin turno
                        </span>
                    )}
                </div>
            </td>
        </tr>
    );
});

export function PatientTable({ patients, onPatientClick, isLoading, pagination }) {

    if (isLoading) {
        return (
            <div className="w-full bg-white/70 rounded-2xl shadow-sm border border-white/60 p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="w-full overflow-hidden bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/60 will-change-transform">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-indigo-100/50 bg-white/50 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <th className="px-6 py-4 pl-8">Paciente</th>
                        <th className="px-6 py-4">Identificación</th>
                        <th className="px-6 py-4">Cobertura</th>
                        <th className="px-6 py-4">Última Visita</th>
                        <th className="px-6 py-4 text-right pr-8">Próximo Turno</th>
                    </tr>
                </thead>
                {/* 
                   We use motion.tbody ONLY for the entrance animation of the block.
                   Rows inside are native for max performance.
                */}
                <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-slate-100"
                >
                    {patients.map((patient) => (
                        <PatientRow
                            key={patient.id}
                            patient={patient}
                            onClick={onPatientClick}
                        />
                    ))}
                </motion.tbody>
            </table>

            {patients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-slate-50">
                        <Users className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No hay pacientes</h3>
                    <p className="text-slate-500 max-w-sm mb-6 px-4">
                        No se encontraron pacientes que coincidan con tu búsqueda. ¿Deseas agregar uno nuevo?
                    </p>
                    <Button
                        onClick={() => console.log("Crear paciente desde empty state")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Primer Paciente
                    </Button>
                </div>
            )}
            {/* Pagination Controls */}
            {pagination && pagination.totalItems > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                    <div className="text-sm text-slate-500">
                        Mostrando <span className="font-medium text-slate-900">{pagination.startIndex}-{pagination.endIndex}</span> de <span className="font-medium text-slate-900">{pagination.totalItems}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                            disabled={pagination.currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-slate-700 mx-2">
                            Página {pagination.currentPage} de {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
