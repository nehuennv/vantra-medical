import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MessageCircle, FileText, User, MapPin, Hash, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn, getAvatarColor } from "@/lib/utils";
import { motion } from "framer-motion";

export function PatientDrawer({ isOpen, onClose, patient }) {
    // Note: We don't check !isOpen here because that is handled by AnimatePresence in the parent.
    // We only check for patient existence.
    if (!patient) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop con blur suave */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel Principal */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col max-h-screen"
            >

                {/* 1. Header Premium */}
                <div className="relative pt-12 pb-8 px-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">

                    {/* Botón Cerrar Flotante */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-md transition-all z-20"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        {/* Avatar Gigante */}
                        <div className={cn(
                            "h-24 w-24 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl ring-4 ring-white",
                            getAvatarColor(patient.name)
                        )}>
                            {patient.name.charAt(0)}
                        </div>

                        {/* Nombre y Especialidad */}
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
                            {patient.name}
                        </h2>

                        {/* Tags Médicos */}
                        {patient.tags && (
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {patient.tags.map(tag => {
                                    const isAlert = tag.toLowerCase().includes('alergia') || tag.toLowerCase().includes('hipertenso');
                                    return (
                                        <span key={tag} className={cn(
                                            "px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm",
                                            isAlert
                                                ? "bg-red-50 text-red-700 border-red-100"
                                                : "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {tag}
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Botones de Acción Primaria */}
                        <div className="flex gap-3 w-full max-w-sm">
                            <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 h-10 rounded-xl font-semibold transition-all hover:-translate-y-0.5">
                                <Calendar className="h-4 w-4 mr-2" />
                                Agendar
                            </Button>
                            <Button variant="outline" className="flex-1 border-slate-200 hover:bg-slate-50 text-slate-700 h-10 rounded-xl font-semibold">
                                <FileText className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                            <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200">
                                <MessageCircle className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. Contenido Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">

                    {/* Sección: Datos de Contacto (Grid) */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User className="h-3 w-3" /> Información Del Paciente
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                <span className="block text-xs text-slate-400 mb-1">DNI</span>
                                <span className="block text-sm font-bold text-slate-700">{patient.dni || '-'}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                <span className="block text-xs text-slate-400 mb-1">Nacimiento</span>
                                <span className="block text-sm font-bold text-slate-700">{patient.birthDate || '-'}</span>
                            </div>
                            <div className="col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between">
                                <div>
                                    <span className="block text-xs text-slate-400 mb-1">Email</span>
                                    <span className="block text-sm font-bold text-slate-700 truncate">{patient.contact.email}</span>
                                </div>
                                <Mail className="h-4 w-4 text-slate-300" />
                            </div>
                            <div className="col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between">
                                <div>
                                    <span className="block text-xs text-slate-400 mb-1">Teléfono</span>
                                    <span className="block text-sm font-bold text-slate-700">{patient.contact.phone}</span>
                                </div>
                                <Phone className="h-4 w-4 text-slate-300" />
                            </div>
                        </div>
                    </section>

                    {/* Sección: Notas Clínicas (Sticky Note) */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FileText className="h-3 w-3" /> Notas Clínicas
                        </h3>
                        <div className="relative p-6 bg-amber-50 rounded-r-2xl border-l-4 border-amber-300 shadow-sm">
                            <textarea
                                className="w-full h-24 bg-transparent border-none p-0 text-amber-900 text-sm focus:ring-0 leading-relaxed resize-none placeholder-amber-900/30"
                                placeholder="Escribe una nota clínica relevante..."
                                defaultValue={patient.notes}
                            />
                            <div className="absolute top-2 right-2 opacity-10">
                                <FileText className="h-12 w-12 text-amber-900" />
                            </div>
                        </div>
                    </section>

                    {/* Sección: Historial (Vertical Timeline) */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Clock className="h-3 w-3" /> Historial de Visitas
                        </h3>

                        <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:h-full before:w-[2px] before:bg-slate-100">

                            {/* Evento 1 */}
                            <div className="relative pl-6 group">
                                <div className="absolute left-[0px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 ring-4 ring-emerald-50 shadow-sm transition-transform group-hover:scale-110"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-mono mb-0.5">05 DIC 2023</span>
                                    <span className="text-sm font-bold text-slate-800">Control Mensual</span>
                                    <span className="text-xs text-slate-500 font-medium">Dr. Villavicencio</span>
                                </div>
                            </div>

                            {/* Evento 2 */}
                            <div className="relative pl-6 group">
                                <div className="absolute left-[0px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-300 ring-4 ring-slate-50 shadow-sm transition-transform group-hover:scale-110"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-mono mb-0.5">12 NOV 2023</span>
                                    <span className="text-sm font-bold text-slate-800">Consulta Primera Vez</span>
                                    <span className="text-xs text-slate-500 font-medium">Dr. Villavicencio</span>
                                </div>
                            </div>

                            {/* Evento 3 */}
                            <div className="relative pl-6 group">
                                <div className="absolute left-[0px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-300 ring-4 ring-slate-50 shadow-sm transition-transform group-hover:scale-110"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-mono mb-0.5">20 OCT 2023</span>
                                    <span className="text-sm font-bold text-slate-800">Estudios de Laboratorio</span>
                                    <span className="text-xs text-slate-500 font-medium">Laboratorio Central</span>
                                </div>
                            </div>

                        </div>
                    </section>

                </div>
            </motion.div>
        </div>,
        document.body
    );
}
