import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Bell, AppWindow, Building, Save, Mail, Lock, Smartphone, Globe, Moon, Sun, Monitor, CheckCircle2, ChevronRight, LogOut, Loader2, CreditCard, Stethoscope, Briefcase, Key, Settings2 } from 'lucide-react';
import { clientConfig, updateClientConfig } from '@/config/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Simple Switch Component
const SimpleSwitch = ({ checked, onCheckedChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            checked ? "bg-primary" : "bg-slate-200"
        )}
    >
        <span
            className={cn(
                "pointer-events-none block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                checked ? "translate-x-5" : "translate-x-0"
            )}
        />
    </button>
);

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // --- STATE INITIALIZATION WITH CLIENT CONFIG ---
    // Initialize profile state from clientConfig if available, otherwise fallback
    const [profile, setProfile] = useState({
        name: clientConfig.doctorName || 'Dr. Guillermo Villavicencio',
        email: clientConfig.email || 'g.villavicencio@vantra.med',
        specialty: clientConfig.specialty || 'Cirugía Plástica',
        phone: clientConfig.phone || '+54 9 11 5555-5555',
        license: clientConfig.license || 'MN 123456',
        bio: 'Especialista en cirugía reconstructiva y estética con más de 15 años de experiencia.',
        avatar: clientConfig.avatar,
    });

    const [clinic, setClinic] = useState({
        name: clientConfig.name || 'Vantra Medical',
        legalName: clientConfig.legalName || 'Vantra Medical Group S.A.',
        address: clientConfig.address || 'Av. Libertador 1234, CABA',
        phone: clientConfig.clinicPhone || '0800-555-0123',
        website: 'https://vantra.med',
        cuit: '30-71234567-8'
    });

    const [notifications, setNotifications] = useState({
        email_new_booking: true,
        email_cancellations: true,
        push_reminders: false,
        sms_confirmations: true,
        marketing_emails: false,
        weekly_digest: true
    });

    const [security, setSecurity] = useState({
        twoFactor: true,
        sessionTimeout: '30m',
        loginAlerts: true
    });

    // --- SAVE HANDLER ---
    const handleSave = () => {
        setSaving(true);
        setSuccessMsg('');

        // Simulate API delay
        setTimeout(() => {
            // Update the global clientConfig
            updateClientConfig({
                doctorName: profile.name,
                specialty: profile.specialty,
                email: profile.email,
                phone: profile.phone,
                license: profile.license,
                name: clinic.name,
                legalName: clinic.legalName,
                address: clinic.address,
                clinicPhone: clinic.phone,
            });

            setSaving(false);
            setSuccessMsg('Cambios guardados correctamente');

            // Auto hide success message
            setTimeout(() => setSuccessMsg(''), 3000);
        }, 1200);
    };

    const tabs = [
        { id: 'profile', label: 'Mi Perfil', icon: User, desc: 'Información personal y cuenta' },
        { id: 'clinic', label: 'Consultorio', icon: Building, desc: 'Datos de la clínica y branding' },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, desc: 'Alertas y preferencias' },
        { id: 'security', label: 'Seguridad', icon: Shield, desc: 'Contraseña y accesos' },
        { id: 'billing', label: 'Facturación', icon: CreditCard, desc: 'Planes y métodos de pago' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 200
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[1600px] mx-auto space-y-8 pb-12 font-sans will-change-transform"
        >

            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
                        <Settings2 className="h-6 w-6 text-primary" />
                    </div>
                    Configuración
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-2 ml-[3.5rem]">
                    Personaliza tu experiencia y administra los datos de tu consultorio.
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 shrink-0 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 p-3 sticky top-24">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all text-left relative overflow-hidden group mb-1",
                                    activeTab === tab.id
                                        ? "text-white shadow-lg shadow-primary/25"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="settings-tab-pill"
                                        className="absolute inset-0 bg-primary z-0"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <tab.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10", activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                                <div className="flex-1 min-w-0 relative z-10">
                                    <span className="block truncate text-[15px]">{tab.label}</span>
                                    <span className={cn("block text-[11px] font-medium truncate mt-0.5", activeTab === tab.id ? "text-white/80" : "text-slate-400")}>{tab.desc}</span>
                                </div>
                                {activeTab === tab.id && <ChevronRight className="h-4 w-4 opacity-70 relative z-10" />}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-6 pt-6 border-t border-slate-100 px-4 pb-2">
                        <button className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors text-sm font-bold group">
                            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/40 p-8 lg:p-12 relative overflow-hidden min-h-[600px]"
                        >
                            {/* Saving Overlay */}
                            <AnimatePresence>
                                {saving && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-primary"
                                    >
                                        <Loader2 className="h-12 w-12 animate-spin mb-4" />
                                        <span className="font-bold text-sm tracking-widest animate-pulse">GUARDANDO CAMBIOS...</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* --- TAB: PROFILE --- */}
                            {activeTab === 'profile' && (
                                <div className="space-y-10 max-w-3xl">
                                    <div className="border-b border-slate-100 pb-6">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Mi Perfil</h2>
                                        <p className="text-slate-500 text-base">Gestiona tu información pública y datos de contacto profesional.</p>
                                    </div>

                                    {/* Avatar Section */}
                                    <div className="flex items-center gap-8 pb-8 border-b border-slate-100">
                                        <div className="relative group cursor-pointer">
                                            <div className="h-32 w-32 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400 border-8 border-slate-50 shadow-2xl overflow-hidden">
                                                {profile.avatar ? (
                                                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    profile.name.charAt(0) + profile.name.split(' ')[1]?.charAt(0)
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/50 px-3 py-1 rounded-full bg-black/20">Cambiar</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">Foto de Perfil</h3>
                                            <p className="text-sm text-slate-500 mb-4">Esta imagen será visible para tus pacientes en el portal de turnos.</p>
                                            <div className="flex gap-3">
                                                <Button size="sm" variant="outline" className="text-xs font-bold h-9 px-4 rounded-xl border-slate-200 hover:border-primary hover:text-primary bg-white shadow-sm transition-all">
                                                    Subir nueva foto
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-xs font-bold h-9 px-4 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nombre y Título Profesional</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300 text-base"
                                                    placeholder="Ej: Dr. Juan Pérez"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Especialidad</label>
                                            <div className="relative group">
                                                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    value={profile.specialty}
                                                    onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Matrícula Nacional / NPI</label>
                                            <div className="relative group">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    value={profile.license}
                                                    onChange={(e) => setProfile({ ...profile, license: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email Contacto</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    value={profile.email}
                                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Teléfono Móvil</label>
                                            <div className="relative group">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Biografía Profesional (Resumen)</label>
                                            <textarea
                                                rows={4}
                                                value={profile.bio}
                                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700 resize-none leading-relaxed"
                                            />
                                            <p className="text-xs text-slate-400 text-right">0/300 caracteres</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: CLINIC --- */}
                            {activeTab === 'clinic' && (
                                <div className="space-y-10 max-w-3xl">
                                    <div className="border-b border-slate-100 pb-6">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Consultorio</h2>
                                        <p className="text-slate-500 text-base">Datos de la institución, facturación y ubicación geográfica.</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-primary/5 via-primary/5 to-white rounded-3xl p-8 border border-primary/10 flex items-start gap-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                        <div className="h-14 w-14 rounded-2xl bg-white shadow-lg shadow-primary/10 flex items-center justify-center text-primary shrink-0 ring-4 ring-white z-10">
                                            <Building className="h-7 w-7" />
                                        </div>
                                        <div className="z-10">
                                            <h4 className="font-bold text-slate-800 text-lg mb-2">Información Sincronizada</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                                                Los cambios que realices aquí actualizan automáticamente la configuración global de la plataforma (<code>clientConfig</code>), afectando encabezados, pies de página y recetas digitales.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nombre de Fantasía</label>
                                                <input
                                                    value={clinic.name}
                                                    onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-700 text-base"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Razón Social</label>
                                                <input
                                                    value={clinic.legalName}
                                                    onChange={(e) => setClinic({ ...clinic, legalName: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Dirección Principal</label>
                                            <div className="relative group">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    value={clinic.address}
                                                    onChange={(e) => setClinic({ ...clinic, address: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Teléfono / WhatsApp Turnos</label>
                                                <input
                                                    value={clinic.phone}
                                                    onChange={(e) => setClinic({ ...clinic, phone: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Sitio Web</label>
                                                <input
                                                    value={clinic.website}
                                                    onChange={(e) => setClinic({ ...clinic, website: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: NOTIFICATIONS --- */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-10 max-w-3xl">
                                    <div className="border-b border-slate-100 pb-6">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Notificaciones</h2>
                                        <p className="text-slate-500 text-base">Controla que alertas recibes y a través de que canales.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                                            {[
                                                { key: 'email_new_booking', label: 'Nuevos Turnos Agendados', desc: 'Recibir un email inmediatamente cuando un paciente reserve un turno.' },
                                                { key: 'email_cancellations', label: 'Turnos Cancelados', desc: 'Ser notificado si un paciente cancela o reprograma.' },
                                                { key: 'push_reminders', label: 'Recordatorios Push (Navegador)', desc: 'Notificaciones emergentes 15 minutos antes de cada cita.' },
                                            ].map((item, i) => (
                                                <div key={item.key} className={cn("flex items-center justify-between p-6 hover:bg-slate-50 transition-colors rounded-2xl group", i !== 0 && "border-t border-slate-50")}>
                                                    <div className="pr-6">
                                                        <h4 className="font-bold text-slate-700 text-base mb-1 group-hover:text-primary transition-colors">{item.label}</h4>
                                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                                    </div>
                                                    <SimpleSwitch
                                                        checked={notifications[item.key]}
                                                        onCheckedChange={(val) => setNotifications({ ...notifications, [item.key]: val })}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                                            {[
                                                { key: 'sms_confirmations', label: 'Confirmaciones SMS (Pacientes)', desc: 'Enviar automáticamente un SMS de confirmación al paciente.' },
                                                { key: 'weekly_digest', label: 'Resumen Semanal', desc: 'Recibir un reporte de rendimiento cada lunes.' },
                                                { key: 'marketing_emails', label: 'Novedades de Producto', desc: 'Recibir noticias sobre nuevas funcionalidades de Vantra.' },
                                            ].map((item, i) => (
                                                <div key={item.key} className={cn("flex items-center justify-between p-6 hover:bg-slate-50 transition-colors rounded-2xl group", i !== 0 && "border-t border-slate-50")}>
                                                    <div className="pr-6">
                                                        <h4 className="font-bold text-slate-700 text-base mb-1 group-hover:text-primary transition-colors">{item.label}</h4>
                                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                                    </div>
                                                    <SimpleSwitch
                                                        checked={notifications[item.key]}
                                                        onCheckedChange={(val) => setNotifications({ ...notifications, [item.key]: val })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: SECURITY --- */}
                            {activeTab === 'security' && (
                                <div className="space-y-10 max-w-3xl">
                                    <div className="border-b border-slate-100 pb-6">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Seguridad</h2>
                                        <p className="text-slate-500 text-base">Gestiona el acceso y protege tu cuenta médica.</p>
                                    </div>

                                    <div className="bg-amber-50/50 rounded-3xl p-8 border border-amber-100/60 flex items-start gap-6">
                                        <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
                                            <Shield className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-slate-800 text-lg">Autenticación de Dos Factores (2FA)</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                                        {security.twoFactor ? 'Activado' : 'Desactivado'}
                                                    </span>
                                                    <SimpleSwitch
                                                        checked={security.twoFactor}
                                                        onCheckedChange={(val) => setSecurity({ ...security, twoFactor: val })}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Protege tu cuenta contra accesos no autorizados solicitando un código de verificación adicional al iniciar sesión desde un nuevo dispositivo.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Key className="h-4 w-4" /> Cambio de Contraseña
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Contraseña Actual</label>
                                                    <input type="password" placeholder="••••••••••••" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold placeholder:text-slate-300" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nueva Contraseña</label>
                                                    <input type="password" placeholder="••••••••••••" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold placeholder:text-slate-300" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Confirmar Nueva</label>
                                                    <input type="password" placeholder="••••••••••••" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold placeholder:text-slate-300" />
                                                </div>
                                            </div>

                                            <div className="pt-2 flex justify-end">
                                                <Button variant="outline" className="font-bold border-slate-200 rounded-xl px-6 h-11 hover:bg-slate-50">
                                                    Actualizar Contraseña
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: BILLING (Placeholder) --- */}
                            {activeTab === 'billing' && (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center relative">
                                        <CreditCard className="h-10 w-10 text-slate-300" />
                                        <div className="absolute -bottom-2 -right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full border border-white shadow-sm uppercase tracking-wide">Próximamente</div>
                                    </div>
                                    <div className="max-w-md">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Módulo de Facturación</h3>
                                        <p className="text-slate-500">
                                            Estamos trabajando en esta funcionalidad para que puedas gestionar tus planes, facturas y métodos de pago directamente desde aquí.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Footer for primary tabs */}
                            {activeTab !== 'billing' && (
                                <motion.div
                                    className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center gap-2">
                                        {successMsg && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-sm font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl"
                                            >
                                                <CheckCircle2 className="h-4 w-4" /> {successMsg}
                                            </motion.span>
                                        )}
                                    </div>
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 rounded-2xl px-10 h-14 font-bold transition-all active:scale-95 text-base"
                                    >
                                        {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-3" />}
                                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </motion.div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}
