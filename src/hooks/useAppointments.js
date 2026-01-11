import { useState, useEffect, useCallback } from 'react';
import { calComService } from '@/services/calComService';
import { fetchEnrichedBooking, updateBookingLocalStatus } from '@/data/unifiedMockDB';

export const useAppointments = (currentDate) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const start = new Date(currentDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(currentDate);
            end.setHours(23, 59, 59, 999);

            const rawBookings = await calComService.getBookings(start, end);

            // Procesamos cada booking: Sanitización + Enriquecimiento DB Local
            const enrichedPromises = rawBookings.map(async (raw) => {
                let status = 'PENDING';
                const apiStatus = raw.status?.toUpperCase();
                if (apiStatus === 'ACCEPTED') status = 'ACCEPTED';
                else if (apiStatus === 'PENDING') status = 'PENDING';
                else if (apiStatus === 'IN_PROGRESS') status = 'IN_PROGRESS';
                else if (['CANCELLED', 'REJECTED'].includes(apiStatus)) status = 'CANCELLED';

                // Objeto base sanitizado (Lo mínimo indispensable para que la UI no rompa)
                const baseBooking = {
                    ...raw,
                    status, // Este status base viene de Cal.com
                    attendees: raw.attendees?.length > 0 ? raw.attendees : [{ name: 'Paciente Desconocido' }],
                    startTime: new Date(raw.startTime).toISOString(),
                    title: raw.title || 'Consulta',
                };

                // ENRIQUECIMIENTO:
                // 1. Buscamos/Creamos el Paciente en nuestra DB unificada.
                // 2. Buscamos si tiene un estado local (ej: Drag & Drop previo).
                // 3. Chequeamos si ya tiene consulta médica iniciada.
                const enriched = await fetchEnrichedBooking(baseBooking);

                // Prioridad al estado local sobre el de la API
                // Esto permite que el Drag & Drop persista en la sesión aunque Cal.com tarde en actualizar (o no actualice)
                if (enriched.localStatus) {
                    enriched.status = enriched.localStatus;
                }

                return enriched;
            });

            const results = await Promise.all(enrichedPromises);
            setBookings(results);

        } catch (error) {
            console.error("Error loading appointments:", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, [currentDate]);

    // Recargar cuando cambia la fecha
    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

    // Función para manejar cambios de estado (Drag & Drop o Click)
    const updateStatus = useCallback((id, newStatus) => {
        // 1. Optimistic UI Update: Reflejamos el cambio YA, sin esperar a la DB.
        setBookings(prev => prev.map(b =>
            b.id === id ? { ...b, status: newStatus } : b
        ));

        // 2. Actualizar nuestra DB Local (Source of Truth de la Sesión)
        updateBookingLocalStatus(id, newStatus);

        // 3. Intentar actualizar en el servicio externo (Cal.com / API Real)
        if (calComService.updateBookingStatus) {
            calComService.updateBookingStatus(id, newStatus).catch(err => {
                console.warn("No se pudo actualizar en Cal.com", err);
                // Si falla, podríamos revertir, pero por ahora priorizamos UI local.
            });
        }
    }, []);

    return {
        bookings,
        loading,
        refresh: loadAppointments,
        updateStatus
    };
};
