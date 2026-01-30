"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ViewTransitions({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Check if View Transitions API is supported
        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
            // The transition will be handled automatically by the browser
            // when navigation occurs
        }
    }, [pathname]);

    return <>{children}</>;
}
