import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a component is mounted (or based on a condition).
 * @param {boolean} isLocked - Whether the scroll should be locked.
 */
export function useScrollLock(isLocked) {
    useEffect(() => {
        if (!isLocked) return;

        // Save original overflow
        const originalStyle = window.getComputedStyle(document.body).overflow;

        // Lock scroll
        document.body.style.overflow = 'hidden';

        // Cleanup
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [isLocked]);
}
