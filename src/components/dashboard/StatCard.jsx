import React from 'react';
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({ title, value, trend, trendValue, icon: Icon, color, inverseTrend }) {
    // Logic: 
    // Normal: Up = Good (Green), Down = Bad (Red)
    // Inverse (e.g. Absenteeism): Down = Good (Green), Up = Bad (Red)

    const isPositive = trend === "up";
    const isGood = inverseTrend ? !isPositive : isPositive;

    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md p-6 border border-white/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                </div>
                <div className={cn("p-3 rounded-2xl opacity-80", color)}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <span className={cn(
                    "flex items-center px-2 py-1 rounded-lg text-[10px] font-bold",
                    isGood
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                )}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {trendValue}
                </span>
            </div>
        </div>
    );
}
