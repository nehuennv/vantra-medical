import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";
import { MessageCircle, Users, BarChart2 } from "lucide-react";

// Wrapper Card Component for uniformity
const WidgetCard = ({ title, icon: Icon, children, className }) => (
    <div className={cn("bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300", className)}>
        <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
                <Icon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
        </div>
        <div className="flex-1 w-full min-h-[150px] flex flex-col justify-center">
            {children}
        </div>
    </div>
);

export function SourcesWidget({ data }) {
    return (
        <WidgetCard title="Fuentes de Reserva" icon={MessageCircle}>
            <div className="flex items-center justify-between h-full gap-4">
                {/* Donut Chart */}
                <div className="h-32 w-32 relative shrink-0">
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
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold text-slate-400">Canal</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 truncate">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                                <span className="text-slate-600 truncate">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-800">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </WidgetCard>
    );
}

export function RetentionWidget({ data }) {
    // Data expected: array of objects or simple object transformed
    // Using the same format for simplicity: data is array
    return (
        <WidgetCard title="Retención de Pacientes" icon={Users}>
            <div className="flex flex-col gap-4 h-full justify-center">
                {data.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-600">{item.name}</span>
                            <span className="text-slate-800">{item.value}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${item.value}%`, backgroundColor: item.fill }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </WidgetCard>
    );
}

export function DemandPeaksWidget({ data, themeColor }) {
    return (
        <WidgetCard title="Picos de Demanda" icon={BarChart2}>
            <div className="h-32 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <Bar
                            dataKey="value"
                            fill={themeColor || "#0ea5e9"}
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                background: 'white',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
            </div>
        </WidgetCard>
    );
}
