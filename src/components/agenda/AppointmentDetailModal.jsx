import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, User, FileText, Activity, History, Upload, Save,
    CheckCircle2, Clock, AlertCircle, Loader2, Stethoscope, Scale, Heart, File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchPatientFullData, saveConsultation } from '@/data/unifiedMockDB';
import { cn } from '@/lib/utils';

// Helper hook for scroll locking (copied from CreatePatientModal)
function useScrollLock(lock) {
    useEffect(() => {
        if (lock) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = 'var(--removed-body-scroll-bar-size, 0px)';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [lock]);
}

export function AppointmentDetailModal({ booking, isOpen, onClose }) {
    useScrollLock(isOpen);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('evolution');

    const [formState, setFormState] = useState({
        evolution: '',
        diagnosis: '',
        vitals: { bloodPressure: '', weight: '', heartRate: '' }
    });

    useEffect(() => {
        if (isOpen && booking) {
            setLoading(true);
            fetchPatientFullData(booking).then((response) => {
                setData(response);
                setFormState({
                    evolution: response.currentConsultation.evolution || '',
                    diagnosis: response.currentConsultation.diagnosis || '',
                    vitals: response.currentConsultation.vitals || { bloodPressure: '', weight: '', heartRate: '' }
                });
                setLoading(false);
            });
        }
    }, [isOpen, booking]);

    const handleSave = async () => {
        setSaving(true);
        await saveConsultation(booking.id, {
            ...formState,
            doctor: 'Dr. Vantra'
        });
        setSaving(false);
    };

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                >
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="relative w-full max-w-6xl h-[85vh] max-h-[800px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row ring-1 ring-white/50 font-sans"
                    >
                        {/* --- SIDEBAR (Patient Info & Nav) --- */}
                        <div className="w-full md:w-80 bg-slate-50/80 border-r border-slate-100 flex flex-col shrink-0 relative overflow-hidden">
                            {/* Decorative Background for Sidebar */}
                            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                            <div className="p-8 relative z-10">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-4 animate-pulse">
                                        <div className="h-24 w-24 bg-slate-200 rounded-full" />
                                        <div className="h-6 w-32 bg-slate-200 rounded-lg" />
                                        <div className="h-4 w-24 bg-slate-200 rounded-lg" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="h-28 w-28 rounded-full bg-white shadow-xl flex items-center justify-center text-4xl font-black text-primary ring-4 ring-white mb-4 relative">
                                            {data?.patient.name.charAt(0)}
                                            <div className={cn("absolute bottom-1 right-2 w-5 h-5 rounded-full border-4 border-white", booking.status === 'ACCEPTED' ? "bg-emerald-500" : "bg-amber-500")} />
                                        </div>

                                        <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">
                                            {data?.patient.name}
                                        </h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-4 w-full">
                                            {data?.patient.insurance || 'Particular'}
                                        </p>

                                        <div className="grid grid-cols-2 gap-3 w-full mb-6">
                                            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Edad</span>
                                                <span className="text-sm font-black text-slate-700">{data?.patient.age || '-'}</span>
                                            </div>
                                            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Sangre</span>
                                                <span className="text-sm font-black text-slate-700">{data?.patient.bloodType || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Tabs */}
                            <div className="px-4 space-y-2 flex-1 relative z-10 overflow-y-auto custom-scrollbar">
                                {[
                                    { id: 'evolution', label: 'Evolución Clínica', icon: Activity },
                                    { id: 'history', label: 'Historial Médico', icon: History },
                                    { id: 'files', label: 'Archivos Adjuntos', icon: FileText }, // Changed icon for variety
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all text-left group relative overflow-hidden",
                                            activeTab === tab.id
                                                ? "bg-white shadow-lg shadow-slate-100 text-primary ring-1 ring-primary/10"
                                                : "text-slate-400 hover:text-slate-700 hover:bg-white/60"
                                        )}
                                    >
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-colors", activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-transparent text-slate-400 group-hover:bg-slate-100")}>
                                            <tab.icon className="h-5 w-5" />
                                        </div>
                                        <span className="relative z-10">{tab.label}</span>
                                        {activeTab === tab.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 mt-auto opacity-60 hidden md:block relative z-10">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                    Dr. Vantra Medical<br />System v2.0
                                </div>
                            </div>
                        </div>

                        {/* --- MAIN CONTENT --- */}
                        <div className="flex-1 flex flex-col relative bg-white">

                            {/* Title Bar & Actions */}
                            <div className="p-8 pb-0 flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                        {activeTab === 'evolution' && 'Consulta Actual'}
                                        {activeTab === 'history' && 'Historial del Paciente'}
                                        {activeTab === 'files' && 'Archivos y Documentos'}
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium mt-1">
                                        {booking.title} • {new Date(booking.startTime).toLocaleDateString()}
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-800 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Scrolling Content Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                {loading ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-sm font-medium">Sincronizando datos...</p>
                                    </div>
                                ) : (
                                    <div className="max-w-3xl">
                                        {/* TAB: EVOLUCIÓN */}
                                        {activeTab === 'evolution' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
                                                {/* Signos Vitales Minimalistas */}
                                                <div className="grid grid-cols-3 gap-4">
                                                    {[
                                                        { label: 'Presión', icon: Activity, val: formState.vitals.bloodPressure, setter: 'bloodPressure', ph: '120/80' },
                                                        { label: 'Peso', icon: Scale, val: formState.vitals.weight, setter: 'weight', ph: 'kg' },
                                                        { label: 'Ritmo', icon: Heart, val: formState.vitals.heartRate, setter: 'heartRate', ph: 'lpm' },
                                                    ].map((vital, i) => (
                                                        <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all relative focus-within:z-10">
                                                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                                                <vital.icon className="h-4 w-4" />
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">{vital.label}</span>
                                                            </div>
                                                            <input
                                                                className="w-full bg-transparent border-none py-1 px-0 text-lg font-bold text-slate-700 placeholder:text-slate-300 focus:ring-0"
                                                                placeholder={vital.ph}
                                                                value={vital.val}
                                                                onChange={(e) => setFormState(prev => ({ ...prev, vitals: { ...prev.vitals, [vital.setter]: e.target.value } }))}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Diagnóstico Presuntivo</label>
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 text-primary rounded-lg group-focus-within:bg-primary/20 transition-colors">
                                                                <Stethoscope className="h-4 w-4" />
                                                            </div>
                                                            <input
                                                                value={formState.diagnosis}
                                                                onChange={(e) => setFormState(prev => ({ ...prev, diagnosis: e.target.value }))}
                                                                placeholder="Escriba el diagnóstico principal..."
                                                                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 relative focus:z-10"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 flex-1 flex flex-col">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Evolución Clínica</label>
                                                        <textarea
                                                            value={formState.evolution}
                                                            onChange={(e) => setFormState(prev => ({ ...prev, evolution: e.target.value }))}
                                                            placeholder="Describa la evolución del paciente..."
                                                            className="w-full p-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none min-h-[200px] shadow-sm relative focus:z-10"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* TAB: HISTORIAL */}
                                        {activeTab === 'history' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
                                                <div className="relative pl-8 border-l-2 border-slate-100 space-y-12 py-2">
                                                    {data.history.length === 0 ? (
                                                        <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                                            <History className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                                            <p className="text-slate-400 font-medium">Sin antecedentes registrados</p>
                                                        </div>
                                                    ) : data.history.map((evt) => (
                                                        <div key={evt.id} className="relative group">
                                                            <div className="absolute -left-[41px] top-0 h-6 w-6 rounded-full border-4 border-white bg-slate-200 group-hover:bg-primary transition-colors shadow-sm z-10" />
                                                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm transition-all group-hover:border-primary/50">
                                                                <div className="flex justify-between mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full">{evt.diagnosis || 'Consulta'}</span>
                                                                        <span className="text-slate-400 text-xs font-bold">{new Date(evt.date).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-slate-600 leading-relaxed text-sm mb-0">{evt.evolution}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* TAB: FILES */}
                                        {activeTab === 'files' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="h-full">
                                                <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-primary/50 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group mb-10">
                                                    <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                                                        <Upload className="h-8 w-8" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-slate-700 group-hover:text-primary transition-colors">Click para subir archivos</p>
                                                        <p className="text-xs text-slate-400 mt-2">PDF, Imágenes (Max 10MB)</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    {data.files && data.files.length > 0 ? data.files.map((file, i) => (
                                                        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group">
                                                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xs uppercase">
                                                                FILE
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{file.name}</p>
                                                                <p className="text-xs text-slate-400 font-bold mt-0.5">{file.date} • {file.size}</p>
                                                            </div>
                                                        </div>
                                                    )) : <p className="text-center text-slate-400 text-sm italic py-4">No hay archivos adjuntos.</p>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 pt-0 mt-auto flex justify-end gap-3 bg-white z-20">
                                <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-900 font-bold hover:bg-slate-100 h-12 rounded-xl px-6">
                                    Cancelar
                                </Button>
                                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-8 rounded-xl font-bold h-12 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}