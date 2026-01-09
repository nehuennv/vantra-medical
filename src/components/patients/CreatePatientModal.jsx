import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Button } from "@/components/ui/button";
import {
    UploadCloud,
    FileText,
    X,
    User,
    CreditCard,
    Calendar,
    Building,
    Phone,
    Mail,
    Activity,
    Pill
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Select Options
const INSURANCE_OPTIONS = [
    { value: 'particular', label: 'Particular' },
    { value: 'osde', label: 'OSDE' },
    { value: 'swiss_medical', label: 'Swiss Medical' },
    { value: 'galeno', label: 'Galeno' },
    { value: 'omint', label: 'Omint' },
];

export function CreatePatientModal({ isOpen, onClose, onSubmit }) {
    useScrollLock(isOpen);

    // FORM STATE
    const [formData, setFormData] = useState({
        // Section A: Administrative
        fullName: "",
        dni: "",
        birthDate: "",
        insurance: "particular",
        phone: "",
        email: "",

        // Section B: Medical
        pathologicalHistory: "",
        currentIllness: "",
        currentMedication: "",
    });

    // FILE UPLOAD STATE
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Close on Escape Key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // HANDLERS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            addFiles(selectedFiles);
        }
    };

    const addFiles = (newFiles) => {
        const filesWithMeta = newFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            note: "",
            uploadDate: new Date().toLocaleDateString('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })
        }));
        setFiles(prev => [...prev, ...filesWithMeta]);
    };

    const handleFileNoteChange = (id, note) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, note } : f));
    }

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPatient = {
            id: `new-${Math.random().toString(36).substr(2, 9)}`,
            name: formData.fullName,
            dni: formData.dni,
            birthDate: formData.birthDate,
            insurance: INSURANCE_OPTIONS.find(opt => opt.value === formData.insurance)?.label || formData.insurance,
            status: 'active',
            contact: {
                phone: formData.phone,
                email: formData.email,
                whatsapp_normalized: formData.phone.replace(/[^0-9]/g, '')
            },
            medicalHistory: {
                pathological: formData.pathologicalHistory,
                currentIllness: formData.currentIllness,
                medication: formData.currentMedication,
                files: files
            }
        };

        if (onSubmit) {
            onSubmit(newPatient);
        }

        onClose();
        setFormData({
            fullName: "",
            dni: "",
            birthDate: "",
            insurance: "particular",
            phone: "",
            email: "",
            pathologicalHistory: "",
            currentIllness: "",
            currentMedication: "",
        });
        setFiles([]);
    };

    const InputWithIcon = ({ icon: Icon, ...props }) => (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Icon className="h-4 w-4" />
            </div>
            <input
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-700"
                {...props}
            />
        </div>
    );

    const TextAreaWithIcon = ({ icon: Icon, ...props }) => (
        <div className="relative group">
            <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Icon className="h-4 w-4" />
            </div>
            <textarea
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 resize-none text-slate-700 min-h-[80px]"
                {...props}
            />
        </div>
    );

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                        className="relative w-full sm:max-w-4xl h-[85vh] sm:h-[90vh] max-h-[90vh] flex flex-col bg-gradient-to-br from-slate-50/90 via-indigo-50/90 to-indigo-100/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            {/* Header - Fixed at Top */}
                            <div className="bg-white/90 backdrop-blur-md border-b border-indigo-100/50 px-6 py-5 flex-none relative z-10 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <User className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        Nuevo Paciente
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1 ml-10">
                                        Complete la ficha digital para dar de alta un nuevo historial clínico.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Scrollable Content Body */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                        {/* LEFT COLUMN: ADMINISTRATIVE */}
                                        <div className="bg-white/70 p-5 rounded-2xl shadow-sm border border-white/50 space-y-4 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 pb-2 border-b border-indigo-100/50">
                                                <div className="h-6 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Datos Administrativos</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Nombre Completo</label>
                                                    <InputWithIcon
                                                        icon={User}
                                                        type="text"
                                                        name="fullName"
                                                        required
                                                        placeholder="Ej. Juan Pérez"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-slate-500 uppercase">DNI</label>
                                                        <InputWithIcon
                                                            icon={CreditCard}
                                                            type="text"
                                                            name="dni"
                                                            required
                                                            placeholder="12.345.678"
                                                            value={formData.dni}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (/^\d*$/.test(val)) handleChange(e);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-slate-500 uppercase">Nacimiento</label>
                                                        <InputWithIcon
                                                            icon={Calendar}
                                                            type="date"
                                                            name="birthDate"
                                                            required
                                                            value={formData.birthDate}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Cobertura</label>
                                                    <div className="relative group">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                            <Building className="h-4 w-4" />
                                                        </div>
                                                        <select
                                                            name="insurance"
                                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 appearance-none"
                                                            value={formData.insurance}
                                                            onChange={handleChange}
                                                        >
                                                            {INSURANCE_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Contacto</label>
                                                    <div className="space-y-3">
                                                        <InputWithIcon
                                                            icon={Phone}
                                                            type="tel"
                                                            name="phone"
                                                            required
                                                            placeholder="+54 9 11..."
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                        />
                                                        <InputWithIcon
                                                            icon={Mail}
                                                            type="email"
                                                            name="email"
                                                            placeholder="juan@ejemplo.com"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        {/* RIGHT COLUMN: MEDICAL */}
                                        <div className="bg-white/70 p-5 rounded-2xl shadow-sm border border-white/50 space-y-4 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 pb-2 border-b border-indigo-100/50">
                                                <div className="h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Ficha Médica</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Antecedentes Patológicos</label>
                                                    <TextAreaWithIcon
                                                        icon={Activity}
                                                        name="pathologicalHistory"
                                                        placeholder="Antecedentes patológicos relevantes..."
                                                        value={formData.pathologicalHistory}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Motivo de Consulta</label>
                                                    <TextAreaWithIcon
                                                        icon={FileText}
                                                        name="currentIllness"
                                                        placeholder="Descripción de la enfermedad actual..."
                                                        value={formData.currentIllness}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Medicación</label>
                                                    <TextAreaWithIcon
                                                        icon={Pill}
                                                        name="currentMedication"
                                                        rows={2}
                                                        placeholder="Medicación habitual..."
                                                        value={formData.currentMedication}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FILE UPLOAD SECTION - FULL WIDTH */}
                                    <div className="bg-white/70 p-5 rounded-2xl shadow-sm border border-white/50 space-y-3 backdrop-blur-sm">
                                        <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                            <UploadCloud className="h-4 w-4" />
                                            Estudios y Adjuntos
                                        </label>

                                        <div
                                            className={cn(
                                                "relative border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer group overflow-hidden",
                                                isDragging
                                                    ? "border-indigo-500 bg-indigo-50"
                                                    : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
                                            )}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleFileDrop}
                                            onClick={() => document.getElementById('file-upload').click()}
                                        >
                                            <input
                                                id="file-upload"
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleFileSelect}
                                            />

                                            <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                                                <div className={cn("p-4 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-110", isDragging ? "bg-indigo-100" : "bg-slate-100")}>
                                                    <UploadCloud className={cn("h-8 w-8", isDragging ? "text-indigo-600" : "text-slate-400")} />
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    <span className="font-bold text-indigo-600 hover:underline">Haga clic</span> o arrastre archivos
                                                </div>
                                                <p className="text-xs text-slate-400">Soporta PDF, Imágenes (Max 25MB)</p>
                                            </div>
                                        </div>

                                        {/* File List */}
                                        {files.length > 0 && (
                                            <div className="grid grid-cols-1 gap-3 mt-4">
                                                {files.map((fileObj) => (
                                                    <div key={fileObj.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl group hover:shadow-sm transition-all">
                                                        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto sm:min-w-[200px]">
                                                            <div className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm text-indigo-500">
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]" title={fileObj.file.name}>{fileObj.file.name}</span>
                                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 w-full relative">
                                                            <input
                                                                type="text"
                                                                placeholder="Añadir nota explicativa..."
                                                                className="w-full text-sm bg-white border-0 border-b border-slate-200 focus:border-indigo-500 px-0 py-2 text-slate-600 placeholder:text-slate-400 focus:ring-0 transition-colors bg-transparent"
                                                                value={fileObj.note}
                                                                onChange={(e) => handleFileNoteChange(fileObj.id, e.target.value)}
                                                            />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(fileObj.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Footer - Fixed at Bottom */}
                            <div className="bg-white/90 backdrop-blur-md border-t border-indigo-100/50 px-6 py-4 flex-none flex justify-end gap-3 z-10">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="rounded-xl px-6 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all min-w-[160px]"
                                >
                                    Guardar Paciente
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
