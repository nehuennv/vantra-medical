import { calComConfig } from '@/config/calcom';

export const calComService = {

    /**
     * Fetch available slots from Cal.com API
     * Returns object with format: { "Thu Jan 11 2024": ["09:00", ...], ... }
     */
    async getAvailableSlots(startDate, endDate) {
        try {
            const params = new URLSearchParams({
                apiKey: calComConfig.apiKey,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                eventTypeId: calComConfig.eventTypeId
            });

            const response = await fetch(`${calComConfig.baseUrl}/slots?${params}`);

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Cal.com API Error: ${response.status} - ${errorBody}`);
            }

            const data = await response.json();
            const rawSlots = data.slots || {};
            const transformedSlots = {};

            // Transform API format { "2024-01-01": [ { time: "ISO..." } ] }
            // To Frontend format { "Mon Jan 01 2024": ["09:00", "09:30"] }
            Object.keys(rawSlots).forEach(dateKey => {
                const daySlots = rawSlots[dateKey];

                // Parse date key YYYY-MM-DD (treat as local to avoid TZ shifts if possible, or ISO)
                // Appending T00:00:00 to ensure we parse the correct calendar day
                const dateObj = new Date(`${dateKey}T00:00:00`);
                const frontendDateKey = dateObj.toDateString(); // "Sun Jan 01 2024"

                if (Array.isArray(daySlots) && daySlots.length > 0) {
                    transformedSlots[frontendDateKey] = daySlots.map(slot => {
                        const slotDate = new Date(slot.time);
                        return slotDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                    });
                }
            });

            return transformedSlots;

        } catch (error) {
            console.error("[Cal.com Service] Error fetching slots:", error);
            console.warn("Check if 'eventTypeId' is correct in src/config/calcom.js");
            return {}; // Return empty to prevent crash
        }
    },

    /**
     * Create a Booking via Cal.com API
     */
    async createBooking(bookingDetails) {
        try {
            const payload = {
                eventTypeId: parseInt(calComConfig.eventTypeId),
                start: bookingDetails.startISO,
                responses: {
                    name: bookingDetails.name,
                    email: bookingDetails.email,
                    notes: bookingDetails.notes
                },
                metadata: {},
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Argentina/Buenos_Aires",
                language: "es"
            };

            const response = await fetch(`${calComConfig.baseUrl}/bookings?apiKey=${calComConfig.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Booking Failed: ${response.status} - ${errorBody}`);
            }

            return await response.json();

        } catch (error) {
            console.error("[Cal.com Service] Error creating booking:", error);
            throw error; // Re-throw to handle UI state
        }
    },

    /**
     * Fetch Bookings (Agenda) from Cal.com API
     */
    async getBookings(fromDate, toDate) {
        try {
            const params = new URLSearchParams({
                apiKey: calComConfig.apiKey,
                dateFrom: fromDate.toISOString(),
                dateTo: toDate.toISOString(),
                // Include cancelled? usually no for agenda view
                status: 'accepted,pending'
            });

            const response = await fetch(`${calComConfig.baseUrl}/bookings?${params}`);

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Cal.com API Error: ${response.status} - ${errorBody}`);
            }

            const data = await response.json();
            const bookingsList = data.bookings || [];

            // Transform to our internal format
            return bookingsList.map(b => ({
                id: b.id,
                title: b.title || `Cita con ${b.responses?.name || 'Paciente'}`,
                description: b.description || b.responses?.notes || "Sin notas",
                startTime: b.startTime, // Keeping ISO string
                endTime: b.endTime,
                status: b.status,
                attendees: b.attendees || [
                    {
                        name: b.responses?.name || 'Desconocido',
                        email: b.responses?.email || ''
                    }
                ]
            }));

        } catch (error) {
            console.error("[Cal.com Service] Error fetching bookings:", error);
            return [];
        }
    }
};
