import React from 'react';
import { Eye, MessageCircle } from 'lucide-react';
import { cn, calculateAge, getAvatarColor } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08 // A bit slower stagger for more "wave" effect
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Increased distance for more impact
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
};

export function PatientTable({ patients, onPatientClick }) {
    return (
        <div className="w-full overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 will-change-transform">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-4 pl-8">Paciente</th>
                        <th className="px-6 py-4">Identificación</th>
                        <th className="px-6 py-4">Cobertura</th>
                        <th className="px-6 py-4">Contacto</th>
                        <th className="px-6 py-4 text-right pr-8">Acciones</th>
                    </tr>
                </thead>
                <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-slate-100"
                >
                    {patients.map((patient) => (
                        <motion.tr
                            key={patient.id}
                            variants={itemVariants}
                            onClick={() => onPatientClick(patient)}
                            whileHover={{ scale: 1.002, backgroundColor: "#f8fafc" }}
                            whileTap={{ scale: 0.998 }}
                            className="group transition-colors duration-200 cursor-pointer will-change-transform"
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

                            {/* Identificación (Edad / DNI) */}
                            <td className="px-6 py-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-700">
                                        {calculateAge(patient.birthDate)} años
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium">
                                        DNI: {patient.dni || '-'}
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

                            {/* Contacto WhatsApp */}
                            <td className="px-6 py-4">
                                <a
                                    href={`https://wa.me/${patient.contact.whatsapp_normalized}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all text-xs font-medium shadow-sm"
                                >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    WhatsApp
                                </a>
                            </td>

                            {/* Acciones */}
                            <td className="px-6 py-4 pr-8 text-right">
                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Ver Ficha">
                                    <Eye className="h-5 w-5" />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </table>

            {patients.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-sm">No se encontraron pacientes para este filtro.</p>
                </div>
            )}
        </div>
    );
}
