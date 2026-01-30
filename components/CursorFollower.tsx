"use client";

import { useEffect, useRef } from "react";

export default function CursorFollower() {
    // Refs for the cursor element and current position state
    const cursorRef = useRef<HTMLDivElement>(null);

    // Use refs for mutable values to avoid re-renders during animation loop
    const positionRef = useRef({
        mouseX: 0,
        mouseY: 0,
        destinationX: 0,
        destinationY: 0,
        distanceX: 0,
        distanceY: 0,
        key: -1,
    });

    useEffect(() => {
        // Initial position to center of screen or off-screen
        if (typeof window !== "undefined") {
            positionRef.current.mouseX = window.innerWidth / 2;
            positionRef.current.mouseY = window.innerHeight / 2;
        }

        const handleMouseMove = (event: MouseEvent) => {
            positionRef.current.mouseX = event.clientX;
            positionRef.current.mouseY = event.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        const followMouse = () => {
            positionRef.current.key = requestAnimationFrame(followMouse);

            const {
                mouseX,
                mouseY,
                destinationX,
                destinationY,
            } = positionRef.current;

            // Linear interpolation (Lerp) for smooth following
            // 0.1 is the easing factor (lower = slower/smoother)
            if (!destinationX || !destinationY) {
                positionRef.current.destinationX = mouseX;
                positionRef.current.destinationY = mouseY;
            } else {
                positionRef.current.destinationX = (1 - 0.1) * destinationX + 0.1 * mouseX;
                positionRef.current.destinationY = (1 - 0.1) * destinationY + 0.1 * mouseY;
            }

            if (cursorRef.current) {
                // Use translate3d for GPU acceleration
                cursorRef.current.style.transform = `translate3d(${positionRef.current.destinationX}px, ${positionRef.current.destinationY}px, 0)`;
            }
        };

        followMouse();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(positionRef.current.key);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className={`fixed top-0 left-0 w-3 h-3 bg-red-600 rounded-full pointer-events-none z-[9999] -mt-1.5 -ml-1.5`}
            style={{
                // Initialize off-screen to avoid jump
                transform: 'translate3d(-100px, -100px, 0)'
            }}
        />
    );
}
