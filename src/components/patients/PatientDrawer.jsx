import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MessageCircle, FileText, User, MapPin, Hash, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function PatientDrawer({ isOpen, onClose, patient }) {
    if (!isOpen || !patient) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 max-h-screen">

                {/* 1. Header Gigante */}
                <div className="p-8 pb-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-slate-700 text-3xl font-bold border-4 border-slate-100 shadow-sm">
                            {patient.name.charAt(0)}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-transparent hover:border-slate-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">{patient.name}</h2>

                    {/* Tags Médicos */}
                    {patient.tags && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {patient.tags.map(tag => {
                                // Logic for Alert Tags (e.g. Alergia)
                                const isAlert = tag.toLowerCase().includes('alergia') || tag.toLowerCase().includes('hipertenso');
                                return (
                                    <span key={tag} className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${isAlert
                                        ? 'bg-red-50 text-red-700 border-red-100'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Primary Actions (Top) */}
                    <div className="flex gap-3 mb-6">
                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 rounded-xl font-semibold">
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar Turno
                        </Button>
                        <Button variant="outline" className="h-10 px-3 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700" title="Editar Ficha">
                            <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-10 px-3 rounded-xl border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                            title="WhatsApp"
                            onClick={() => window.open(`https://wa.me/${patient.contact.whatsapp_normalized}`, '_blank')}
                        >
                            <MessageCircle className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* Sección 1: Bio */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="h-3 w-3" /> Datos Personales
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="block text-xs text-slate-400 mb-1">DNI</span>
                                <span className="block text-sm font-semibold text-slate-700">{patient.dni || '-'}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="block text-xs text-slate-400 mb-1">Nacimiento</span>
                                <span className="block text-sm font-semibold text-slate-700">{patient.birthDate || '-'}</span>
                            </div>
                            <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="block text-xs text-slate-400 mb-1">Cobertura</span>
                                <span className="block text-sm font-semibold text-slate-700 flex items-center justify-between">
                                    {patient.insurance === 'Particular' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
                                            Particular
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                                            {patient.insurance}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="col-span-2 flex items-center gap-3 p-1">
                                <MapPin className="h-4 w-4 text-slate-300" />
                                <span className="text-sm text-slate-500">Calle Falsa 123, CABA (Simulado)</span>
                            </div>
                        </div>
                    </section>

                    {/* Sección 2: Clínica / Notas */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="h-3 w-3" /> Notas Rápidas
                        </h3>
                        <div className="relative">
                            <textarea
                                className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-amber-50/30 text-slate-700 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none leading-relaxed"
                                defaultValue={patient.notes}
                            />
                            <div className="absolute bottom-2 right-2 text-[10px] text-slate-400">Autoguardado</div>
                        </div>
                    </section>

                    {/* Sección 3: Historial (Simulado) */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> Historial de Turnos
                        </h3>
                        <div className="space-y-3">
                            {/* Item Historial 1 */}
                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-xs font-bold text-slate-600">
                                        <span>DIC</span>
                                        <span className="text-sm">05</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Control Mensual</p>
                                        <p className="text-xs text-slate-500">Dr. Villavicencio</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-semibold">Realizado</span>
                            </div>
                            {/* Item Historial 2 */}
                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-xs font-bold text-slate-600">
                                        <span>NOV</span>
                                        <span className="text-sm">12</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Consulta Primera Vez</p>
                                        <p className="text-xs text-slate-500">Dr. Villavicencio</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-semibold">Realizado</span>
                            </div>
                        </div>
                    </section>



                </div>
            </div>
        </div>,
        document.body
    );
}
