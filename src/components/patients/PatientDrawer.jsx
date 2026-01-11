import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { X, Calendar, MessageCircle, FileText, User, Phone, Mail, Clock, Activity, History, Pill, UploadCloud, Stethoscope, ArrowLeft, Download, FileIcon, Trash2, MoreHorizontal, Pencil, Eye, File as LucideFile } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn, getAvatarColor } from "@/lib/utils";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";

export function PatientDrawer({ isOpen, onClose, patient, onEdit }) {
    useScrollLock(!!patient);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [showMenu, setShowMenu] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const menuRef = useRef(null);

    // Reset tab on open
    useEffect(() => {
        if (patient) {
            setActiveTab('info');
            setShowMenu(false);
            setPreviewFile(null);
        }
    }, [patient]);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!patient) return null;

    const formatDate = (dateString, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('es-AR', options);
        } catch (e) { return dateString; }
    };

    const isPreviewable = (file) => {
        const name = file.name || file.file?.name || "";
        const ext = name.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'pdf', 'webp'].includes(ext);
    };

    const downloadFile = (fileObject) => {
        console.log("Downloading file:", fileObject);
        // If it's a real file object (blob)
        if (fileObject.file) {
            const url = URL.createObjectURL(fileObject.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileObject.name || "descarga";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // Mock download for existing mock data since we don't have real URLs
            alert(`Simulando descarga de: ${fileObject.name}`);
        }
    };

    const handleFileClick = (fileObject) => {
        if (isPreviewable(fileObject)) {
            // URL handling
            let url = fileObject.url;
            if (!url && fileObject.file) {
                // Create temp url for Blob/File
                url = URL.createObjectURL(fileObject.file);
            }

            if (url) {
                setPreviewFile({ ...fileObject, tempUrl: url });
            } else {
                console.warn("No valid URL for preview");
            }
        } else {
            downloadFile(fileObject);
        }
    };

    const closePreview = () => {
        setPreviewFile(null);
    };

    // Sort history by date descending if it exists
    const safeHistory = (patient.history || []).sort((a, b) => new Date(b.date) - new Date(a.date));

    // If no explicit history, creating a derived one for display compatibility with legacy data
    const displayHistory = safeHistory.length > 0 ? safeHistory : [
        ...(patient.last_visit ? [{
            date: patient.last_visit,
            title: 'Última Visita Registrada',
            doctor: 'Dr. Villavicencio',
            type: 'Consulta',
            notes: patient.notes || 'Control de rutina.'
        }] : []),
        {
            date: patient.createdAt || '2023-01-01',
            title: 'Alta de Paciente',
            doctor: 'Sistema',
            type: 'Administrativo',
            notes: 'Creación de ficha médica digital.'
        }
    ].sort((a, b) => new Date(b.date) - new Date(a.date));


    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                >

                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm dark:bg-slate-950/40"
                    />

                    {/* Modal Content */}
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-5xl h-[75vh] min-h-[600px] flex md:flex-row flex-col bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                    >

                        {/* Sidebar (Left) */}
                        <div className="w-full md:w-[280px] bg-slate-50/60 border-r border-slate-100 flex flex-col shrink-0 relative overflow-hidden backdrop-blur-3xl">

                            {/* Decorative Elements */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-slate-50/50"></div>

                            {/* Header / Profile Summary */}
                            <div className="p-6 relative z-10 flex flex-col items-center text-center">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={cn(
                                        "h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-xl ring-4 ring-white text-white bg-primary",
                                    )}
                                >
                                    {patient.name.charAt(0)}
                                </motion.div>
                                <h2 className="text-xl font-bold text-slate-800 leading-tight mb-1">{patient.name}</h2>
                                <p className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm truncate max-w-full mt-2">
                                    {patient.contact?.email || 'Sin email'}
                                </p>
                            </div>

                            {/* Navigation */}
                            <div className="px-4 py-2 space-y-1 flex-1 flex flex-col relative z-20 overflow-y-auto custom-scrollbar">
                                <LayoutGroup id="patient-drawer-nav">
                                    {[
                                        { id: 'info', label: 'General', icon: User },
                                        { id: 'medical', label: 'Ficha Clínica', icon: Stethoscope },
                                        { id: 'history', label: 'Historial', icon: History },
                                        { id: 'files', label: 'Archivos', icon: UploadCloud }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`relative w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ease-out flex items-center gap-3 outline-none group ${activeTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    layoutId="activeTabBg"
                                                    className="absolute inset-0 bg-white shadow-sm border border-slate-100 rounded-xl"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            <tab.icon className={`h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110 ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`} />
                                            <span className="relative z-10">{tab.label}</span>
                                        </button>
                                    ))}
                                </LayoutGroup>
                            </div>

                            {/* Sidebar Footer Actions */}
                            <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-slate-100 relative z-30 flex flex-col gap-3">
                                <Button
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => {
                                            navigate('/nuevo-turno', { state: { patient } });
                                        }, 300);
                                    }}
                                    className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold text-xs h-11 transition-all duration-300 active:scale-95 group border border-transparent">
                                    <Calendar className="h-4 w-4 mr-2 group-hover:animate-pulse text-white/90" />
                                    Agendar Turno
                                </Button>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="flex-1 h-10 text-xs font-bold border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm">
                                        <MessageCircle className="h-4 w-4 mr-2 text-emerald-500" />
                                        WhatsApp
                                    </Button>

                                    {/* More Options Menu Toggle */}
                                    <div className="relative" ref={menuRef}>
                                        <button
                                            onClick={() => setShowMenu(!showMenu)}
                                            className={cn(
                                                "h-10 w-10 flex items-center justify-center rounded-xl border transition-all duration-300",
                                                showMenu
                                                    ? "bg-slate-100 text-slate-900 border-slate-300 scale-95"
                                                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>

                                        <AnimatePresence>
                                            {showMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute bottom-[calc(100%+8px)] right-0 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 origin-bottom-right z-50 ring-1 ring-slate-900/5"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            onClick={() => {
                                                                if (onEdit) onEdit(patient);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all group"
                                                        >
                                                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                                <Pencil className="h-4 w-4" />
                                                            </div>
                                                            <div className="text-left">
                                                                <span className="block text-slate-700 group-hover:text-primary">Editar Perfil</span>
                                                                <span className="text-[10px] text-slate-400 font-normal">Modificar datos</span>
                                                            </div>
                                                        </button>

                                                        <div className="h-px bg-slate-50 my-1 mx-2" />

                                                        <button onClick={() => { }} className="w-full flex items-center gap-3 px-3 py-3 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group">
                                                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
                                                                <Trash2 className="h-4 w-4" />
                                                            </div>
                                                            <div className="text-left">
                                                                <span className="block text-slate-700 group-hover:text-red-700">Eliminar</span>
                                                                <span className="text-[10px] text-slate-400 font-normal">Acción irreversible</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Area (Right) */}
                        <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-500 transition-all duration-300 z-20 group"
                            >
                                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10">
                                <AnimatePresence mode="wait">
                                    {/* TAB: INFO */}
                                    {activeTab === 'info' && (
                                        <motion.div
                                            key="info"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-10"
                                        >
                                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Información Personal</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                                <div className="space-y-2 group">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-primary transition-colors">Documento</span>
                                                    <p className="text-lg font-semibold text-slate-700">{patient.dni || '-'}</p>
                                                </div>
                                                <div className="space-y-2 group">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-primary transition-colors">Nacimiento</span>
                                                    <p className="text-lg font-semibold text-slate-700">{patient.birthDate || '-'}</p>
                                                </div>
                                                <div className="space-y-2 group">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-primary transition-colors">Email</span>
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <Mail className="h-4 w-4 text-slate-300" />
                                                        <p className="text-lg font-semibold truncate">{patient.contact?.email || '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 group">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-primary transition-colors">Teléfono</span>
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <Phone className="h-4 w-4 text-slate-300" />
                                                        <p className="text-lg font-semibold">{patient.contact?.phone || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                                    <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                                                        <FileText className="h-4 w-4 text-amber-500" />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Notas</h3>
                                                </div>
                                                <div className="bg-amber-50/30 rounded-2xl p-6 border border-amber-100/50 hover:border-amber-200 transition-colors duration-300">
                                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{patient.notes || "No hay notas registradas."}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* TAB: MEDICAL */}
                                    {activeTab === 'medical' && (
                                        <motion.div
                                            key="medical"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-10"
                                        >
                                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                                    <Activity className="h-4 w-4 text-emerald-600" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Ficha Clínica</h3>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-all duration-300">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                                        <Activity className="h-3.5 w-3.5" /> Motivo de Consulta
                                                    </h4>
                                                    <p className="text-base font-medium text-slate-700 leading-relaxed">
                                                        {patient.medicalHistory?.currentIllness || "Sin registro actual."}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                                            <History className="h-3.5 w-3.5" /> Antecedentes
                                                        </h4>
                                                        <p className="text-sm text-slate-600 leading-relaxed">
                                                            {patient.medicalHistory?.pathological || "Sin antecedentes relevados."}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                                            <Pill className="h-3.5 w-3.5" /> Medicación
                                                        </h4>
                                                        <p className="text-sm text-slate-600 leading-relaxed">
                                                            {patient.medicalHistory?.medication || "Niega medicación habitual."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* TAB: HISTORY */}
                                    {activeTab === 'history' && (
                                        <motion.div
                                            key="history"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Historial de Visitas</h3>
                                            </div>

                                            <div className="relative pl-6 space-y-8 before:absolute before:left-[19px] before:top-2 before:h-full before:w-[2px] before:bg-slate-100 before:rounded-full">
                                                {displayHistory.map((event, idx) => (
                                                    <div key={idx} className="relative pl-8 group">
                                                        {/* Dot */}
                                                        <div className={cn(
                                                            "absolute left-[2px] top-2 h-3.5 w-3.5 rounded-full border-[3px] border-white ring-1 shadow-sm z-10 transition-all duration-300",
                                                            "ring-slate-100 bg-slate-200 group-hover:bg-primary group-hover:scale-110"
                                                        )}></div>

                                                        <div
                                                            className="flex flex-col bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 cursor-pointer transition-all duration-300 relative group/card"
                                                        >
                                                            {/* Hover Action Overlay */}
                                                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 z-10 rounded-2xl">
                                                                <Button size="sm" className="h-9 px-4 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-lg font-bold text-xs ring-1 ring-black/5">Ver Detalle</Button>
                                                            </div>

                                                            {/* Header Line */}
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{formatDate(event.date, { weekday: 'long' })}</span>
                                                                        <span className="text-xs text-slate-300">•</span>
                                                                        <span className="text-xs font-bold text-slate-500">{formatDate(event.date)}</span>
                                                                    </div>
                                                                    <h4 className="text-base font-bold text-slate-800">{event.title}</h4>
                                                                </div>
                                                                <span className={cn(
                                                                    "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide",
                                                                    event.type === 'Consulta' ? "bg-primary/10 text-primary" :
                                                                        event.type === 'Urgencia' ? "bg-red-50 text-red-600" :
                                                                            "bg-slate-100 text-slate-600"
                                                                )}>
                                                                    {event.type}
                                                                </span>
                                                            </div>

                                                            {/* Doctor info */}
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded-lg w-fit">
                                                                <User className="h-3.5 w-3.5 text-primary/70" />
                                                                <span className="font-semibold">{event.doctor}</span>
                                                            </div>

                                                            {/* Notes if available */}
                                                            {event.notes && (
                                                                <div className="text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-2">
                                                                    {event.notes}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* TAB: FILES */}
                                    {activeTab === 'files' && (
                                        <motion.div
                                            key="files"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <UploadCloud className="h-4 w-4 text-primary" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Archivos</h3>
                                            </div>

                                            {patient.medicalHistory?.files && patient.medicalHistory.files.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {patient.medicalHistory.files.map((file, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => handleFileClick(file)}
                                                            className="group flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                                        >
                                                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                                <LucideFile className="h-6 w-6" />
                                                            </div>
                                                            <div className="flex-1 min-w-0 py-0.5">
                                                                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-primary transition-colors">{file.file?.name || file.name || "Documento"}</p>
                                                                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{file.note || "Sin notas"}</p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md group-hover:bg-primary/5 transition-colors">
                                                                        {formatDate(file.date || new Date().toISOString())}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="p-2 text-slate-300 hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100">
                                                                {isPreviewable(file) ? <Eye className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-40 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <LucideFile className="h-10 w-10 text-slate-300 mb-2 opacity-50" />
                                                    <p className="text-sm text-slate-500 font-medium">No hay archivos adjuntos</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>
                        </div>

                        {/* File Preview Modal (Overlay) */}
                        <AnimatePresence>
                            {previewFile && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-slate-900/5 backdrop-blur-sm flex items-center justify-center bg-white"
                                >
                                    <div className="absolute inset-0 bg-white flex flex-col md:flex-row">

                                        {/* Left: Preview Area */}
                                        <div className="flex-1 bg-slate-50 relative flex items-center justify-center p-6 border-r border-slate-200 overflow-hidden">
                                            {/* Top Bar Floating for Mobile Close */}
                                            <button
                                                onClick={closePreview}
                                                className="absolute top-4 left-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-700 shadow-sm border border-slate-200 md:hidden z-10"
                                            >
                                                <ArrowLeft className="h-5 w-5" />
                                            </button>

                                            {previewFile.tempUrl && previewFile.name?.toLowerCase().endsWith('.pdf') ? (
                                                <iframe src={previewFile.tempUrl} className="w-full h-full rounded-xl border border-slate-200 shadow-sm bg-white" title="Preview" />
                                            ) : (
                                                <motion.img
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    src={previewFile.tempUrl}
                                                    alt="Preview"
                                                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                                                />
                                            )}
                                        </div>

                                        {/* Right: Sidebar Info */}
                                        <div className="w-full md:w-[320px] bg-white flex flex-col shrink-0 h-full relative z-20 shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.05)]">

                                            {/* Header */}
                                            <div className="p-5 border-b border-slate-100 flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-bold text-slate-800 text-sm truncate leading-tight pr-2">{previewFile.name || previewFile.file?.name}</h3>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{previewFile.name?.split('.').pop() || 'Archivo'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={closePreview}
                                                    className="p-1.5 -mr-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Content Scrollable */}
                                            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                                                {/* Date Info */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        <Clock className="h-3 w-3" /> Fecha de carga
                                                    </label>
                                                    <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                        {new Date(previewFile.date).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' })}
                                                    </p>
                                                </div>

                                                {/* Notes Section with visual prominence */}
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        <MessageCircle className="h-3 w-3" /> Notas del Archivo
                                                    </label>
                                                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 min-h-[120px] relative">
                                                        {previewFile.note ? (
                                                            <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                                                                "{previewFile.note}"
                                                            </p>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-4">
                                                                <MessageCircle className="h-5 w-5 opacity-50" />
                                                                <span className="text-xs font-medium">Sin notas adjuntas</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Footer Actions */}
                                            <div className="p-5 border-t border-slate-100 bg-slate-50/30">
                                                <Button
                                                    onClick={() => downloadFile(previewFile)}
                                                    className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl h-11 transition-all duration-300"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Descargar Original
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
