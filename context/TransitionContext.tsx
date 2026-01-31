"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface TransitionContextType {
    startTransition: () => Promise<void>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const pathname = usePathname();

    // Reset transition state when path changes (route change complete)
    useEffect(() => {
        setIsTransitioning(false);
    }, [pathname]);

    const startTransition = async () => {
        setIsTransitioning(true);
        // Wait for entrance animation to complete before resolving
        // This allows the caller (TransitionLink) to trigger router.push
        await new Promise(resolve => setTimeout(resolve, 800));
    };

    return (
        <TransitionContext.Provider value={{ startTransition }}>
            <AnimatePresence mode="wait">
                {isTransitioning && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-black"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }} // Exit animation handled by AnimatePresence
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    />
                )}
            </AnimatePresence>
            {/* 
               We need a secondary overlay for the exit animation trigger 
               OR logic to keep the black screen there until route change.
               
               Actually, AnimatePresence triggers exit on unmount.
               Ideally:
               1. Link Click -> startTransition -> isTransitioning = true -> Overlay slides UP from bottom to cover screen.
               2. Wait 800ms.
               3. isTransitioning = true (stay covered).
               4. Router push -> Path changes.
               5. useEffect[pathname] -> setIsTransitioning(false).
               6. isTransitioning becomes false -> AnimatePresence triggers exit -> Overlay slides UP from center to top.
            */}

            {/* 
                Refined Logic:
                We need the overlay to STAY covering the screen during the route change.
                The simplistic AnimatePresence above might unmount it too early if we toggle it off.
                
                Actually, when route changes, the layout *persists*. The state persists.
                So:
                1. isTransitioning = true. Motion div animates y: "100%" -> y: 0. (Covers screen)
                2. Router push happens.
                3. useEffect [pathname] fires. setIsTransitioning(false).
                4. Motion div animates y: 0 -> y: "-100%". (Reveals new page)
             */}

            {children}
        </TransitionContext.Provider>
    );
}

export function useTransition() {
    const context = useContext(TransitionContext);
    if (!context) {
        throw new Error("useTransition must be used within a TransitionProvider");
    }
    return context;
}
