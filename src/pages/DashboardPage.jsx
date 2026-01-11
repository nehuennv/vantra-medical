import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AgendaWidget } from "@/components/dashboard/AgendaWidget";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { SourcesWidget, RetentionWidget, DemandPeaksWidget } from "@/components/dashboard/MetricsWidgets";
import { clientConfig } from "@/config/client";
import { motion } from "framer-motion";
import { parseKpiValue } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
    const { identity, business, theme, mockData } = clientConfig;
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    // Fetch real appointments for dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59);

            try {
                // Fetch today's real bookings
                const realBookings = await calComService.getBookings(now, endOfDay);

                // Adapter for AgendaWidget format: { id, time, name, type, status }
                const formatted = realBookings.map(b => ({
                    id: b.id,
                    time: new Date(b.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                    name: b.attendees[0]?.name || 'Desconocido',
                    type: b.title,
                    status: b.status === 'ACCEPTED' ? 'confirmed' : 'pending'
                }));
                setAppointments(formatted);
            } catch (e) {
                console.error("Dashboard fetch error", e);
                // Fallback to mock on error
                setAppointments(mockData.appointments);
            }
        };
        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 200
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-12 w-full max-w-[1600px] mx-auto will-change-transform"
        >

            {/* HEADER COMPACTO */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        {identity.greeting}, <span className="text-primary">{identity.name}</span>
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Resumen operativo del consultorio.
                    </p>
                </div>
                {/* ACCION PRINCIPAL */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate('/nuevo-turno')}
                        className="h-10 px-6 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-bold w-full sm:w-auto transform hover:scale-105 transition-transform duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Turno
                    </Button>
                </div>
            </motion.div>

            {/* SECCIÓN 1: KPIS MACRO (Mobile First Grid) */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {mockData.kpis.map((kpi, index) => {
                    const { value: targetValue, suffix } = parseKpiValue(kpi.value);
                    const prefix = kpi.isCurrency ? business.currency : "";

                    return (
                        <motion.div
                            key={kpi.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 200,
                                delay: index * 0.1 // Manual stagger for cards
                            }}
                            whileHover={{ y: -5 }} // Subtle float effect on hover
                        >
                            <StatCard
                                title={kpi.title}
                                value={kpi.value} // Fallback / Static
                                targetValue={targetValue}
                                prefix={prefix}
                                suffix={suffix}
                                trend={kpi.trend}
                                trendValue={kpi.trendValue}
                                inverseTrend={kpi.inverseTrend}
                                icon={kpi.icon}
                                color={kpi.color}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* SECCIÓN 2: DESGLOSES Y GRÁFICOS (3 Columnas en Desktop) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SourcesWidget data={mockData.widgets.sources} />
                <RetentionWidget data={mockData.widgets.retention} />
                <DemandPeaksWidget data={mockData.widgets.demandPeaks} themeColor={theme.chartPrimary} />
            </motion.div>

            {/* SECCIÓN 3: OPERATIVA (2 Columnas: Feed y Agenda) */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                {/* Activity Feed */}
                <div className="xl:col-span-1 h-full min-h-[400px]">
                    <ActivityFeed logs={mockData.activityLogs} />
                </div>

                {/* Agenda Widget - NOW REAL DATA */}
                <div className="xl:col-span-2 h-full min-h-[400px]">
                    <AgendaWidget appointments={appointments} />
                </div>
            </motion.div>

        </motion.div>
    );
}
