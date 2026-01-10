// src/data/unifiedMockDB.js

// 1. BASE DE DATOS DE PACIENTES (Simulada)
// En el futuro, esto viene de tu DB real.
const PATIENTS_DB = {
    'paciente_1': {
        id: 'paciente_1',
        name: 'Lionel Messi',
        email: 'lio@messi.com',
        age: 36,
        bloodType: 'O+',
        history: ['evt_001', 'evt_002'] // Referencias a consultas pasadas
    },
    'paciente_2': {
        id: 'paciente_2',
        name: 'Elon Musk',
        email: 'elon@x.com',
        age: 52,
        bloodType: 'A-',
        history: []
    }
};

// 2. BASE DE DATOS DE CONSULTAS (Evoluciones)
// Aquí se guarda lo que escribe el médico.
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

// --- SIMULACIÓN DE API (Endpoints) ---

// Obtener datos completos del paciente + historial para el Modal
export const fetchPatientFullData = async (bookingData) => {
    // Simulamos delay de red
    await new Promise(r => setTimeout(r, 600));

    // Intentamos matchear por email (lo más común entre Cal.com y tu DB)
    // En la vida real, Cal.com te manda el email del attendee
    const attendeeEmail = bookingData.attendees?.[0]?.email;

    // Buscamos el paciente en nuestra "DB"
    let patient = Object.values(PATIENTS_DB).find(p => p.email === attendeeEmail);

    // Si no existe (es paciente nuevo que vino por Cal.com), devolvemos una estructura vacía pero lista
    if (!patient) {
        patient = {
            id: 'new_patient',
            name: bookingData.attendees?.[0]?.name || 'Paciente Nuevo',
            email: attendeeEmail,
            isNew: true, // Flag para saber que es la primera vez
            history: []
        };
    }

    // Enriquecemos el historial con los datos reales de las consultas
    const fullHistory = patient.history.map(evtId => CONSULTATIONS_DB[evtId]).filter(Boolean);

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

    console.log("✅ [BACKEND MOCK] Datos guardados para turno:", bookingId, data);
    return true;
};