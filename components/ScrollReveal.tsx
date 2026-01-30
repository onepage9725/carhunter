"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
}

export default function ScrollReveal({
    children,
    delay = 0,
    direction = "up",
    className = ""
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const directionOffset = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 }
    };

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                ...directionOffset[direction]
            }}
            animate={isInView ? {
                opacity: 1,
                y: 0,
                x: 0
            } : {}}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.25, 0.4, 0.25, 1] // Custom easing for luxury feel
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
