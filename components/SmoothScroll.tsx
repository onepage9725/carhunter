"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize Lenis with custom settings for heavy, smooth momentum
        const lenis = new Lenis({
            duration: 1.2,        // Longer duration for smoother feel (default: 1)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for gentle deceleration
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,    // Enable smooth wheel scrolling
            wheelMultiplier: 1,   // Standard wheel sensitivity
            touchMultiplier: 2,   // Slightly faster touch scrolling
            infinite: false,
        });

        // Request animation frame loop
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup
        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
