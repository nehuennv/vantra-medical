// Simulates a backend service combining Cal.com appointment data with local Patient DB data
export const mockAppointmentData = (booking) => {
    // Deterministic mock data based on input generic booking

    return {
        id: booking.id,
        status: booking.status === 'ACCEPTED' ? 'CONFIRMADO' : 'PENDIENTE',
        date: new Date(booking.startTime).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }),
        time: new Date(booking.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        reason: booking.title || "Consulta General",
        notes: booking.description || "El paciente refiere dolor de cabeza persistente.",

        // Mock Patient Profile
        patient: {
            id: booking.uid || "#PAC-8392",
            name: booking.attendees?.[0]?.name || "Paciente Desconocido",
            age: 32,
            gender: "Masculino",
            email: booking.attendees?.[0]?.email || "email@ejemplo.com",
            phone: "+54 9 11 1234-5678"
        },

        // Mock Vitals for this specific appointment (if in progress) or last known
        vitals: {
            bp: "120/80",
            hr: "72",
            weight: "75.5",
            height: "178"
        },

        // Mock Clinical History Timeline
        history: [
            {
                date: "2023-10-15T10:00:00",
                type: "Consulta",
                diagnosis: "Control de Rutina",
                notes: "Paciente en buen estado general. Se solicitan análisis de sangre."
            },
            {
                date: "2023-08-22T14:30:00",
                type: "Urgencia",
                diagnosis: "Gastroenteritis",
                notes: "Se prescribe dieta blanda y reposo por 48hs. Síntomas de deshidratación leve."
            },
            {
                date: "2023-05-10T09:15:00",
                type: "Estudio",
                diagnosis: "Radiofrafía de Tórax",
                notes: "Sin particularidades. Pulmones ventilados correctamente."
            }
        ],

        // Mock Attached Files
        files: [
            { name: "Analisis_Sangre_Oct23.pdf", size: "2.4 MB", date: "15 Oct 2023" },
            { name: "Radiografia_Torax.jpg", size: "5.1 MB", date: "10 May 2023" }
        ]
    };
};
