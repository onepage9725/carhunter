"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        // Counter animation
        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Faster increment
                return Math.min(prev + Math.floor(Math.random() * 10) + 5, 100);
            });
        }, 50);

        // Remove loader after animation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white overflow-hidden"
                    initial={{ y: 0 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-8xl md:text-[10rem] font-bold tracking-tighter"
                        >
                            {counter}%
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
