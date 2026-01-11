// src/data/unifiedMockDB.js
import { mockPatients } from './mockPatients';

// 1. BASE DE DATOS DE PACIENTES (Simulada)
// Inicializamos con los datos de mockPatients para tener una base rica, calculando edad y datos faltantes.
const PATIENTS_DB = mockPatients.reduce((acc, patient) => {
    // Calcular Edad
    const age = patient.birthDate
        ? Math.floor((new Date() - new Date(patient.birthDate)) / 31557600000)
        : Math.floor(Math.random() * 40) + 20;

    // Asignar Grupo Sanguíneo Random si no existe
    const bloodTypes = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-'];
    const bloodType = patient.bloodType || bloodTypes[Math.floor(Math.random() * bloodTypes.length)];

    acc[patient.id] = {
        ...patient,
        history: [], // Inicializamos array de historia
        age,
        bloodType
    };
    return acc;
}, {});

// 2. BASE DE DATOS DE CONSULTAS (Evoluciones)
const CONSULTATIONS_DB = {};

// --- GENERADOR DE DATOS DE PRUEBA (Rich History) ---
const DIAGNOSES_POOL = ['Hipertensión Leve', 'Control Rutina', 'Gripe Estacional', 'Alergia Primaveral', 'Dolor Lumbar', 'Migraña Crónica', 'Chequeo General'];
const EVOLUTIONS_POOL = [
    'Paciente evoluciona favorablemente. Se mantienen indicaciones.',
    'Presenta leve mejoría. Se ajusta dosis de medicación.',
    'Sin cambios significativos. Se solicita interconsulta.',
    'Excelente estado general. Alta médica en consideración.',
    'Refiere molestias nocturnas. Se indica reposo relativo.'
];

// Helper para generar historia mock para un paciente
export const generateMockHistory = (patientId, count = 3) => {
    const history = [];
    for (let i = 0; i < count; i++) {
        const evtId = `hist_${patientId}_${i}_${Date.now()}`;
        const date = new Date();
        date.setMonth(date.getMonth() - (i + 1) * 2);

        const consultation = {
            id: evtId,
            date: date.toISOString(),
            doctor: 'Dr. Vantra',
            reason: 'Consulta Programada',
            vitals: {
                bloodPressure: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 10)}`,
                weight: `${65 + Math.floor(Math.random() * 20)}`,
                height: '170',
                heartRate: `${60 + Math.floor(Math.random() * 20)}`
            },
            evolution: EVOLUTIONS_POOL[Math.floor(Math.random() * EVOLUTIONS_POOL.length)],
            diagnosis: DIAGNOSES_POOL[Math.floor(Math.random() * DIAGNOSES_POOL.length)],
            files: i === 0 ? [
                { name: 'Analisis_Sangre.pdf', date: '12/10/2023', size: '2.4 MB' },
                { name: 'Radiografia_Torax.jpg', date: '12/10/2023', size: '4.1 MB' }
            ] : []
        };

        CONSULTATIONS_DB[evtId] = consultation;
        history.push(consultation);
    }
    return history;
};

// Generar historial para cada paciente existente al inicio
Object.values(PATIENTS_DB).forEach(patient => {
    // Generar entre 1 y 4 consultas pasadas
    patient.history = generateMockHistory(patient.id, Math.floor(Math.random() * 4) + 1);
});

// 3. ESTADO LOCAL DE TURNOS
export const BOOKING_LOCAL_STATE = {};

// --- FUNCIONES INTERNAS ---

const getOrCreatePatient = (booking) => {
    const attendees = booking.attendees || [];
    const mainAttendee = attendees[0] || {};

    const metadataPatientId = booking.metadata?.patientId;
    if (metadataPatientId && PATIENTS_DB[metadataPatientId]) {
        return PATIENTS_DB[metadataPatientId];
    }

    const emailToFind = mainAttendee.email?.toLowerCase();
    if (emailToFind) {
        const foundPatient = Object.values(PATIENTS_DB).find(p =>
            p.contact?.email?.toLowerCase() === emailToFind ||
            p.email?.toLowerCase() === emailToFind
        );
        if (foundPatient) return foundPatient;
    }

    // Crear registro temporal si no existe
    const newTempId = `temp_${Date.now()}`;
    const bloodTypes = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-'];

    const newPatient = {
        id: newTempId,
        name: mainAttendee.name || 'Paciente Nuevo',
        email: mainAttendee.email || '',
        contact: { email: mainAttendee.email || '' },
        isNew: true,
        tags: ['Nuevo'],
        age: Math.floor(Math.random() * 40) + 20,
        bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
        history: generateMockHistory(newTempId, 2) // Generar historial mock para visualizar
    };

    PATIENTS_DB[newTempId] = newPatient;
    return newPatient;
};

// --- API SIMULADA (Endpoints) ---

export const fetchEnrichedBooking = async (booking) => {
    const patient = getOrCreatePatient(booking);
    const localState = BOOKING_LOCAL_STATE[booking.id] || {};

    return {
        ...booking,
        patient,
        localStatus: localState.status || booking.status,
        consultationExists: !!CONSULTATIONS_DB[booking.id]
    };
};

export const fetchPatientFullData = async (bookingData) => {
    await new Promise(r => setTimeout(r, 600));

    const patient = getOrCreatePatient(bookingData);

    const fullHistory = (patient.history || []).map(evt => {
        if (typeof evt === 'string') return CONSULTATIONS_DB[evt];
        return evt;
    }).filter(Boolean);

    fullHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Recuperar consulta actual si existe, o crearla vacia para el form
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
        files: fullHistory.flatMap(h => h.files || []),
        currentConsultation
    };
};

export const saveConsultation = async (bookingId, data) => {
    await new Promise(r => setTimeout(r, 800));

    const updatedConsultation = {
        ...CONSULTATIONS_DB[bookingId],
        ...data,
        id: bookingId,
        date: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
    };

    CONSULTATIONS_DB[bookingId] = updatedConsultation;
    updateBookingLocalStatus(bookingId, 'IN_PROGRESS');

    return true;
};

export const updateBookingLocalStatus = (bookingId, newStatus) => {
    BOOKING_LOCAL_STATE[bookingId] = {
        ...BOOKING_LOCAL_STATE[bookingId],
        status: newStatus,
        updatedAt: new Date().toISOString()
    };
    return true;
};