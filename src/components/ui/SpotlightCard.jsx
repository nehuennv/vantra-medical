import React from 'react';
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export const SpotlightCard = ({ children, className, ...props }) => {
    // Spotlight Logic - Instant (Optimized)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = { maskImage, WebkitMaskImage: maskImage };

    return (
        <div
            onMouseMove={onMouseMove}
            className={cn(
                "group relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-md",
                className
            )}
            {...props}
        >
            {/* Spotlight Overlay */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={style}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 opacity-50" />
            </motion.div>

            {/* Content Container (z-10 to stay above spotlight) */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};
