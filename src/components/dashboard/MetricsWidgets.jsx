import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";
import { MessageCircle, Users, BarChart2, Activity, User, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { SpotlightCard } from "@/components/ui/SpotlightCard";

// Wrapper Card Component
const WidgetCard = ({ title, icon: Icon, children, className, iconColorClass = "text-slate-500", hoverBgClass = "group-hover:bg-slate-100", hoverTextClass = "group-hover:text-slate-700" }) => (
    <SpotlightCard
        className={cn("p-6 flex flex-col", className)}
    >
        <div className="flex items-center gap-2 mb-4">
            <div
                className={cn(
                    "p-2 rounded-xl bg-slate-50 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-[15deg]",
                    iconColorClass,
                    hoverBgClass,
                    hoverTextClass
                )}
            >
                <Icon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
        </div>
        <div className="flex-1 w-full min-h-[150px] flex flex-col justify-center">
            {children}
        </div>
    </SpotlightCard>
);

export function SourcesWidget({ data }) {
    return (
        <WidgetCard
            title="Fuentes de Reserva"
            icon={MessageCircle}
            iconColorClass="text-indigo-500"
            hoverBgClass="group-hover:bg-indigo-50"
            hoverTextClass="group-hover:text-indigo-600"
        >
            <div className="flex items-center justify-between h-full gap-4">
                {/* Donut Chart Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    className="h-32 w-32 relative shrink-0"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={45}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <span className="text-xs font-bold text-slate-400">Canal</span>
                    </motion.div>
                </motion.div>

                {/* Legend Animation */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    {data.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            whileHover={{ x: 4, scale: 1.02 }} // Micro interaction on legend items
                            className="flex items-center justify-between text-xs cursor-default p-1 rounded-lg hover:bg-white/50 transition-colors"
                        >
                            <div className="flex items-center gap-1.5 truncate">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                                <span className="text-slate-600 truncate">{item.label}</span>
                            </div>
                            <span className="font-bold text-slate-800">{item.value}%</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </WidgetCard>
    );
}

export function RetentionWidget({ data }) {
    return (
        <WidgetCard
            title="Retención de Pacientes"
            icon={Users}
            iconColorClass="text-emerald-500"
            hoverBgClass="group-hover:bg-emerald-50"
            hoverTextClass="group-hover:text-emerald-600"
        >
            <div className="flex flex-col gap-4 h-full justify-center">
                {data.map((item, i) => (
                    <motion.div
                        key={i}
                        className="space-y-1.5 group cursor-default"
                        whileHover="itemHover"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="flex justify-between text-xs font-medium"
                        >
                            <span className="text-slate-600 group-hover:text-primary transition-colors">{item.name}</span>
                            <span className="text-slate-800">{item.value}%</span>
                        </motion.div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: item.fill }}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.3 + (i * 0.1) }}
                                variants={{
                                    itemHover: { filter: "brightness(1.1)", scaleX: 1.02, originX: 0 }
                                }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </WidgetCard>
    );
}

export function DemandPeaksWidget({ data, themeColor }) {
    return (
        <WidgetCard
            title="Picos de Demanda"
            icon={BarChart2}
            iconColorClass="text-sky-500"
            hoverBgClass="group-hover:bg-sky-50"
            hoverTextClass="group-hover:text-sky-600"
        >
            <motion.div
                initial={{ opacity: 0, scaleY: 0.9 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-32 w-full mt-2 origin-bottom"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <Bar
                            dataKey="value"
                            fill={themeColor || "#0ea5e9"}
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                            className="chart-bar-smooth"
                            isAnimationActive={true} // Recharts built-in animation
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                background: 'white',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            dy={5}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </WidgetCard>
    );
}

export function RecentPatientsWidget({ appointments }) {
    // This widget uses standard Appointment data but filters for "Seen" or creates a list of recent interactions.
    // For now, mirroring "Recently Accessed Files" metaphor but for Patients.
    const recentPatients = [
        { id: 101, name: "Mariana López", action: "Consulta Finalizada", time: "15 min", color: "bg-emerald-100 text-emerald-600" },
        { id: 102, name: "Carlos Díaz", action: "Historia Actualizada", time: "32 min", color: "bg-blue-100 text-blue-600" },
        { id: 103, name: "Roberto Gómez", action: "Estudio Cargado", time: "1h", color: "bg-indigo-100 text-indigo-600" },
        { id: 104, name: "Laura Chen", action: "Receta Enviada", time: "2h", color: "bg-purple-100 text-purple-600" },
    ];

    return (
        <WidgetCard
            title="Pacientes Recientes"
            icon={User}
            iconColorClass="text-primary"
            hoverBgClass="group-hover:bg-primary/10"
            hoverTextClass="group-hover:text-primary"
        >
            <div className="flex flex-col gap-3 mt-2 overflow-y-auto pr-1 max-h-[250px] custom-scrollbar">
                {recentPatients.map((p, index) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group/item flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0", p.color)}>
                            {p.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{p.name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{p.action}</p>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {p.time}
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="mt-auto w-full py-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                Ver database completa <ArrowRight className="h-3 w-3" />
            </button>
        </WidgetCard>
    );
}
