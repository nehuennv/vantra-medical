import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Clock, ChevronRight, User, Check, ArrowLeft, Calendar as CalendarIcon, Loader2, CalendarX, Stethoscope, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPatients } from '@/data/mockPatients';
import { CreatePatientModal } from '@/components/patients/CreatePatientModal';
import { cn } from '@/lib/utils';
import { calComService } from '@/services/calComService';

export function NewAppointmentPage() {
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check for pre-selected patient or date from navigation
    useEffect(() => {
        if (location.state?.patient) {
            setSelectedPatient(location.state.patient);
            setStep(2);
        }
        // Store date preference for Step 2
    }, [location.state]);

    // Form
    const [selectedDateKey, setSelectedDateKey] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState('');

    // Data
    const [availableSlots, setAvailableSlots] = useState({});
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    // Calendar State
    const [viewMonth, setViewMonth] = useState(new Date());

    useEffect(() => {
        if (location.state?.preSelectedDate) {
            const preDate = new Date(location.state.preSelectedDate);
            setViewMonth(preDate);
            // The actual selection is handled in loadSlots priority logic
        }
    }, [location.state]);

    useEffect(() => {
        if (step === 2) loadSlots();
    }, [step, viewMonth]); // Reload when step or month changes

    const loadSlots = async () => {
        setIsLoadingSlots(true);
        setSlotsError(false);

        // Calculate start and end of viewMonth
        const startOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
        const endOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);

        try {
            const slots = await calComService.getAvailableSlots(startOfMonth, endOfMonth);
            setAvailableSlots(slots);

            // Handle Pre-selection priority (only if not already set by user interaction)
            if (location.state?.preSelectedDate && !selectedDateKey) {
                const preDateKey = new Date(location.state.preSelectedDate).toISOString().split('T')[0];
                if (slots[preDateKey] || new Date(location.state.preSelectedDate).getMonth() === viewMonth.getMonth()) {
                    setSelectedDateKey(preDateKey);
                }
            }
        } catch (error) {
            console.warn("Slots fetch error", error);
            setSlotsError(true);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleConfirmAppointment = async () => {
        setIsBooking(true);
        try {
            const dateTimeStr = `${selectedDateKey} ${selectedTime}`;
            await calComService.createBooking({
                name: selectedPatient.name,
                email: selectedPatient.contact?.email,
                startISO: new Date(dateTimeStr).toISOString(),
                notes: reason
            });
            setStep(3);
        } catch (e) {
            console.error(e);
        } finally {
            setIsBooking(false);
        }
    };

    // Calendar Helpers
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Mon, 6=Sun) or standard (0=Sun)
        // Standard JS: 0=Sun, 1=Mon. Let's assume standard Sunday start for simplicity or adjust to UI preference.
        // Let's use Monday start for Argentina locale if possible, but Sunday is easier standard. 
        // Sunday=0.
        return day;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(viewMonth);
        newDate.setMonth(newDate.getMonth() + offset);
        setViewMonth(newDate);
        // Optional: clear selection if changing month? No, keep it.
    };

    const weekDays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

    // Animation Variants
    const fadeVariant = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 lg:px-10 pt-0 font-sans pb-32">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nuevo Turno</h1>
                        <p className="text-sm text-slate-500 font-medium">Gestión de citas y disponibilidad.</p>
                    </div>
                    {step > 1 && step < 3 && (
                        <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-slate-500 hover:text-slate-800 hover:bg-white/50">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Atrás
                        </Button>
                    )}
                </div>

                {/* Main Content Card - Glassmorphism & Depth */}
                <motion.div
                    layout
                    className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/60 overflow-hidden min-h-[600px] relative transition-all duration-500"
                >
                    <AnimatePresence mode="wait">

                        {/* STEP 1: PATIENT SELECTION */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={fadeVariant}
                                initial="hidden" animate="visible" exit="exit"
                                className="p-8 lg:p-12 h-full flex flex-col"
                            >
                                <div className="max-w-3xl mx-auto w-full space-y-10">
                                    <div className="text-center space-y-3">
                                        <div className="mx-auto h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
                                            <User className="h-8 w-8" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800">Seleccionar Paciente</h2>
                                        <p className="text-slate-500 max-w-md mx-auto">Busque por nombre o DNI para vincular la historia clínica al nuevo turno.</p>
                                    </div>

                                    {/* Premium Search Input */}
                                    <div className="relative group transistion-all">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Escriba para buscar..."
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50/50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-lg shadow-sm group-hover:bg-white"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Results List */}
                                    <div className="space-y-3">
                                        {searchQuery.length > 1 ? (
                                            mockPatients
                                                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .slice(0, 5) // Limit results for clean look
                                                .map((patient, idx) => (
                                                    <motion.button
                                                        key={patient.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        onClick={() => { setSelectedPatient(patient); setStep(2); }}
                                                        className="w-full md:flex items-center justify-between p-4 rounded-2xl hover:bg-white border border-transparent hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group bg-slate-50/30 text-left"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center font-bold text-lg">
                                                                {patient.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors text-lg">{patient.name}</h4>
                                                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                                                                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {patient.dni}</span>
                                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                    <span className="text-indigo-500 font-medium">{patient.insurance || 'Particular'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 md:mt-0 flex items-center text-slate-300 group-hover:text-indigo-500 transition-colors gap-2 text-sm font-bold">
                                                            Seleccionar <ChevronRight className="h-5 w-5" />
                                                        </div>
                                                    </motion.button>
                                                ))
                                        ) : (
                                            <div className="py-8 text-center">
                                                <Button
                                                    onClick={() => setIsCreateModalOpen(true)}
                                                    variant="outline"
                                                    className="w-full h-16 rounded-2xl border-dashed border-2 border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group font-bold text-base bg-transparent"
                                                >
                                                    <UserPlus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                                                    Registrar Nuevo Paciente
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: AVAILABILITY & DETAILS */}
                        {step === 2 && selectedPatient && (
                            <motion.div
                                key="step2"
                                variants={fadeVariant}
                                initial="hidden" animate="visible" exit="exit"
                                className="h-full flex flex-col lg:flex-row"
                            >
                                {/* Left Panel: Context (Patient) */}
                                <div className="w-full lg:w-1/3 bg-slate-50/50 border-r border-slate-100 p-8 lg:p-10 flex flex-col gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paciente</h3>
                                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/20">
                                                    {selectedPatient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 leading-tight">{selectedPatient.name}</h4>
                                                    <p className="text-sm text-slate-500">{selectedPatient.dni}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                    <span className="truncate">{selectedPatient.contact?.email || 'No email'}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                                                    <Stethoscope className="h-4 w-4 text-slate-400" />
                                                    <span className="truncate">{selectedPatient.medicalHistory?.currentIllness || 'Control General'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Motivo de Consulta</label>
                                        <textarea
                                            value={reason}
                                            onChange={e => setReason(e.target.value)}
                                            className="w-full mt-3 p-4 rounded-2xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm transition-all resize-none shadow-sm h-32"
                                            placeholder="Detalle los síntomas o razón..."
                                        />
                                    </div>
                                </div>

                                {/* Right Panel: Calendar & Time */}
                                <div className="w-full lg:w-2/3 flex flex-col h-full bg-white relative">
                                    <div className="p-8 lg:p-10 flex-1 overflow-y-auto custom-scrollbar">

                                        {/* Header Calendar */}
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Fecha y Hora</h2>
                                                <p className="text-sm text-slate-400 font-medium">Seleccione el momento ideal.</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500 hover:text-indigo-600">
                                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                                </button>
                                                <span className="text-sm font-bold text-slate-700 w-32 text-center capitalize select-none">
                                                    {viewMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500 hover:text-indigo-600">
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Calendar Grid */}
                                        <div className="mb-10">
                                            <div className="grid grid-cols-7 mb-4">
                                                {weekDays.map(day => (
                                                    <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day}</div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                                                {Array.from({ length: getFirstDayOfMonth(viewMonth) }).map((_, i) => (
                                                    <div key={`empty-${i}`} />
                                                ))}
                                                {Array.from({ length: getDaysInMonth(viewMonth) }).map((_, i) => {
                                                    const day = i + 1;
                                                    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
                                                    const dateKey = date.toISOString().split('T')[0];
                                                    const isSelected = selectedDateKey === dateKey;
                                                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                                    // Mock availability check (if we had full month map)
                                                    // Since we fetch slots for range, we check if slots[dateKey] exists
                                                    const hasSlots = availableSlots[dateKey] && availableSlots[dateKey].length > 0;

                                                    return (
                                                        <div key={day} className="flex justify-center">
                                                            <button
                                                                onClick={() => { if (!isPast) { setSelectedDateKey(dateKey); setSelectedTime(null); } }}
                                                                disabled={isPast}
                                                                className={cn(
                                                                    "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all relative",
                                                                    isSelected
                                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-100"
                                                                        : isPast
                                                                            ? "text-slate-300 cursor-not-allowed"
                                                                            : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600",
                                                                    hasSlots && !isSelected && !isPast && "ring-1 ring-slate-200 bg-slate-50/50"
                                                                )}
                                                            >
                                                                {day}
                                                                {hasSlots && !isSelected && (
                                                                    <div className="absolute bottom-1.5 w-1 h-1 bg-indigo-500 rounded-full" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Time Selection */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-indigo-500" />
                                                Horarios Disponibles
                                            </h3>

                                            {selectedDateKey ? (
                                                isLoadingSlots ? (
                                                    <div className="flex items-center gap-3 text-slate-400 text-sm py-4">
                                                        <Loader2 className="h-4 w-4 animate-spin" /> Verificando disponibilidad...
                                                    </div>
                                                ) : availableSlots[selectedDateKey]?.length > 0 ? (
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                        {availableSlots[selectedDateKey].map((time, idx) => (
                                                            <motion.button
                                                                key={`${selectedDateKey}-${time}`}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: idx * 0.02 }}
                                                                onClick={() => setSelectedTime(time)}
                                                                className={cn(
                                                                    "py-2.5 px-2 rounded-xl text-sm font-bold border transition-all text-center", // Removed overflow-hidden
                                                                    selectedTime === time
                                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20 ring-2 ring-indigo-200 ring-offset-1"
                                                                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm"
                                                                )}
                                                            >
                                                                {time}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-slate-400 italic py-2 bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                                                        No hay horarios para esta fecha.
                                                    </div>
                                                )
                                            ) : (
                                                <div className="text-sm text-slate-400 italic py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                                    Seleccione un día en el calendario para ver horarios.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="p-6 border-t border-slate-100 bg-white z-10">
                                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">RESUMEN</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {selectedDateKey ? (
                                                        <span className="font-bold text-slate-800 text-sm">
                                                            {new Date(selectedDateKey).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                                            {selectedTime && ` • ${selectedTime} hs`}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm font-medium text-slate-400 italic">Incompleto</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleConfirmAppointment}
                                                disabled={!selectedTime || isBooking}
                                                className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                                            >
                                                {isBooking ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
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
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-white to-slate-50"
                            >
                                <div className="h-32 w-32 bg-emerald-100/50 rounded-full flex items-center justify-center mb-8 relative">
                                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-20"></div>
                                    <Check className="h-16 w-16 text-emerald-500" strokeWidth={3} />
                                </div>
                                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">¡Turno Confirmado!</h1>
                                <p className="text-slate-500 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
                                    Hemos agendado la cita para <strong>{selectedPatient.name}</strong> y enviado la notificación correspondiente.
                                </p>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => { setStep(1); setSelectedPatient(null); setReason(''); setSelectedTime(null); }}
                                        variant="outline"
                                        className="h-12 px-8 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                        Nuevo Turno
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/agenda')}
                                        className="h-12 px-8 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                                    >
                                        Ir a Agenda
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
                onSubmit={(newPatient) => {
                    setSelectedPatient(newPatient);
                    setIsCreateModalOpen(false);
                    setStep(2);
                }}
            />
        </div>
    );
}
