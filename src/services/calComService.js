import { calComConfig } from '@/config/calcom';
import { mockPatients } from '@/data/mockPatients';

/**
 * Service to interact with Cal.com API.
 * Includes fallback to mock data if API fails (e.g. invalid key).
 */

// --- GENERADOR DE DATOS RICOS DE AGENDA ---
const generateRichMockData = () => {
    const bookings = [];
    const today = new Date();

    // Helper para crear fecha
    const createDate = (daysOffset, hour, minute) => {
        const d = new Date(today);
        d.setDate(d.getDate() + daysOffset);
        d.setHours(hour, minute, 0, 0);
        return d;
    };

    // Tipos de cunsulta
    const types = ['Primera Consulta', 'Control Rutina', 'Urgencia', 'Post-operatorio', 'Consulta Estética', 'Revisión Estudios'];

    // Estados posibles (ponderados)
    const statuses = ['ACCEPTED', 'ACCEPTED', 'ACCEPTED', 'PENDING', 'PENDING', 'IN_PROGRESS', 'CANCELLED'];

    // 1. GENERAR TURNOS PARA HOY (Bien completito)
    const todaySlots = [
        { h: 8, m: 30 }, { h: 9, m: 0 }, { h: 9, m: 30 }, { h: 10, m: 0 },
        { h: 10, m: 30 }, { h: 11, m: 15 }, { h: 12, m: 0 }, { h: 13, m: 30 },
        { h: 14, m: 0 }, { h: 15, m: 45 }, { h: 16, m: 15 }, { h: 17, m: 0 },
        { h: 17, m: 30 }, { h: 18, m: 15 }
    ];

    todaySlots.forEach((slot, i) => {
        const patient = mockPatients[i % mockPatients.length];
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Duration random 30-60 mins
        const duration = Math.random() > 0.7 ? 60 : 30;
        const start = createDate(0, slot.h, slot.m);
        const end = new Date(start.getTime() + duration * 60000);

        bookings.push({
            id: `mock-today-${i}`,
            title: type,
            description: `${type} - ${patient.medicalHistory?.currentIllness || 'Sin observaciones'}`,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            status: status,
            attendees: [{
                name: patient.name,
                email: patient.contact.email,
                timeZone: "America/Argentina/Buenos_Aires"
            }],
            metadata: { patientId: patient.id }
        });
    });

    // 2. GENERAR TURNOS PARA MAÑANA Y AYER (Para navegación)
    [-1, 1, 2].forEach(offset => {
        const slots = [9, 10, 11, 14, 15, 16]; // Menos turnos
        slots.forEach((h, i) => {
            const patient = mockPatients[(i + 10) % mockPatients.length]; // Offset index to vary patients
            const start = createDate(offset, h, 0);
            const end = new Date(start.getTime() + 30 * 60000);

            bookings.push({
                id: `mock-other-${offset}-${h}`,
                title: 'Control',
                description: 'Seguimiento',
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                status: 'ACCEPTED',
                attendees: [{ name: patient.name, email: patient.contact.email }],
                metadata: { patientId: patient.id }
            });
        });
    });

    return bookings;
};

// --- IN-MEMORY MOCK STORAGE (Simulates Backend/Database) ---
let mockStorage = generateRichMockData();

export const calComService = {

    async getAvailableSlots(startDate, endDate) {
        // ... (existing getAvailableSlots logic, kept simple/mocked if needed)
        try {
            // For now, keep the robust mock fallback for slots
            return this._getMockSlots(startDate, endDate);
        } catch (error) {
            return this._getMockSlots(startDate, endDate);
        }
    },

    async createBooking(bookingDetails) {
        console.log("[Cal.com Service] Creating booking:", bookingDetails);
        await new Promise(r => setTimeout(r, 800)); // Simulate network latency

        // 1. Create the new booking object
        const newBooking = {
            id: `local-${Date.now()}`,
            title: `Cita con ${bookingDetails.name}`,
            description: bookingDetails.notes || "",
            startTime: bookingDetails.startISO,
            endTime: new Date(new Date(bookingDetails.startISO).getTime() + 30 * 60000).toISOString(), // Default 30 min
            status: 'ACCEPTED', // Auto-accept locally
            attendees: [{
                name: bookingDetails.name,
                email: bookingDetails.email
            }]
        };

        // 2. Persist to Mock Storage
        mockStorage.push(newBooking);
        console.log("[Cal.com Service] Booking saved to mock storage. Total:", mockStorage.length);

        return { status: 'ACCEPTED', id: newBooking.id };
    },

    async getBookings(fromDate, toDate) {
        await new Promise(r => setTimeout(r, 500)); // Simulate fast network
        console.log(`[Cal.com Service] Fetching bookings from ${fromDate.toISOString()} to ${toDate.toISOString()}`);

        // Filter mock storage by date range
        const filtered = mockStorage.filter(b => {
            const start = new Date(b.startTime);
            return start >= fromDate && start <= toDate;
        });

        // Add some random "filler" data if storage is empty for that day (to avoid empty states during demo)
        if (filtered.length === 0 && Math.random() > 0.5) {
            return this._getMockBookings(fromDate, toDate);
        }

        return filtered;
    },

    // --- Helpers & Mock Generators ---

    _transformSlots(rawSlots) {
        return {}; // Not heavily used in this specific flow currently
    },

    _mapBooking(b) {
        return b; // Storage already matches format
    },

    // MOCK GENERATORS FOR FALLBACK
    async _getMockSlots(start, end) {
        await new Promise(r => setTimeout(r, 300));
        const slots = {};
        const cursor = new Date(start);
        const loopEnd = new Date(end);

        while (cursor <= loopEnd) {
            const day = cursor.getDay();
            if (day !== 0 && day !== 6) {
                const dateKey = cursor.toISOString().split('T')[0];
                slots[dateKey] = ["09:00", "09:30", "10:00", "11:00", "15:00", "16:30"];
            }
            cursor.setDate(cursor.getDate() + 1);
        }
        return slots;
    },

    async _getMockBookings(start, end) {
        // Helper to generate dynamic filler data if needed
        const mocks = [];
        const cursor = new Date(start);
        const loopEnd = new Date(end);

        while (cursor <= loopEnd) {
            if (cursor.getDate() % 3 === 0) { // Some random days
                const year = cursor.getFullYear();
                const month = cursor.getMonth();
                const day = cursor.getDate();

                mocks.push({
                    id: `gen-${year}-${month}-${day}`,
                    title: "Consulta - Paciente Nuevo",
                    description: "Primera visita.",
                    startTime: new Date(year, month, day, 10, 0).toISOString(),
                    endTime: new Date(year, month, day, 10, 30).toISOString(),
                    status: 'PENDING',
                    attendees: [{ name: "Paciente Nuevo", email: "nuevo@example.com" }]
                });
            }
            cursor.setDate(cursor.getDate() + 1);
        }
        return mocks;
    }
};
