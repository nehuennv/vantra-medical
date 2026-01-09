import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Calendar, Clock, ChevronRight, User, Check, X, FileText, Stethoscope, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPatients } from '@/data/mockPatients';
import { CreatePatientModal } from '@/components/patients/CreatePatientModal';
import { cn } from '@/lib/utils';
import { calComService } from '@/services/calComService';

export function NewAppointmentPage({ onNavigate }) {
    const [step, setStep] = useState(1); // 1: Select Patient, 2: Select Date/Time, 3: Success
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Create Appointment Form State
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState('');
    const [availableSlots, setAvailableSlots] = useState({}); // { "DateName": ["10:00", ...] }
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    // Initial load of slots when entering step 2
    useEffect(() => {
        if (step === 2) {
            loadSlots();
        }
    }, [step]);

    const loadSlots = async () => {
        setIsLoadingSlots(true);
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        try {
            const slots = await calComService.getAvailableSlots(today, nextWeek);
            setAvailableSlots(slots);

            // Auto select today if available, or first available
            const dateKeys = Object.keys(slots);
            if (dateKeys.length > 0) {
                // Ideally pick matching today
                if (slots[today.toDateString()]) setSelectedDate(today.toDateString());
                else setSelectedDate(dateKeys[0]);
            }
        } catch (error) {
            console.error("Failed to load slots", error);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    // Filter patients
    const filteredPatients = searchQuery.length > 1
        ? mockPatients.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.dni.includes(searchQuery)
        )
        : [];

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setTimeout(() => setStep(2), 200);
    };

    const handleCreatePatientSubmit = (newPatient) => {
        setSelectedPatient(newPatient);
        setIsCreateModalOpen(false);
        setTimeout(() => setStep(2), 200);
    };

    const handleConfirmAppointment = async () => {
        setIsBooking(true);
        try {
            await calComService.createBooking({
                name: selectedPatient.name,
                email: selectedPatient.contact?.email || "no-email@example.com",
                startISO: new Date(`${selectedDate} ${selectedTime}`).toISOString(),
                notes: reason
            });
            setStep(3);
        } catch (e) {
            console.error(e);
            alert("Error al agendar");
        } finally {
            setIsBooking(false);
        }
    };

    // Helper to generate date options for UI
    const getDateOptions = () => {
        const options = [];
        const d = new Date();
        for (let i = 0; i < 6; i++) {
            const temp = new Date(d);
            temp.setDate(temp.getDate() + i);
            options.push(temp);
        }
        return options;
    };

    const currentSlots = selectedDate ? (availableSlots[selectedDate] || []) : [];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nuevo Turno</h1>
                    <p className="text-slate-500 mt-2">Agende una cita sincronizada con Cal.com.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-12">
                    <div className={cn("flex items-center gap-3 transition-colors duration-300", step >= 1 ? "text-indigo-600" : "text-slate-400")}>
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2", step >= 1 ? "border-indigo-600 bg-indigo-50" : "border-slate-300")}>1</div>
                        <span className="font-semibold text-sm">Seleccionar Paciente</span>
                    </div>
                    <div className="h-px w-12 bg-slate-200" />
                    <div className={cn("flex items-center gap-3 transition-colors duration-300", step >= 2 ? "text-indigo-600" : "text-slate-400")}>
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2", step >= 2 ? "border-indigo-600 bg-indigo-50" : "border-slate-300")}>2</div>
                        <span className="font-semibold text-sm">Detalles del Turno</span>
                    </div>
                    <div className="h-px w-12 bg-slate-200" />
                    <div className={cn("flex items-center gap-3 transition-colors duration-300", step >= 3 ? "text-indigo-600" : "text-slate-400")}>
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2", step >= 3 ? "border-indigo-600 bg-indigo-50" : "border-slate-300")}>3</div>
                        <span className="font-semibold text-sm">Confirmación</span>
                    </div>
                </div>

                {/* Main Content Card */}
                <motion.div
                    layout
                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[600px] relative"
                >
                    <AnimatePresence mode="wait">

                        {/* STEP 1: PATIENT SELECTION */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8 lg:p-12 h-full flex flex-col"
                            >
                                <div className="max-w-2xl mx-auto w-full space-y-8">
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-bold text-slate-800">¿A quién asignamos el turno?</h2>
                                        <p className="text-slate-500">Busque un paciente existente o cree uno nuevo.</p>
                                    </div>

                                    {/* Search Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Buscar por nombre, DNI o email..."
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-lg"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Search Results */}
                                    <div className="space-y-3 min-h-[300px]">
                                        {searchQuery.length > 1 ? (
                                            filteredPatients.length > 0 ? (
                                                filteredPatients.map(patient => (
                                                    <motion.button
                                                        key={patient.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        onClick={() => handlePatientSelect(patient)}
                                                        className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all group flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                                {patient.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{patient.name}</h4>
                                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                    <span>DNI: {patient.dni}</span>
                                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                    <span>{patient.insurance || 'Particular'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                                    </motion.button>
                                                ))
                                            ) : (
                                                <div className="text-center py-10">
                                                    <p className="text-slate-500">No se encontraron pacientes con esa búsqueda.</p>
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 opacity-50 space-y-4">
                                                <User className="h-12 w-12 text-slate-300" />
                                                <p className="text-sm text-slate-400">Ingrese al menos 2 caracteres para buscar</p>
                                            </div>
                                        )}

                                        {/* Create New Separator */}
                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                            <div className="relative flex justify-center"><span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">O si es nuevo</span></div>
                                        </div>

                                        <Button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            variant="outline"
                                            className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group font-bold"
                                        >
                                            <UserPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                            Crear Nuevo Paciente
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: DETAILS */}
                        {step === 2 && selectedPatient && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8 lg:p-12 h-full flex flex-col"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                                    {/* Left Sidebar: Selected Context */}
                                    <div className="lg:col-span-4 space-y-6">
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Paciente Seleccionado</h3>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md hover:scale-105 transition-transform">
                                                    {selectedPatient.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-slate-800 text-sm truncate">{selectedPatient.name}</h4>
                                                    <p className="text-xs text-slate-500">{selectedPatient.insurance || 'Particular'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedPatient(null); setStep(1); }}
                                                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                                            >
                                                Cambiar Paciente
                                            </button>
                                        </div>

                                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                            <h3 className="text-xs font-bold text-amber-500/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <Stethoscope className="h-3 w-3" /> Última Actividad
                                            </h3>
                                            <p className="text-sm font-medium text-slate-700 italic">
                                                "{selectedPatient.medicalHistory?.currentIllness || selectedPatient.notes || "Sin antecedentes recientes."}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Content: Form */}
                                    <div className="lg:col-span-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800 mb-1">Disponibilidad</h2>
                                                <p className="text-slate-500 text-sm">Datos sincronizados con Cal.com</p>
                                            </div>
                                            {isLoadingSlots && <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Date Selection */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-700">Fecha</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {getDateOptions().map((d, i) => {
                                                        const dateKey = d.toDateString();
                                                        const isSelected = selectedDate === dateKey;
                                                        const hasSlots = availableSlots[dateKey] && availableSlots[dateKey].length > 0;
                                                        return (
                                                            <button
                                                                key={i}
                                                                disabled={!hasSlots && !isLoadingSlots}
                                                                onClick={() => {
                                                                    setSelectedDate(dateKey);
                                                                    setSelectedTime(null);
                                                                }}
                                                                className={cn(
                                                                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 relative overflow-hidden",
                                                                    isSelected
                                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-105"
                                                                        : hasSlots ? "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50" : "bg-slate-50 border-slate-100 text-slate-300"
                                                                )}
                                                            >
                                                                <span className="text-xs opacity-80 uppercase font-bold">{d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')}</span>
                                                                <span className="text-lg font-bold">{d.getDate()}</span>
                                                                {!hasSlots && !isLoadingSlots && <div className="absolute inset-0 bg-slate-100/50" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Time Selection */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-700">Horarios Disponibles</label>
                                                <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                                                    {isLoadingSlots ? (
                                                        <div className="col-span-2 py-8 text-center text-slate-400 text-sm">Cargando horarios...</div>
                                                    ) : currentSlots.length > 0 ? (
                                                        currentSlots.map(time => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setSelectedTime(time)}
                                                                className={cn(
                                                                    "py-2.5 px-3 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2",
                                                                    selectedTime === time
                                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                                                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                                                                )}
                                                            >
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {time}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-2 py-8 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                            No hay horarios disponibles para esta fecha.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reason */}
                                        <div className="space-y-3 pt-2">
                                            <label className="text-sm font-bold text-slate-700">Motivo de Consulta</label>
                                            <textarea
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder="Describa brevemente la razón de la visita..."
                                                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none h-24 text-sm font-medium"
                                            />
                                        </div>

                                        {/* Next Button */}
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                onClick={handleConfirmAppointment}
                                                disabled={!selectedDate || !selectedTime || isBooking}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                            >
                                                {isBooking ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        Agendando...
                                                    </>
                                                ) : (
                                                    "Confirmar Turno"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-12"
                            >
                                <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-in zoom-in duration-500">
                                    <Check className="h-12 w-12" strokeWidth={3} />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">¡Turno Agendado con Éxito!</h1>
                                <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
                                    Se ha enviado una confirmación por WhatsApp a <strong>{selectedPatient.name}</strong> para el día <strong>{selectedDate}</strong> a las <strong>{selectedTime}hs</strong>.
                                </p>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => {
                                            setStep(1);
                                            setSelectedPatient(null);
                                            setSelectedDate(null);
                                            setSelectedTime(null);
                                            setReason('');
                                        }}
                                        variant="outline"
                                        className="h-12 px-6 rounded-xl border-slate-200 hover:border-slate-300 font-bold"
                                    >
                                        Agendar Otro
                                    </Button>
                                    <Button
                                        onClick={() => onNavigate && onNavigate('dashboard')} // Go back to dashboard
                                        className="h-12 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-lg"
                                    >
                                        Volver al Inicio
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Modal Injection */}
            <CreatePatientModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePatientSubmit}
            />

        </div>
    );
}
