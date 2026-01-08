import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueChart({ data, themeColor }) {

    return (
        <div className="rounded-[2rem] bg-white/70 border border-white/60 shadow-sm p-8 backdrop-blur-md flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-100">

            <div className="mb-6 flex items-end justify-between relative z-10">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Crecimiento Mensual</h3>
                    <p className="text-sm text-slate-500 font-medium">Ingresos brutos estimados vs Asistencia.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-bold text-slate-600">Este año</span>
                </div>
            </div>

            {/* Chart Container fixed height */}
            <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={themeColor || "#0ea5e9"} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={themeColor || "#0ea5e9"} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                            cursor={{ stroke: themeColor || '#0ea5e9', strokeWidth: 2, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={themeColor || "#0ea5e9"}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
