import { calComConfig } from '@/config/calcom';

/**
 * Service to interact with Cal.com API.
 * Currently mocks data for demonstration purposes until a real API Key is provided.
 */
export const calComService = {

    /**
     * Fetch available slots for a given date range.
     * @param {Date} startDate 
     * @param {Date} endDate 
     */
    async getAvailableSlots(startDate, endDate) {
        // REAL API CALL IMPLEMENTATION (Commented out for future use)
        /*
        const params = new URLSearchParams({
            apiKey: calComConfig.apiKey,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            eventTypeId: calComConfig.eventTypeId
        });
        const response = await fetch(`${calComConfig.baseUrl}/slots?${params}`);
        return await response.json();
        */

        // MOCK DATA
        console.log(`[Cal.com Service] Fetching slots from ${startDate.toISOString()} to ${endDate.toISOString()}`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));

        // Generate some random slots
        const slots = {};
        let cursor = new Date(startDate);
        while (cursor <= endDate) {
            const dateStr = cursor.toDateString();

            // Randomly available: Mon-Fri only
            const day = cursor.getDay();
            if (day !== 0 && day !== 6) {
                slots[dateStr] = [
                    "09:00", "09:30", "10:00", "11:30",
                    "14:00", "15:30", "16:00", "16:30"
                ].filter(() => Math.random() > 0.3); // Randomly remove some slots to simulate busyness
            }

            cursor.setDate(cursor.getDate() + 1);
        }

        return slots;
    },

    /**
     * Create a booking.
     * @param {Object} bookingDetails 
     */
    async createBooking(bookingDetails) {
        // REAL API CALL (Commented out)
        /*
        const response = await fetch(`${calComConfig.baseUrl}/bookings?apiKey=${calComConfig.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventTypeId: parseInt(calComConfig.eventTypeId),
                start: bookingDetails.startISO, // "2024-01-10T09:00:00.000Z"
                responses: {
                    name: bookingDetails.name,
                    email: bookingDetails.email,
                    notes: bookingDetails.notes
                },
                metadata: {},
                timeZone: "America/Argentina/Buenos_Aires"
            })
        });
        return await response.json();
        */

        console.log(`[Cal.com Service] Creating booking:`, bookingDetails);
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            success: true,
            id: Math.floor(Math.random() * 100000),
            status: "ACCEPTED",
            uid: "b_" + Math.random().toString(36).substr(2, 9)
        };
    },

    /**
     * Get all bookings (Agenda).
     * @param {Date} fromDate 
     * @param {Date} toDate 
     */
    async getBookings(fromDate, toDate) {
        // REAL API CALL
        /*
        const response = await fetch(`${calComConfig.baseUrl}/bookings?apiKey=${calComConfig.apiKey}&dateFrom=${fromDate.toISOString()}&dateTo=${toDate.toISOString()}`);
        */

        console.log(`[Cal.com Service] Fetching bookings for agenda...`);
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Bookings
        const mockBookings = [
            {
                id: 101,
                title: "Consulta - Carlos Rodriguez",
                description: "Control Hipertensión",
                startTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
                endTime: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
                status: "ACCEPTED",
                attendees: [{ name: "Carlos Rodriguez", email: "carlos.rod@gmail.com" }]
            },
            {
                id: 102,
                title: "Consulta - Maria Lopez",
                description: "Control Embarazo",
                startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
                endTime: new Date(new Date().setHours(11, 45, 0, 0)).toISOString(),
                status: "ACCEPTED",
                attendees: [{ name: "Maria Lopez", email: "mfer.lopez@hotmail.com" }]
            },
            {
                id: 103,
                title: "Urgencia - Juan Martinez",
                description: "Dolor Agudo",
                startTime: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
                endTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
                status: "PENDING",
                attendees: [{ name: "Juan Martinez", email: "juanp.martinez@gmail.com" }]
            }
        ];

        // Filter by date range loosely for mockup
        return mockBookings;
    }
};
