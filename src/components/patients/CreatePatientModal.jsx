import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, User, ArrowLeft, CheckCircle2, Stethoscope, UserPlus, Pencil } from 'lucide-react';
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
            // Try to map files if they exist in a compatible format
            const existingFiles = initialData.medicalHistory?.files || initialData.medicalData?.files || [];
            setFiles(existingFiles);
        } else if (isOpen && !initialData) {
            // Reset if creating new
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

        // Prepare object
        const patientData = {
            ...formData,
            id: initialData ? initialData.id : `new-${Date.now()}`, // Keep ID if editing
            contact: {
                email: formData.email,
                phone: formData.phone,
                whatsapp_normalized: formData.phone.replace(/\D/g, '')
            },
            medicalData: { // Standardize this structure
                currentCondition: formData.currentCondition,
                medicalHistory: formData.medicalHistory,
                medications: formData.medications,
                files: files
            },
            medicalHistory: { // Backward compatibility with mock data structure
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

        // Trigger Success Animation
        setIsSuccess(true);

        // Actual Submit logic after short delay or immediately? 
        // Better to submit data immediately but delay close
        onSubmit(patientData);

        // Close after animation
        setTimeout(() => {
            onClose();
            // Reset internal state after closing
            setTimeout(() => {
                setIsSuccess(false);
                setFormData(initialFormState);
                setFiles([]);
                setActiveTab('personal');
            }, 300);
        }, 2000);
    };

    // Usamos createPortal para que el modal esté en el body
    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">

                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={isSuccess ? undefined : onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm dark:bg-slate-950/40"
                    />

                    {/* Modal Principal */}
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-4xl h-[70vh] min-h-[600px] flex md:flex-row flex-col bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                    >

                        {/* SUCCESS OVERLAY */}
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                        className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6"
                                    >
                                        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                                    </motion.div>
                                    <motion.h3
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-2xl font-bold text-slate-800 mb-2"
                                    >
                                        {initialData ? 'Cambios Guardados' : 'Paciente Creado'}
                                    </motion.h3>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-slate-500 font-medium"
                                    >
                                        Los datos se han actualizado correctamente en el sistema.
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Sidebar Izquierdo */}
                        <div className="w-full md:w-[260px] bg-gradient-to-br from-slate-50 to-indigo-50/20 border-r border-indigo-100 flex flex-col shrink-0 relative overflow-hidden">

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

                            <div className="p-6 relative z-10">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl bg-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center",
                                        initialData ? "text-amber-500" : "text-primary"
                                    )}>
                                        {initialData ? <Pencil className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800 leading-tight">
                                        {initialData ? 'Editar' : 'Nuevo'}<br />
                                        <span className="text-primary">Paciente</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="p-4 space-y-2 flex-1 flex flex-col relative z-10">
                                <LayoutGroup>
                                    <button
                                        onClick={() => setActiveTab('personal')}
                                        className={`relative w-full text-left p-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out flex items-center gap-3 outline-none ${activeTab === 'personal' ? 'text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
                                    >
                                        {/* Fondo Activo con Animación Smooth */}
                                        {activeTab === 'personal' && (
                                            <motion.div
                                                layoutId="activeTabBg"
                                                className="absolute inset-0 bg-white shadow-sm border border-slate-100 rounded-xl"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                        <User className="h-4 w-4 relative z-10" />
                                        <span className="relative z-10">Datos Personales</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('medical')}
                                        className={`relative w-full text-left p-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out flex items-center gap-3 outline-none ${activeTab === 'medical' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
                                    >
                                        {activeTab === 'medical' && (
                                            <motion.div
                                                layoutId="activeTabBg"
                                                className="absolute inset-0 bg-white shadow-sm border border-slate-100 rounded-xl"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                        <Stethoscope className="h-4 w-4 relative z-10" />
                                        <span className="relative z-10">Ficha Médica</span>
                                    </button>
                                </LayoutGroup>
                            </div>

                            {/* Footer del Sidebar */}
                            <div className="p-6 relative z-10 opacity-70">
                                <div className="flex items-center gap-2">
                                    <div className={cn("h-2 w-2 rounded-full animate-pulse", initialData ? "bg-amber-500" : "bg-emerald-500")}></div>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                        {initialData ? 'Modificando Registro' : 'Creando Perfil'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Panel Derecho (Contenido) */}
                        <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">

                            {/* Botón Cerrar */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all duration-200 z-20"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                                {/* Contenedor Scrollable */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                                    <AnimatePresence mode='wait'>
                                        {activeTab === 'personal' ? (
                                            <motion.div
                                                key="personal"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.25, ease: "easeOut" }}
                                                className="space-y-6"
                                            >
                                                <div className="flex items-center gap-2 pb-2 border-b border-indigo-50">
                                                    <User className="h-4 w-4 text-primary" />
                                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Información Personal</h3>
                                                </div>

                                                <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                                                    {/* Nombre completa toda la fila */}
                                                    <div className="col-span-12 md:col-span-7 space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">Apellido y Nombre</label>
                                                        <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej: Juan Perez" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm font-medium" />
                                                    </div>

                                                    {/* DNI */}
                                                    <div className="col-span-12 md:col-span-5 space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">Documento</label>
                                                        <input required name="dni" value={formData.dni} onChange={handleInputChange} placeholder="Ingresar sin puntos" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm font-medium" />
                                                    </div>

                                                    {/* Email */}
                                                    <div className="col-span-12 md:col-span-6 space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">Correo Electrónico</label>
                                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="nombre@ejemplo.com" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm font-medium" />
                                                    </div>

                                                    {/* Teléfono */}
                                                    <div className="col-span-12 md:col-span-6 space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">Teléfono Móvil</label>
                                                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(011) 15-1234-5678" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm font-medium" />
                                                    </div>

                                                    {/* Nacimiento y Obra Social en una fila */}
                                                    <div className="col-span-12 md:col-span-4 space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">Fecha de Nacimiento</label>
                                                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-slate-600 text-sm font-medium" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-8 space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">Cobertura Médica</label>
                                                        <select name="insurance" value={formData.insurance} onChange={handleInputChange} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 cursor-pointer text-sm font-medium appearance-none">
                                                            <option value="">Seleccionar cobertura...</option>
                                                            <option value="Particular">Particular</option>
                                                            <option value="OSDE">OSDE</option>
                                                            <option value="OSDE 210">OSDE 210</option>
                                                            <option value="OSDE 310">OSDE 310</option>
                                                            <option value="Swiss Medical">Swiss Medical</option>
                                                            <option value="Galeno">Galeno</option>
                                                            <option value="PAMI">PAMI</option>
                                                            <option value="Otra">Otra</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </motion.div>

                                        ) : (

                                            <motion.div
                                                key="medical"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.25, ease: "easeOut" }}
                                                className="space-y-6"
                                            >
                                                <div className="flex items-center gap-2 pb-2 border-b border-emerald-50">
                                                    <Stethoscope className="h-4 w-4 text-emerald-500" />
                                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Ficha Clínica</h3>
                                                </div>

                                                {/* Motivo de Consulta - Prioridad visual */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 ml-1">Motivo de Consulta / Enfermedad Actual</label>
                                                    <textarea
                                                        name="currentCondition"
                                                        value={formData.currentCondition}
                                                        onChange={handleInputChange}
                                                        placeholder="Describa el motivo de la consulta..."
                                                        className="w-full p-3.5 h-20 rounded-xl border border-slate-200 bg-emerald-50/30 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 resize-none text-sm font-medium leading-relaxed"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 h-full">
                                                    <div className="space-y-1.5 flex flex-col">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">Antecedentes Patológicos</label>
                                                        <textarea
                                                            name="medicalHistory"
                                                            value={formData.medicalHistory}
                                                            onChange={handleInputChange}
                                                            placeholder="Coadyuvantes, cirugías previas..."
                                                            className="w-full p-3.5 h-24 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 resize-none text-sm font-medium leading-relaxed"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 flex flex-col">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">Medicación Habitual</label>
                                                        <textarea
                                                            name="medications"
                                                            value={formData.medications}
                                                            onChange={handleInputChange}
                                                            placeholder="Drogas, dosis y frecuencia..."
                                                            className="w-full p-3.5 h-24 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all duration-200 resize-none text-sm font-medium leading-relaxed"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Sección Compacta de Archivos */}
                                                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-500">Documentos Adjuntos ({files.length})</span>
                                                        <label className="cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-primary shadow-sm hover:bg-slate-50 hover:border-primary/30 transition-all duration-200 flex items-center gap-2">
                                                            <Upload className="h-3 w-3" />
                                                            Subir Archivo
                                                            <input type="file" multiple className="hidden" onChange={handleFileAdd} />
                                                        </label>
                                                    </div>

                                                    {files.length > 0 && (
                                                        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100/50 mt-1">
                                                            <AnimatePresence>
                                                                {files.map(file => (
                                                                    <motion.div
                                                                        layout
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                                        key={file.id}
                                                                        className="w-full bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm relative group hover:shadow-md transition-all duration-200 flex items-start gap-3"
                                                                    >
                                                                        <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase shrink-0">
                                                                            {file.name.split('.').pop().substring(0, 3)}
                                                                        </div>

                                                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                                            <div className="text-xs font-bold text-slate-700 truncate pr-6">{file.name}</div>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Agregar nota (opcional)..."
                                                                                className="w-full text-[11px] bg-slate-50 border-none rounded px-2 py-1 text-slate-600 focus:ring-1 focus:ring-primary/20 placeholder:text-slate-300"
                                                                                value={file.note || ''}
                                                                                onChange={(e) => updateFileNote(file.id, e.target.value)}
                                                                            />
                                                                        </div>

                                                                        <motion.button
                                                                            onClick={() => removeFile(file.id)}
                                                                            whileHover={{ scale: 1.1 }}
                                                                            whileTap={{ scale: 0.9 }}
                                                                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <X className="h-3.5 w-3.5" />
                                                                        </motion.button>
                                                                    </motion.div>
                                                                ))}
                                                            </AnimatePresence>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Footer Compacto con Animaciones de Botones */}
                                <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center z-10 shrink-0 h-16">
                                    <AnimatePresence>
                                        {activeTab === 'medical' && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Button type="button" variant="ghost" onClick={() => setActiveTab('personal')} className="text-slate-500 hover:text-slate-800 hover:bg-slate-50 h-9 px-4 rounded-lg text-sm transition-all duration-200">
                                                    <ArrowLeft className="mr-2 h-3 w-3" /> Atrás
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="ml-auto flex items-center gap-2">
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'personal' ? (
                                                <motion.div
                                                    key="next-btn"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Button type="button" onClick={() => setActiveTab('medical')} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 shadow-lg shadow-primary/20 font-bold text-sm transition-all duration-200 active:scale-95">
                                                        Siguiente paso
                                                    </Button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="save-btn"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl h-10 px-6 font-bold text-sm flex items-center transition-all duration-200 active:scale-95">
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        {initialData ? 'Guardar Cambios' : 'Confirmar Alta'}
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}