import { calComConfig } from '@/config/calcom';

/**
 * Service to interact with Cal.com API.
 * Includes fallback to mock data if API fails (e.g. invalid key).
 */
// --- IN-MEMORY MOCK STORAGE (Simulates Backend/Database) ---
let mockStorage = [
    {
        id: 'mock-init-1',
        title: "Consulta - Juan Pérez",
        description: "Dolor de garganta y fiebre.",
        startTime: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
        endTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
        status: 'ACCEPTED',
        attendees: [{ name: "Juan Pérez", email: "juan@gmail.com" }]
    },
    {
        id: 'mock-init-2',
        title: "Control - Maria Garcia",
        description: "Revisión mensual de tratamiento.",
        startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
        endTime: new Date(new Date().setHours(11, 45, 0, 0)).toISOString(),
        status: 'PENDING',
        attendees: [{ name: "Maria Garcia", email: "maria.g@hotmail.com" }]
    }
];

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
