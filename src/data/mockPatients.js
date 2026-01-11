// src/data/mockPatients.js

// Funciones Helper para fechas recientes (2025-2026)
const getRecentDate = (monthsBack = 0) => {
    const date = new Date(); // Asumimos Enero 2026 según prompt
    date.setMonth(date.getMonth() - monthsBack);
    // Random day
    date.setDate(Math.floor(Math.random() * 28) + 1);
    return date.toISOString();
};

const getFutureDate = (daysAhead = 7) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead + Math.floor(Math.random() * 14));
    date.setHours(9 + Math.floor(Math.random() * 8), 0, 0); // 9am - 17pm
    return date.toISOString();
};

const firstNames = ['María', 'Juan', 'Carlos', 'Ana', 'Laura', 'Pedro', 'Sofía', 'Miguel', 'Lucía', 'Diego', 'Valentina', 'Javier', 'Camila', 'Luis', 'Elena', 'Fernando', 'Isabella', 'Ricardo', 'Carmen', 'Roberto', 'Paula', 'Andrés', 'Daniela', 'Gabriel', 'Martina', 'Francisco', 'Julia', 'Manuel', 'Mariana', 'Alejandro', 'Agustina', 'José'];
const lastNames = ['González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Díaz', 'Martínez', 'Pérez', 'García', 'Sánchez', 'Romero', 'Sosa', 'Torres', 'Álvarez', 'Ruiz', 'Ramírez', 'Flores', 'Benítez', 'Acosta', 'Medina', 'Herrera', 'Aguirre', 'Pereyra', 'Molina', 'Castro', 'Iglesias', 'Vidal', 'Cabrera', 'Rojas', 'Morales'];

const insurances = ['Particular', 'OSDE', 'OSDE 210', 'OSDE 310', 'Swiss Medical', 'Galeno', 'Omint', 'Medicus'];

// Helper para generar historia mock (Simulamos la lógica de unifiedMockDB aquí para que la tabla tenga datos)
const generateMockHistory = (patientId, count = 3) => {
    const history = [];
    const EVOLUTIONS_POOL = ['Paciente evoluciona favorablemente.', 'Presenta leve mejoría.', 'Sin cambios significativos.', 'Excelente estado general.'];
    const DIAGNOSES_POOL = ['Hipertensión Leve', 'Control Rutina', 'Gripe Estacional', 'Alergia', 'Dolor Lumbar', 'Migraña'];

    for (let i = 0; i < count; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - (i + 1) * 2);
        history.push({
            id: `hist_${patientId}_${i}`,
            date: date.toISOString(),
            doctor: 'Dr. Vantra',
            title: i === 0 ? 'Consulta Reciente' : 'Consulta de Seguimiento', // Added Title
            type: i % 2 === 0 ? 'Consulta' : 'Urgencia', // Added Type
            reason: 'Consulta Programada',
            evolution: EVOLUTIONS_POOL[Math.floor(Math.random() * EVOLUTIONS_POOL.length)],
            diagnosis: DIAGNOSES_POOL[Math.floor(Math.random() * DIAGNOSES_POOL.length)],
            notes: EVOLUTIONS_POOL[Math.floor(Math.random() * EVOLUTIONS_POOL.length)], // Added Notes for compatibility
            files: i === 0 ? [
                {
                    name: 'Analisis_Laboratorio_Completo.pdf',
                    date: '2025-12-10',
                    size: '2.4 MB',
                    type: 'pdf',
                    // PDF de muestra seguro y estable
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    note: 'Hemograma completo. Valores de colesterol levemente elevados. Se sugiere dieta.'
                },
                {
                    name: 'Radiografia_Torax_Frente.jpg',
                    date: '2025-10-15',
                    size: '4.1 MB',
                    type: 'image',
                    // Imagen médica genérica de Unsplash (Blue abstract medical/tech)
                    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1000',
                    note: 'Placa de tórax s/p. Sin hallazgos patológicos agudos.'
                }
            ] : []
        });
    }
    return history;
};

// Generador de Pacientes
const generatePatients = (count) => {
    const patients = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const hasInsurance = Math.random() > 0.2;
        const insurance = hasInsurance ? insurances[Math.floor(Math.random() * insurances.length)] : 'Particular';

        // Estado
        const isNew = Math.random() < 0.1;
        const isActive = Math.random() > 0.15;

        // Fechas
        const lastVisit = isNew ? null : getRecentDate(Math.floor(Math.random() * 6)); // Últimos 6 meses
        const nextAppt = isActive && Math.random() > 0.4 ? getFutureDate(Math.floor(Math.random() * 30)) : null;
        const birthDate = `${1960 + Math.floor(Math.random() * 40)}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`;

        // Calcular edad
        const age = Math.floor((new Date() - new Date(birthDate)) / 31557600000);

        const pId = `p-${200 + i}`;
        const history = generateMockHistory(pId, Math.floor(Math.random() * 4) + 1);

        // Flatten files from history to be easily accessible
        const allFiles = history.flatMap(h => h.files || []);

        patients.push({
            id: pId,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`, // Compatibility
            contact: {
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
                phone: `+54 9 11 ${Math.floor(Math.random() * 8000) + 1000}-${Math.floor(Math.random() * 8000) + 1000}`,
                whatsapp_normalized: '5491155555555'
            },
            dni: `${Math.floor(Math.random() * 30000000) + 20000000}`,
            birthDate: birthDate,
            age: age,
            bloodType: ['A+', 'O+', 'B+', 'AB+'][Math.floor(Math.random() * 4)],
            insurance: insurance,
            status: isActive ? 'active' : 'inactive',
            tags: isNew ? ['Nuevo'] : (hasInsurance ? ['Plan Familiar'] : ['VIP']),
            last_visit: lastVisit,
            next_appointment: nextAppt,
            notes: "Paciente refiere buena evolución general.",
            history: history, // Attach generated history
            medicalHistory: { // Legacy structure support
                currentIllness: "Control anual.",
                pathological: "Niega antecedentes de relevancia.",
                medication: "Ninguna.",
                files: allFiles
            }
        });
    }
    return patients;
};

export const mockPatients = generatePatients(50);
