"use client";

import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Parallax effect - image moves slower than scroll (0.5x speed)
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={ref} className="px-4 pb-4 md:px-6 md:pb-6 bg-white">
            <div className="relative w-full h-[90vh] rounded-[2.5rem] overflow-hidden">
                {/* Background Image with Parallax */}
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 w-full h-[120%] -top-[10%]"
                >
                    <video
                        className="w-full h-full object-cover pointer-events-none select-none"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2940&auto=format&fit=crop"
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <source src="/assets/hero2.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>

                {/* Dark Overlay - Strong Vignette */}
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center px-4">

                    {/* Social Proof / Avatars */}
                    <ScrollReveal delay={0.2}>
                        <div className="flex items-center gap-3 mb-6 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                            <div className="flex -space-x-2">
                                {[
                                    "/assets/client-1.jpg",
                                    "/assets/client-2.jpg",
                                    "/assets/client-3.jpg",
                                    "/assets/client-4.png"
                                ].map((src, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-gray-300 overflow-hidden relative">
                                        <img src={src} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                                2,500+ Happy Clients 🇲🇾
                            </span>
                        </div>
                    </ScrollReveal>

                    {/* Headline using Inter (from layout) but tight tracking */}
                    <ScrollReveal delay={0.4}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 max-w-5xl">
                            Malaysia Used Car <br className="hidden md:block" />
                            Deliver to You
                        </h1>
                    </ScrollReveal>

                    {/* Subhead */}
                    <ScrollReveal delay={0.6}>
                        <p className="text-gray-300 text-lg mb-10 font-medium max-w-xl mx-auto">
                            Malaysia's reliable source for high-quality used vehicles.
                        </p>
                    </ScrollReveal>

                    {/* CTA Button */}
                    <ScrollReveal delay={0.8}>
                        <Link
                            href="#"
                            className="bg-white text-black px-8 py-4 rounded-full font-semibold text-sm md:text-base hover:bg-gray-100 transition-colors shadow-lg shadow-black/20"
                        >
                            Explore Inventory
                        </Link>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}
