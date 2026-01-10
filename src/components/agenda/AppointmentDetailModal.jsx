import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, Clock, User, FileText, Activity,
    History, Paperclip, ChevronRight, UploadCloud,
    Stethoscope, FilePlus, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockAppointmentData } from '@/data/mockAppointmentDetail';

// --- SUB-COMPONENTS ---

// 1. Overview Tab
const OverviewTab = ({ details }) => (
    <div className="space-y-6">
        {/* Vitals Summary Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: 'Presión', value: details.vitals?.bp || '--/--', unit: 'mmHg', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Frecuencia', value: details.vitals?.hr || '--', unit: 'bpm', color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Peso', value: details.vitals?.weight || '--', unit: 'kg', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Altura', value: details.vitals?.height || '--', unit: 'cm', color: 'text-sky-600', bg: 'bg-sky-50' },
            ].map((vital, i) => (
                <div key={i} className={cn("p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-1", vital.bg)}>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{vital.label}</span>
                    <div className="flex items-baseline gap-1">
                        <span className={cn("text-xl font-black", vital.color)}>{vital.value}</span>
                        <span className="text-[10px] font-bold text-slate-500">{vital.unit}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Appointment Info */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Motivo de Consulta</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {details.reason || "Sin motivo especificado."}
            </p>
            {details.notes && (
                <div className="pt-4 mt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-400 font-bold mb-2">NOTAS PREVIAS</p>
                    <p className="text-slate-500 text-sm italic">"{details.notes}"</p>
                </div>
            )}
        </div>
    </div>
);

// 2. History Tab (Timeline)
const HistoryTab = ({ history }) => (
    <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
        {history.map((item, idx) => (
            <div key={idx} className="relative flex gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all -ml-2">
                {/* Dot */}
                <div className={cn(
                    "w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 z-10 border-2 border-white shadow-sm ring-1",
                    idx === 0 ? "bg-indigo-500 ring-indigo-200" : "bg-slate-300 ring-slate-200"
                )} />

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {new Date(item.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                            {item.type}
                        </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{item.diagnosis}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.notes}
                    </p>
                </div>
            </div>
        ))}
        {history.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">Sin historial previo.</div>
        )}
    </div>
);

// 3. Evolution Tab (Input)
const EvolutionTab = () => (
    <div className="h-full flex flex-col gap-4">
        <textarea
            className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all font-medium leading-relaxed"
            placeholder="Escribir evolución médica aquí..."
        ></textarea>
        <div className="flex gap-3">
            <Button variant="outline" className="flex-1 border-slate-200 text-slate-600">
                <FilePlus className="h-4 w-4 mr-2" /> Plantilla
            </Button>
            <Button className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Guardar Evolución
            </Button>
        </div>
    </div>
);

// 4. Files Tab
const FilesTab = ({ files }) => (
    <div className="space-y-6">
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/10 hover:text-indigo-500 transition-all cursor-pointer group">
            <div className="p-3 bg-slate-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                <UploadCloud className="h-6 w-6" />
            </div>
            <div className="text-center">
                <p className="text-sm font-bold text-slate-600 group-hover:text-indigo-700">Click para subir o arrastrar</p>
                <p className="text-xs mt-1">PDF, JPG, PNG (Max 10MB)</p>
            </div>
        </div>

        <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Archivos Adjuntos ({files.length})</h4>
            {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-all group">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        <Paperclip className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400">{file.size} • {file.date}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export function AppointmentDetailModal({ booking, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock Fetch
    useEffect(() => {
        if (booking) {
            setLoading(true);
            setTimeout(() => {
                // Fetch mock details using booking ID (or just generic for now)
                setDetails(mockAppointmentData(booking));
                setLoading(false);
            }, 600); // Simulate network latency
        }
    }, [booking]);

    if (!booking) return null;

    const tabs = [
        { id: 'overview', label: 'Resumen', icon: Activity },
        { id: 'history', label: 'Historia', icon: History },
        { id: 'evolution', label: 'Evolución', icon: Stethoscope },
        { id: 'files', label: 'Archivos', icon: Paperclip },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* LOADING STATE */}
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-sm font-bold text-slate-400 animate-pulse">Cargando Historia Clínica...</p>
                        </div>
                    ) : (
                        <>
                            {/* HEADER */}
                            <div className="relative bg-slate-900 text-white p-8 overflow-hidden flex-shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 opacity-90" />

                                {/* Top Controls */}
                                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-[10px] font-bold border border-white/20 uppercase tracking-wider">
                                            {details.status}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-[10px] font-bold border border-white/20">
                                            {details.date} • {details.time}
                                        </span>
                                    </div>
                                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Patient Profile */}
                                <div className="relative z-10 flex items-end gap-6 pt-10">
                                    <div className="w-24 h-24 rounded-2xl bg-white shadow-2xl flex items-center justify-center text-4xl font-black text-indigo-600 ring-4 ring-white/20">
                                        {details.patient.name.charAt(0)}
                                    </div>
                                    <div className="pb-1 space-y-1">
                                        <h2 className="text-3xl font-bold leading-none">{details.patient.name}</h2>
                                        <div className="flex items-center gap-3 text-indigo-100 font-medium text-sm">
                                            <span>{details.patient.age} años</span>
                                            <span>•</span>
                                            <span>{details.patient.gender}</span>
                                            <span>•</span>
                                            <span className="opacity-80">{details.patient.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TABS HEADER */}
                            <div className="flex items-center px-8 border-b border-slate-200 bg-white sticky top-0 z-10">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-[3px]",
                                            activeTab === tab.id
                                                ? "border-indigo-600 text-indigo-700 bg-indigo-50/30"
                                                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* BODY CONTENT */}
                            <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    {activeTab === 'overview' && <OverviewTab details={details} />}
                                    {activeTab === 'history' && <HistoryTab history={details.history} />}
                                    {activeTab === 'evolution' && <EvolutionTab />}
                                    {activeTab === 'files' && <FilesTab files={details.files} />}
                                </motion.div>
                            </div>

                            {/* FOOTER ACTIONS */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                                {activeTab !== 'evolution' && (
                                    <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                                        Cancelar
                                    </Button>
                                )}
                                <Button className="bg-slate-900 text-white font-bold px-8 shadow-xl shadow-slate-200 hover:scale-105 transition-transform">
                                    {activeTab === 'evolution' ? 'Finalizar Consulta' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
