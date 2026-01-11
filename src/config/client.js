import { DollarSign, Calendar, Users, Activity } from 'lucide-react';

/**
 * CONFIGURACIÓN DEL CLIENTE
 * Este archivo centraliza los datos del profesional y la clínica.
 * Se usa para personalizar toda la UI/UX de la plataforma.
 */

// 1. Definir la configuración por defecto (Fallback)
const defaultConfig = {
    // Legacy Structure Support
    identity: {
        name: "Dr. Pascual",
        specialty: "Cardiología Clínica",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
        greeting: "Hola",
        email: "a.pascual@vantra.med",
        phone: "+54 9 11 4444-8888",
    },
    business: {
        currency: "$",
        currencyCode: "USD",
        locale: "es-AR",
        name: "Consultorio Default",
        legalName: "Consultorio S.A.",
        address: "Dirección Principal 123",
        phone: "0800-000-0000"
    },
    mockData: {
        appointments: [
            { id: 1, time: '09:00', name: 'Mariana López', type: 'Primera Consulta', status: 'confirmed' },
            { id: 2, time: '10:15', name: 'Carlos Díaz', type: 'Control Post-op', status: 'confirmed' },
            { id: 3, time: '11:30', name: 'Sofía Martínez', type: 'Consulta Estética', status: 'pending' },
            { id: 4, time: '14:00', name: 'Jorge Pérez', type: 'Urgencia', status: 'confirmed' }
        ],
        kpis: [
            { id: 1, title: 'Ingresos Mensuales', value: 4582150, trend: 'up', trendValue: '+12%', isCurrency: true, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
            { id: 2, title: 'Turnos Activos', value: 42, trend: 'up', trendValue: '+5%', isCurrency: false, icon: Calendar, color: "bg-blue-100 text-blue-600" },
            { id: 3, title: 'Nuevos Pacientes', value: 18, trend: 'down', trendValue: '-3%', isCurrency: false, icon: Users, color: "bg-violet-100 text-violet-600" },
            { id: 4, title: 'Tasa de Retención', value: '85%', trend: 'up', trendValue: '+2%', isCurrency: false, icon: Activity, color: "bg-amber-100 text-amber-600" }
        ],
        widgets: {
            sources: [
                { id: 'whatsapp', label: 'WhatsApp', value: 42, color: '#25D366', fill: '#25D366' },
                { id: 'calcom', label: 'Cal.com', value: 28, color: '#111827', fill: '#111827' },
                { id: 'platform', label: 'Plataforma', value: 25, color: '#8b5cf6', fill: '#8b5cf6' },
                { id: 'other', label: 'Otros', value: 5, color: '#9AA0A6', fill: '#9AA0A6' }
            ],
            retention: [
                { name: "Tasa de Retención", value: 87, fill: "#10b981" },
                { name: "Pacientes Nuevos", value: 15, fill: "#6366f1" },
                { name: "Pacientes Recurrentes", value: 85, fill: "#3b82f6" }
            ],
            demandPeaks: [
                { day: 'Lun', value: 80 },
                { day: 'Mar', value: 65 },
                { day: 'Mié', value: 90 },
                { day: 'Jue', value: 75 },
                { day: 'Vie', value: 60 }
            ]
        },
        activityLogs: [
            { id: 1, user: 'Sistema', action: 'Turno confirmado para Mariana López', time: 'hace 10 min', type: 'success' },
            { id: 2, user: 'Dr. Pascual', action: 'Actualizó historia clínica de Carlos Díaz', time: 'hace 30 min', type: 'system' },
            { id: 3, user: 'Sistema', action: 'Nuevo paciente registrado: Sofía Martínez', time: 'hace 1 hora', type: 'payment' },
            { id: 4, user: 'Sistema', action: 'Recordatorio enviado a Pedro Sanchez', time: 'hace 2 horas', type: 'system' },
            { id: 5, user: 'Admin', action: 'Pago recibido: Cons. Externa', time: 'hace 3 horas', type: 'payment' },
            { id: 6, user: 'Secretaria IA', action: 'Resumen diario generado y enviado', time: 'hace 5 horas', type: 'success' }
        ]
    },

    // Flat properties
    doctorName: "Dr. Pascual",
    specialty: "Cardiología Clínica",
    email: "a.pascual@vantra.med",
    phone: "+54 9 11 4444-8888",
    license: "MN 98765",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",

    name: "Consultorio Central",
    legalName: "Pascual Medical Group S.A.",
    address: "Av. Corrientes 2000, Piso 5",
    clinicPhone: "0810-999-MEDICO",

    locale: "es-AR",
    currency: "ARS",
    timezone: "America/Argentina/Buenos_Aires",

    theme: {
        primaryColor: "emerald",
        chartPrimary: "#0ea5e9", // Added for Dashboard compatibility
        radius: "1rem",
        dashboardLayout: "bento",
    },

    modules: {
        agenda: true,
        patients: true,
        medicalRecords: true,
        prescriptions: true,
        telemedicine: false,
        billing: false,
        marketing: false
    }
};

// 2. Intentar cargar desde localStorage
const loadFromStorage = () => {
    try {
        const stored = localStorage.getItem('vantra_client_config');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge profundo o simple con default para asegurar que no falten nuevas keys
            // Merge logic: always keep default mockData to avoid crashes if LS has old schema
            return {
                ...defaultConfig,
                ...parsed,
                mockData: defaultConfig.mockData, // Always use default mockData (or merge if needed)
                identity: { ...defaultConfig.identity, ...parsed.identity },
                business: { ...defaultConfig.business, ...parsed.business }
            };
        }
    } catch (e) {
        console.error("Error loading config from localStorage", e);
    }
    return defaultConfig;
};

// 3. Exportar la configuración mutable inicializada
export let clientConfig = loadFromStorage();

// 4. Función de actualización con persistencia
export const updateClientConfig = (newConfig) => {
    // 1. Update Flat Properties
    clientConfig = { ...clientConfig, ...newConfig };

    // 2. Sync Legacy Nested Structures (Mantenemos la compatibilidad)
    if (newConfig.doctorName) clientConfig.identity.name = newConfig.doctorName;
    if (newConfig.specialty) clientConfig.identity.specialty = newConfig.specialty;
    if (newConfig.email) clientConfig.identity.email = newConfig.email;
    if (newConfig.avatar) clientConfig.identity.avatar = newConfig.avatar;

    if (newConfig.name) clientConfig.business.name = newConfig.name;
    if (newConfig.address) clientConfig.business.address = newConfig.address;
    if (newConfig.clinicPhone) clientConfig.business.phone = newConfig.clinicPhone;

    // 3. Persist to LocalStorage
    try {
        localStorage.setItem('vantra_client_config', JSON.stringify(clientConfig));
    } catch (e) {
        console.error("Error saving config to localStorage", e);
    }

    console.log("Configuración actualizada y persistida:", clientConfig);

    // 4. Trigger React Re-render
    window.dispatchEvent(new Event('clientConfigUpdated'));
    return clientConfig;
};
