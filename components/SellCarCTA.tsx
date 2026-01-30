"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function SellCarCTA() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax effect - background moves slower
    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section ref={ref} className="bg-black text-white py-24 relative overflow-hidden">
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0 h-[120%] -top-[10%]"
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('/assets/sell-car-bg.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </motion.div>

            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            {/* Existing gradients can remain or remove if they clash. Let's keep a subtle one */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-900/20 to-transparent z-0" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <ScrollReveal>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight max-w-4xl mx-auto">
                        We know what your <br className="hidden md:block" />
                        car is really worth
                    </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join the millions who value their car with CarHunter. It's completely free and we will give you a live valuation of what your car is worth.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={0.4}>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link
                            href="/sell"
                            className="group bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2"
                        >
                            Get your valuation
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="px-10 py-5 rounded-full font-semibold text-lg hover:text-white/80 transition-colors"
                        >
                            How it works
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
