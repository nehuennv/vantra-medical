import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

// NUEVAS UTILIDADES

export function calculateAge(birthDateString) {
    if (!birthDateString) return null;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function getAvatarColor(name) {
    const colors = [
        "bg-red-100 text-red-600",
        "bg-orange-100 text-orange-600",
        "bg-amber-100 text-amber-600",
        "bg-yellow-100 text-yellow-600",
        "bg-lime-100 text-lime-600",
        "bg-green-100 text-green-600",
        "bg-emerald-100 text-emerald-600",
        "bg-teal-100 text-teal-600",
        "bg-cyan-100 text-cyan-600",
        "bg-sky-100 text-sky-600",
        "bg-blue-100 text-blue-600",
        "bg-indigo-100 text-indigo-600",
        "bg-violet-100 text-violet-600",
        "bg-purple-100 text-purple-600",
        "bg-fuchsia-100 text-fuchsia-600",
        "bg-pink-100 text-pink-600",
        "bg-rose-100 text-rose-600",
    ];

    if (!name) return colors[0];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

/**
 * Parsea un string de KPI con sufijos (k, M, %) y devuelve el valor numérico, sufijo y valor crudo.
 * @param {string|number} valueString - El valor en string (ej: "2.4M", "50%", "100k")
 * @returns {object} { value, suffix, raw }
 */
export function parseKpiValue(valueString) {
    // Si es null/undefined, devolver defecto
    if (valueString === null || valueString === undefined) {
        return { value: 0, suffix: "", raw: 0 };
    }

    const str = String(valueString).trim();
    let value = 0;
    let suffix = "";
    let raw = 0;

    // Detectar sufijo y calcular
    if (str.includes("%")) {
        value = parseFloat(str.replace("%", ""));
        suffix = "%";
        raw = value; // Por lo general para % el 'raw' se puede considerar el mismo numero (o /100 segun uso, pero aqui mantenemos la escala visual)
    } else if (str.toLowerCase().includes("m")) {
        value = parseFloat(str.replace(/m/i, ""));
        suffix = "M";
        raw = value * 1000000;
    } else if (str.toLowerCase().includes("k")) {
        value = parseFloat(str.replace(/k/i, ""));
        suffix = "k";
        raw = value * 1000;
    } else {
        // Limpiar cualquier caracter no numérico excepto punto y menos
        value = parseFloat(str.replace(/[^0-9.-]/g, ""));
        raw = value;
    }

    // Seguridad contra NaN
    if (isNaN(value)) {
        value = 0;
        raw = 0;
    }

    return { value, suffix, raw };
}