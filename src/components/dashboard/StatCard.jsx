import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";

export function StatCard({ title, value, targetValue, prefix = "", suffix = "", trend, trendValue, icon: Icon, color, inverseTrend }) {
    // Logic: 
    // Normal: Up = Good (Green), Down = Bad (Red)
    // Inverse (e.g. Absenteeism): Down = Good (Green), Up = Bad (Red)

    const isPositive = trend === "up";
    const isGood = inverseTrend ? !isPositive : isPositive;

    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

    // Animation Logic
    const springValue = useSpring(0, {
        stiffness: 45,
        damping: 20,
        mass: 1
    });
    const displayValue = useTransform(springValue, (latest) => {
        // Format logic: if strict integer, no decimals. If float, show 1 decimal.
        if (targetValue % 1 === 0) {
            return `${prefix}${Math.round(latest)}${suffix}`;
        }
        return `${prefix}${latest.toFixed(1)}${suffix}`; // Keep 1 decimal for floats like 4.2%
    });

    useEffect(() => {
        if (typeof targetValue === 'number') {
            springValue.set(targetValue);
        }
    }, [targetValue, springValue]);

    return (
        <div
            className="group relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md p-6 border border-white/60 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
                    <motion.h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                        {/* Only use animation if targetValue is provided, else fallback to static string */}
                        {typeof targetValue === 'number' ? displayValue : value}
                    </motion.h3>
                </div>
                <div
                    className={cn("p-3 rounded-2xl opacity-80 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-[15deg]", color)}
                >
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
