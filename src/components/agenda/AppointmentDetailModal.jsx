import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, User, FileText, Activity, History, Upload, Save,
    CheckCircle2, Clock, AlertCircle, Loader2, Stethoscope, Scale, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchPatientFullData, saveConsultation } from '@/data/unifiedMockDB';
import { cn } from '@/lib/utils';

export function AppointmentDetailModal({ booking, isOpen, onClose }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState(null); // Data completa (paciente + consulta)
    const [activeTab, setActiveTab] = useState('evolution');

    // Estado local del formulario (lo que el médico escribe)
    const [formState, setFormState] = useState({
        evolution: '',
        diagnosis: '',
        vitals: { bloodPressure: '', weight: '', heartRate: '' }
    });

    // 1. Cargar datos al abrir
    useEffect(() => {
        if (isOpen && booking) {
            setLoading(true);
            fetchPatientFullData(booking).then((response) => {
                setData(response);
                // Pre-llenar el formulario con lo que ya exista (si editamos)
                setFormState({
                    evolution: response.currentConsultation.evolution || '',
                    diagnosis: response.currentConsultation.diagnosis || '',
                    vitals: response.currentConsultation.vitals || { bloodPressure: '', weight: '', heartRate: '' }
                });
                setLoading(false);
            });
        }
    }, [isOpen, booking]);

    // 2. Guardar datos
    const handleSave = async () => {
        setSaving(true);
        await saveConsultation(booking.id, {
            ...formState,
            doctor: 'Dr. Vantra' // Hardcodeado por ahora
        });
        setSaving(false);
        // Opcional: Mostrar toast de éxito
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative z-10"
                >
                    {/* --- CONTENIDO --- */}
                    <div className="flex flex-1 overflow-hidden relative">
                        {/* Close Button (Absolute) */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-500 transition-all z-20"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Sidebar */}
                        <div className="w-full md:w-[280px] bg-slate-50/80 backdrop-blur-xl border-r border-slate-100 flex flex-col shrink-0">
                            {/* Profile Summary */}
                            <div className="p-8 flex flex-col items-center text-center border-b border-slate-100/50">
                                {loading ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <div className="h-24 w-24 bg-slate-200 rounded-full mb-4" />
                                        <div className="h-6 w-32 bg-slate-200 rounded mb-2" />
                                        <div className="h-4 w-20 bg-slate-200 rounded" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-lg ring-4 ring-white mb-4">
                                            {data?.patient.name.charAt(0)}
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800 leading-tight mb-2">
                                            {data?.patient.name}
                                        </h2>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {data?.patient.age} Años</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="flex items-center gap-1">{data?.patient.bloodType || 'S/D'}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Appointment Info */}
                            <div className="px-6 py-4 border-b border-slate-100/50 bg-slate-50/50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fecha</span>
                                    <span className="text-xs font-bold text-slate-700">
                                        {new Date(booking.startTime).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hora</span>
                                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                        <Clock className="h-3 w-3 text-slate-400" />
                                        {new Date(booking.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estado</span>
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase",
                                        booking.status === 'ACCEPTED' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                            booking.status === 'IN_PROGRESS' ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                                                "bg-amber-50 text-amber-700 border-amber-100"
                                    )}>
                                        {booking.status === 'ACCEPTED' ? 'Confirmado' : booking.status === 'IN_PROGRESS' ? 'En Curso' : 'Pendiente'}
                                    </span>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="p-4 flex flex-col gap-1 overflow-y-auto">
                                {[
                                    { id: 'evolution', label: 'Evolución', icon: FileText },
                                    { id: 'history', label: 'Historial', icon: History },
                                    { id: 'files', label: 'Archivos', icon: Upload },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all",
                                            activeTab === tab.id
                                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100"
                                                : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                                        )}
                                    >
                                        <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-indigo-600" : "text-slate-400")} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Panel */}
                        <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                </div>
                            ) : (
                                <>
                                    {/* TAB: EVOLUCIÓN (INPUTS REALES) */}
                                    {activeTab === 'evolution' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

                                            {/* 1. Signos Vitales (Grid de Inputs) */}
                                            <section className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Activity className="h-4 w-4" /> Signos Vitales de Hoy
                                                </h4>
                                                <div className="grid grid-cols-3 gap-6">
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-semibold text-slate-700">Presión (mmHg)</label>
                                                        <div className="relative">
                                                            <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                            <input
                                                                value={formState.vitals.bloodPressure}
                                                                onChange={(e) => setFormState(prev => ({ ...prev, vitals: { ...prev.vitals, bloodPressure: e.target.value } }))}
                                                                placeholder="120/80"
                                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-semibold text-slate-700">Peso (kg)</label>
                                                        <div className="relative">
                                                            <Scale className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                            <input
                                                                value={formState.vitals.weight}
                                                                onChange={(e) => setFormState(prev => ({ ...prev, vitals: { ...prev.vitals, weight: e.target.value } }))}
                                                                placeholder="70.5"
                                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-semibold text-slate-700">Frec. Cardíaca</label>
                                                        <div className="relative">
                                                            <Heart className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                            <input
                                                                value={formState.vitals.heartRate}
                                                                onChange={(e) => setFormState(prev => ({ ...prev, vitals: { ...prev.vitals, heartRate: e.target.value } }))}
                                                                placeholder="75 bpm"
                                                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* 2. Diagnóstico y Evolución */}
                                            <section className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-bold text-slate-700 block mb-2">Diagnóstico Presuntivo</label>
                                                    <input
                                                        value={formState.diagnosis}
                                                        onChange={(e) => setFormState(prev => ({ ...prev, diagnosis: e.target.value }))}
                                                        placeholder="Ej: Gripe estacional"
                                                        className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-bold text-slate-700 block mb-2">Notas de Evolución</label>
                                                    <textarea
                                                        value={formState.evolution}
                                                        onChange={(e) => setFormState(prev => ({ ...prev, evolution: e.target.value }))}
                                                        placeholder="Describa el cuadro clínico, tratamiento indicado, observaciones..."
                                                        className="w-full h-40 p-4 rounded-xl border border-slate-200 text-sm leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                    />
                                                </div>
                                            </section>

                                            {/* Footer Acciones */}
                                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                                <span className="text-xs text-slate-400 self-center italic mr-auto">
                                                    Los cambios se guardan localmente para el MVP
                                                </span>
                                                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                                                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Guardar Ficha</>}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB: HISTORIAL (Lectura) */}
                                    {activeTab === 'history' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-slate-800">Línea de Tiempo</h3>
                                                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500">
                                                    {data.history.length} visitas previas
                                                </span>
                                            </div>

                                            <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                                                {data.history.length === 0 ? (
                                                    <p className="text-slate-400 text-sm italic">No hay historial previo para este paciente.</p>
                                                ) : data.history.map((evt) => (
                                                    <div key={evt.id} className="relative group">
                                                        <div className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white bg-slate-300 group-hover:bg-indigo-500 transition-colors shadow-sm" />
                                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                                            <div className="flex justify-between mb-2">
                                                                <span className="font-bold text-slate-700">{evt.diagnosis || 'Consulta General'}</span>
                                                                <span className="text-xs text-slate-400">{new Date(evt.date).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 mb-3">{evt.evolution}</p>
                                                            {evt.vitals && (
                                                                <div className="flex gap-3 mt-3 pt-3 border-t border-slate-200/50">
                                                                    {evt.vitals.bloodPressure && <span className="text-xs bg-white px-2 py-1 rounded border text-slate-500">TA: {evt.vitals.bloodPressure}</span>}
                                                                    {evt.vitals.weight && <span className="text-xs bg-white px-2 py-1 rounded border text-slate-500">{evt.vitals.weight} kg</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB: ARCHIVOS */}
                                    {activeTab === 'files' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <Upload className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800">Archivos Adjuntos</h3>
                                            </div>

                                            {/* Upload Zone */}
                                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/10 hover:text-indigo-500 transition-all cursor-pointer group bg-slate-50/50">
                                                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                                    <Upload className="h-6 w-6" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">Click para subir o arrastrar</p>
                                                    <p className="text-xs mt-1">PDF, JPG, PNG (Max 10MB)</p>
                                                </div>
                                            </div>

                                            {/* File List */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {data.files && data.files.length > 0 ? (
                                                    data.files.map((file, i) => (
                                                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group cursor-pointer">
                                                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                                                                <p className="text-[10px] text-slate-400">{file.size} • {file.date}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-slate-400 text-sm italic col-span-full text-center py-4">No hay archivos adjuntos aún.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}