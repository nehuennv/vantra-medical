import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AgendaWidget } from "@/components/dashboard/AgendaWidget";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { SourcesWidget, RetentionWidget, DemandPeaksWidget } from "@/components/dashboard/MetricsWidgets";
import { clientConfig } from "@/config/client";

export function DashboardPage() {
    const { identity, business, theme, mockData } = clientConfig;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12 w-full max-w-[1600px] mx-auto">

            {/* HEADER COMPACTO */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        {identity.greeting}, <span className="text-primary">{identity.name}</span>
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Resumen operativo del consultorio.
                    </p>
                </div>
                <Button className="h-10 px-6 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-semibold w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Turno
                </Button>
            </div>

            {/* SECCIÓN 1: KPIS MACRO (Mobile First Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockData.kpis.map((kpi) => (
                    <StatCard
                        key={kpi.id}
                        title={kpi.title}
                        value={kpi.isCurrency ? `${business.currency}${kpi.value}` : kpi.value}
                        trend={kpi.trend}
                        trendValue={kpi.trendValue}
                        inverseTrend={kpi.inverseTrend}
                        icon={kpi.icon}
                        color={kpi.color}
                    />
                ))}
            </div>

            {/* SECCIÓN 2: DESGLOSES Y GRÁFICOS (3 Columnas en Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SourcesWidget data={mockData.widgets.sources} />
                <RetentionWidget data={mockData.widgets.retention} />
                <DemandPeaksWidget data={mockData.widgets.demandPeaks} themeColor={theme.chartPrimary} />
            </div>

            {/* SECCIÓN 3: OPERATIVA (2 Columnas: Feed y Agenda) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                {/* Activity Feed */}
                <div className="xl:col-span-1 h-full min-h-[400px]">
                    <ActivityFeed logs={mockData.activityLogs} />
                </div>

                {/* Agenda Widget */}
                <div className="xl:col-span-2 h-full min-h-[400px]">
                    <AgendaWidget appointments={mockData.appointments} />
                </div>
            </div>

        </div>
    );
}
