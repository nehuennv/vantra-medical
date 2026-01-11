import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, User, ArrowLeft, CheckCircle2, Stethoscope, UserPlus, Pencil, Mail, Phone, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from "@/lib/utils";

// Hook simple para bloquear scroll
function useScrollLock(lock) {
    React.useEffect(() => {
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

export function CreatePatientModal({ isOpen, onClose, onSubmit, initialData }) {
    useScrollLock(isOpen);
    const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'medical'
    const [isSuccess, setIsSuccess] = useState(false);

    // Initial State Template
    const initialFormState = {
        name: '',
        dni: '',
        birthDate: '',
        insurance: '',
        email: '',
        phone: '',
        currentCondition: '',
        medicalHistory: '',
        medications: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [files, setFiles] = useState([]);

    // Populate data when editing
    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name || '',
                dni: initialData.dni || '',
                birthDate: initialData.birthDate || '',
                insurance: initialData.insurance || '',
                email: initialData.contact?.email || '',
                phone: initialData.contact?.phone || '',
                currentCondition: initialData.medicalHistory?.currentIllness || initialData.medicalData?.currentCondition || '',
                medicalHistory: initialData.medicalHistory?.pathological || initialData.medicalData?.medicalHistory || '',
                medications: initialData.medicalHistory?.medication || initialData.medicalData?.medications || '',
            });
            const existingFiles = initialData.medicalHistory?.files || initialData.medicalData?.files || [];
            setFiles(existingFiles);
        } else if (isOpen && !initialData) {
            setFormData(initialFormState);
            setFiles([]);
            setIsSuccess(false);
        }

        if (isOpen) {
            setActiveTab('personal');
        }
    }, [isOpen, initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileAdd = (e) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files).map(file => ({
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            note: '',
            date: new Date().toISOString()
        }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const updateFileNote = (id, note) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, note } : f));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const patientData = {
            ...formData,
            id: initialData ? initialData.id : `new-${Date.now()}`,
            contact: {
                email: formData.email,
                phone: formData.phone,
                whatsapp_normalized: formData.phone.replace(/\D/g, '')
            },
            medicalData: {
                currentCondition: formData.currentCondition,
                medicalHistory: formData.medicalHistory,
                medications: formData.medications,
                files: files
            },
            medicalHistory: { // Backward comp
                currentIllness: formData.currentCondition,
                pathological: formData.medicalHistory,
                medication: formData.medications,
                files: files
            },
            status: initialData ? initialData.status : 'active',
            tags: initialData ? initialData.tags : ['Nuevo'],
            last_visit: initialData ? initialData.last_visit : new Date().toISOString(),
            filesCount: files.length
        };

        setIsSuccess(true);
        onSubmit(patientData);

        setTimeout(() => {
            onClose();
            setTimeout(() => {
                setIsSuccess(false);
                setFormData(initialFormState);
                setFiles([]);
                setActiveTab('personal');
            }, 300);
        }, 2000);
    };

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">

                    {/* Backdrop with Blur */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={isSuccess ? undefined : onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
                    />

                    {/* Modal Content */}
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="relative w-full max-w-5xl h-[85vh] max-h-[800px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row ring-1 ring-white/50"
                    >

                        {/* SUCCESS OVERLAY */}
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="h-32 w-32 rounded-full bg-emerald-100/50 flex items-center justify-center mb-6 relative"
                                    >
                                        <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-20"></div>
                                        <CheckCircle2 className="h-16 w-16 text-emerald-500" strokeWidth={3} />
                                    </motion.div>
                                    <h3 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
                                        {initialData ? 'Perfil Actualizado' : 'Paciente Registrado'}
                                    </h3>
                                    <p className="text-slate-500 text-lg">Los datos han sido sincronizados correctamente.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* SIDEBAR (Progress & Context) */}
                        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 flex flex-col shrink-0">
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm",
                                        initialData ? "bg-amber-100 text-amber-600" : "bg-primary/20 text-primary"
                                    )}>
                                        {initialData ? <Pencil className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 leading-tight">
                                            {initialData ? 'Editar' : 'Nuevo'}<br />Paciente
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 space-y-2 flex-1">
                                <button
                                    onClick={() => setActiveTab('personal')}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all text-left group relative overflow-hidden",
                                        activeTab === 'personal' ? "bg-white shadow-sm text-primary ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                                    )}
                                >
                                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors", activeTab === 'personal' ? "bg-primary/10" : "bg-transparent group-hover:bg-slate-100")}>
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="relative z-10">Datos Personales</span>
                                    {activeTab === 'personal' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />}
                                </button>

                                <button
                                    onClick={() => setActiveTab('medical')}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all text-left group relative overflow-hidden",
                                        activeTab === 'medical' ? "bg-white shadow-sm text-emerald-600 ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                                    )}
                                >
                                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors", activeTab === 'medical' ? "bg-emerald-50" : "bg-transparent group-hover:bg-slate-100")}>
                                        <Stethoscope className="h-4 w-4" />
                                    </div>
                                    <span className="relative z-10">Ficha Médica</span>
                                    {activeTab === 'medical' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-600 rounded-r-full" />}
                                </button>
                            </div>

                            <div className="p-8 mt-auto opacity-50 hidden md:block">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Complete los campos obligatorios para dar de alta al paciente en el sistema.
                                </div>
                            </div>
                        </div>

                        {/* MAIN CONTENT FORM */}
                        <div className="flex-1 flex flex-col relative bg-white">

                            {/* Close Button */}
                            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-800 transition-colors z-20">
                                <X className="h-5 w-5" />
                            </button>

                            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                                    <AnimatePresence mode="wait">

                                        {/* --- PERSONAL TAB --- */}
                                        {activeTab === 'personal' && (
                                            <motion.div
                                                key="personal"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-8 max-w-3xl"
                                            >
                                                <div>
                                                    <h3 className="text-2xl font-bold text-slate-800 mb-1">Información Básica</h3>
                                                    <p className="text-slate-400 text-sm">Datos de identificación y contacto.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                                                        <div className="relative group">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                            <input required name="name" value={formData.name} onChange={handleInputChange}
                                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                                                placeholder="Ej: Juan Perez"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">DNI / Pasaporte</label>
                                                        <input required name="dni" value={formData.dni} onChange={handleInputChange}
                                                            className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-800"
                                                            placeholder="Sin puntos"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha Nacimiento</label>
                                                        <div className="relative group">
                                                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange}
                                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-800"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                                                placeholder="cliente@email.com"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Teléfono</label>
                                                        <div className="relative group">
                                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                            <input name="phone" value={formData.phone} onChange={handleInputChange}
                                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                                                placeholder="011 1234 5678"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Obra Social / Prepaga</label>
                                                        <select name="insurance" value={formData.insurance} onChange={handleInputChange}
                                                            className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                                        >
                                                            <option value="" className="text-slate-400">Seleccionar cobertura...</option>
                                                            <option value="Particular">Particular</option>
                                                            <option value="OSDE">OSDE</option>
                                                            <option value="OSDE 210">OSDE 210</option>
                                                            <option value="OSDE 310">OSDE 310</option>
                                                            <option value="Swiss Medical">Swiss Medical</option>
                                                            <option value="Galeno">Galeno</option>
                                                            <option value="PAMI">PAMI</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* --- MEDICAL TAB --- */}
                                        {activeTab === 'medical' && (
                                            <motion.div
                                                key="medical"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-8 max-w-3xl"
                                            >
                                                <div>
                                                    <h3 className="text-2xl font-bold text-slate-800 mb-1">Antecedentes Clínicos</h3>
                                                    <p className="text-slate-400 text-sm">Historial médico y archivos adjuntos.</p>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Motivo Principal
                                                        </label>
                                                        <textarea
                                                            name="currentCondition" value={formData.currentCondition} onChange={handleInputChange}
                                                            placeholder="Describa el motivo de la consulta o enfermedad actual..."
                                                            className="w-full p-4 h-24 rounded-xl border border-slate-200 bg-emerald-50/10 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none font-medium text-slate-700"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Antecedentes</label>
                                                            <textarea
                                                                name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange}
                                                                placeholder="Patologías previas..."
                                                                className="w-full p-4 h-32 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium text-slate-700"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Medicación</label>
                                                            <textarea
                                                                name="medications" value={formData.medications} onChange={handleInputChange}
                                                                placeholder="Medicación habitual..."
                                                                className="w-full p-4 h-32 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium text-slate-700"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-sm font-bold text-slate-700">Archivos Adjuntos</h4>
                                                            <label className="cursor-pointer bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold border border-primary/20 hover:bg-primary/10 transition-colors flex items-center gap-2 shadow-sm">
                                                                <Upload className="h-4 w-4" /> Subir Archivos
                                                                <input type="file" multiple className="hidden" onChange={handleFileAdd} />
                                                            </label>
                                                        </div>

                                                        {files.length === 0 ? (
                                                            <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                                                                Sin archivos adjuntos
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {files.map(file => (
                                                                    <div key={file.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                                            {file.name.split('.').pop().substring(0, 3)}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="text-sm font-bold text-slate-700 truncate">{file.name}</div>
                                                                            <input
                                                                                className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-300 w-full"
                                                                                placeholder="Añadir nota..."
                                                                                value={file.note || ''} onChange={(e) => updateFileNote(file.id, e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <button onClick={() => removeFile(file.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 md:px-12 border-t border-slate-100 bg-white z-10 flex justify-between items-center h-20">
                                    {activeTab === 'medical' ? (
                                        <Button variant="ghost" onClick={() => setActiveTab('personal')} className="text-slate-400 hover:text-slate-800 font-bold">
                                            <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
                                        </Button>
                                    ) : (
                                        <div />
                                    )}

                                    <Button
                                        type={activeTab === 'personal' ? 'button' : 'submit'}
                                        onClick={activeTab === 'personal' ? () => setActiveTab('medical') : undefined}
                                        className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 shadow-lg shadow-primary/20 font-bold transition-all active:scale-95"
                                    >
                                        {activeTab === 'personal' ? 'Siguiente' : (initialData ? 'Guardar Cambios' : 'Crear Paciente')}
                                        {activeTab === 'personal' && <ChevronRight className="h-4 w-4 ml-2" />}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

// Helper icon export
function ChevronRight({ className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>;
}