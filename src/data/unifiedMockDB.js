// src/data/unifiedMockDB.js
import { mockPatients } from './mockPatients';

// 1. BASE DE DATOS DE PACIENTES (Simulada)
// Inicializamos con los datos de mockPatients para tener una base rica
const PATIENTS_DB = mockPatients.reduce((acc, patient) => {
    acc[patient.id] = patient;
    return acc;
}, {});

// 2. BASE DE DATOS DE CONSULTAS (Evoluciones)
// Clave: ID del Booking de Cal.com (o un ID generado si no existe)
const CONSULTATIONS_DB = {
    // Ejemplo de una consulta pasada
    'evt_001': {
        id: 'evt_001',
        date: '2023-12-01T10:00:00',
        doctor: 'Dr. Vantra',
        reason: 'Dolor lumbar',
        vitals: {
            bloodPressure: '120/80',
            weight: '75',
            height: '170',
            heartRate: '70'
        },
        evolution: 'Paciente refiere dolor al agacharse. Se indica reposo y diclofenac.',
        diagnosis: 'Lumbalgia mecánica',
        files: []
    }
};

// 3. ESTADO LOCAL DE TURNOS
// Para guardar estados como "En Sala de Espera" que no están en Cal.com nativamente salvo que usemos metadata
export const BOOKING_LOCAL_STATE = {};

// --- FUNCIONES INTERNAS ---

/**
 * Busca o crea un paciente basado en la información del booking.
 * Estrategia: ID (metadata) -> Email -> Nuevo Temporal
 */
const getOrCreatePatient = (booking) => {
    const attendees = booking.attendees || [];
    const mainAttendee = attendees[0] || {};

    // 1. Intentar buscar por ID si viene en la metadata del booking (Simulado)
    const metadataPatientId = booking.metadata?.patientId;
    if (metadataPatientId && PATIENTS_DB[metadataPatientId]) {
        return PATIENTS_DB[metadataPatientId];
    }

    // 2. Buscar por Email
    // Normalizamos emails para evitar duplicados por mayúsculas/minúsculas
    const emailToFind = mainAttendee.email?.toLowerCase();
    if (emailToFind) {
        const foundPatient = Object.values(PATIENTS_DB).find(p =>
            p.contact?.email?.toLowerCase() === emailToFind ||
            p.email?.toLowerCase() === emailToFind // Soporte para estructura vieja y nueva
        );
        if (foundPatient) return foundPatient;
    }

    // 3. Crear registro temporal (Paciente Nuevo)
    // Este paciente no se guarda persistente hasta que el médico lo "Confirme" o edite, 
    // pero para la vista sirve.
    const newTempId = `temp_${Date.now()}`;
    const newPatient = {
        id: newTempId,
        name: mainAttendee.name || 'Paciente Nuevo',
        email: mainAttendee.email || '',
        contact: { email: mainAttendee.email || '' },
        isNew: true, // Flag importante para la UI
        tags: ['Nuevo'],
        history: []
    };

    // Opcional: Guardarlo en memoria para esta sesión
    PATIENTS_DB[newTempId] = newPatient;

    return newPatient;
};

// --- API SIMULADA (Endpoints) ---

// Obtener datos enriquecidos para un turno específico
export const fetchEnrichedBooking = async (booking) => {
    // Simulamos latencia mínima
    // await new Promise(r => setTimeout(r, 200));

    const patient = getOrCreatePatient(booking);

    // Buscar estado local del turno (ej: si el médico lo movió a "En Sala de Espera")
    const localState = BOOKING_LOCAL_STATE[booking.id] || {};

    return {
        ...booking,
        patient, // Datos completos del paciente asociado
        localStatus: localState.status || booking.status, // Prioridad al estado local
        consultationExists: !!CONSULTATIONS_DB[booking.id]
    };
};

// Obtener datos completos para el Modal de Atención (Historia Clínica + Consulta Actual)
export const fetchPatientFullData = async (bookingData) => {
    // Simulamos delay de red
    await new Promise(r => setTimeout(r, 600));

    const patient = getOrCreatePatient(bookingData);

    // Enriquecemos el historial con los datos reales de las consultas
    // Asumimos que patient.history tiene refs o son objetos parciales.
    // Si son referencias, las buscamos. Si ya son objetos, los usamos.
    const fullHistory = (patient.history || []).map(evt => {
        if (typeof evt === 'string') return CONSULTATIONS_DB[evt];
        return evt; // Ya es objeto
    }).filter(Boolean);

    // Verificamos si YA guardamos datos para ESTE turno específico (booking.id)
    const currentConsultation = CONSULTATIONS_DB[bookingData.id] || {
        id: bookingData.id,
        date: new Date().toISOString(),
        vitals: { bloodPressure: '', weight: '', height: '', heartRate: '' },
        evolution: '',
        diagnosis: '',
        files: []
    };

    return {
        patient,
        history: fullHistory,
        currentConsultation
    };
};

// Guardar la evolución (El "Save" del médico)
export const saveConsultation = async (bookingId, data) => {
    await new Promise(r => setTimeout(r, 800)); // Delay para que se sienta real

    // Guardamos en la "DB" en memoria
    CONSULTATIONS_DB[bookingId] = {
        ...CONSULTATIONS_DB[bookingId], // Mantenemos datos viejos si había
        ...data, // Sobreescribimos con lo nuevo
        lastUpdate: new Date().toISOString()
    };

    // Si guardamos consulta, asumimos que el turno se completó o está en progreso
    updateBookingLocalStatus(bookingId, 'IN_PROGRESS');

    console.log("✅ [BACKEND MOCK] Datos guardados para turno:", bookingId, data);
    return true;
};

// Actualizar estado del turno (Drag & Drop o acciones rápidas)
export const updateBookingLocalStatus = (bookingId, newStatus) => {
    BOOKING_LOCAL_STATE[bookingId] = {
        ...BOOKING_LOCAL_STATE[bookingId],
        status: newStatus,
        updatedAt: new Date().toISOString()
    };
    return true;
};