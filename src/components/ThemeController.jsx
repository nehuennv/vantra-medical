import { useEffect } from 'react';
import { clientConfig } from "@/config/client";

export function ThemeController() {
    useEffect(() => {
        const applyTheme = () => {
            const { theme } = clientConfig;
            if (!theme?.primary) return;

            const primaryHsl = hexToHSL(theme.primary);

            // Set CSS variables on the root element
            const root = document.documentElement;
            root.style.setProperty('--primary', primaryHsl);
            root.style.setProperty('--ring', primaryHsl);

            // Optional: If we wanted to generate a chartSecondary derived from primary, we could do it here too,
            // but for now we trust the config or handle charts via Recharts props directly.
        };

        applyTheme();
    }, []);

    return null; // This component renders nothing visually
}

// Helper: Hex to HSL (0 0% 0% format)
function hexToHSL(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    // Parse r, g, b
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Round values
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
}
