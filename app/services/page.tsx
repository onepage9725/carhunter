"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function ServicesPage() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videos = [
        "/assets/hero1.mp4",
        "/assets/hero2.mp4",
        "/assets/hero3.mp4"
    ];

    const handleVideoEnd = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    const heroRef = useRef(null);

    // Prevent right click to make "undownloadable"
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const services = [
        {
            image: "/assets/financing-service.png",
            heading: "Financing",
            intro: "We believe that acquiring your dream car should be as smooth as the drive itself. That's why we provide tailored financial solutions to ensure your purchase experience is seamless and transparent.",
            detail: "Our network of trusted banking partners allows us to negotiate competitive interest rates on your behalf. Whether you are a business owner seeking corporate rates or a first-time buyer, we structure payment plans that align perfectly with your cash flow. We handle the heavy lifting of approval and paperwork, so you can focus entirely on your new vehicle.",
        },
        {
            image: "/assets/sell-car-service.png",
            heading: "Sell Your Car",
            intro: "Upgrading your vehicle should be an exciting step forward, not a burden. We offer instant market-value appraisals to make transitioning to your next car effortless and fair.",
            detail: "Forget the stress of listing ads, scheduling viewings, and negotiating with strangers. Our professional appraisers evaluate your vehicle's condition and specs to provide a transparent offer on the spot. We manage all transfer paperwork and settlement details, allowing you to apply your current car's value directly toward your upgrade immediately.",
        },
        {
            image: "/assets/protection-service.png",
            heading: "Protection",
            intro: "Buying a pre-owned vehicle should never mean compromising on security. We include comprehensive warranty coverage on our inventory, giving you new-car confidence on the road ahead.",
            detail: "We stand behind the quality of every car we sell. Our extended protection plan covers critical mechanical components, including the engine and transmission, shielding you from unexpected repair costs. From minor adjustments to major technical support, our warranty ensures that your investment remains protected long after you leave the showroom.",
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Hero Section with Video Background */}
            <section ref={heroRef} className="relative h-[70vh] overflow-hidden bg-black" onContextMenu={handleContextMenu}>
                {/* Video Background Loop */}
                <div className="absolute inset-0 w-full h-full">
                    <AnimatePresence mode="wait">
                        <motion.video
                            key={currentVideoIndex}
                            src={videos[currentVideoIndex]}
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleVideoEnd}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }} // Smooth crossfade transition
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                            controls={false}
                            disablePictureInPicture
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
                </div>

                {/* Hero Content */}
                <div className="relative h-full flex items-center justify-center text-center px-4 z-20 pointer-events-none">
                    <div className="max-w-4xl pointer-events-auto">
                        <ScrollReveal>
                            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
                                Our Services
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <p className="text-xl md:text-2xl text-gray-300 font-light">
                                Comprehensive solutions designed to make your car buying experience exceptional
                            </p>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Services Sections */}
            <section className="bg-white">
                {services.map((service, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={index}
                            className={`${index === 0 ? '' : 'border-t border-gray-200'}`}
                        >
                            <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
                                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                                    {/* Image Side */}
                                    <ScrollReveal
                                        className="w-full lg:w-1/2"
                                        direction={isEven ? "left" : "right"}
                                    >
                                        <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl">
                                            <Image
                                                src={service.image}
                                                alt={service.heading}
                                                fill
                                                className="object-cover"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </ScrollReveal>

                                    {/* Content Side */}
                                    <div className="lg:w-1/2">
                                        <ScrollReveal delay={0.2}>
                                            <div className="inline-block px-4 py-2 bg-black text-white text-xs font-bold tracking-wider uppercase rounded-full mb-6">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                        </ScrollReveal>

                                        <ScrollReveal delay={0.3}>
                                            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                                                {service.heading}
                                            </h2>
                                        </ScrollReveal>

                                        <ScrollReveal delay={0.4}>
                                            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed font-light">
                                                {service.intro}
                                            </p>
                                        </ScrollReveal>

                                        <ScrollReveal delay={0.5}>
                                            <div className="border-l-4 border-black pl-6">
                                                <p className="text-gray-600 leading-relaxed text-lg">
                                                    {service.detail}
                                                </p>
                                            </div>
                                        </ScrollReveal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* CTA Section */}
            <section className="bg-black py-24 md:py-32 px-4 md:px-6">
                <div className="container mx-auto text-center">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Ready to Get Started?
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2}>
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                            Experience the difference of working with a team that puts your needs first.
                        </p>
                    </ScrollReveal>
                    <ScrollReveal delay={0.4}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/inventory"
                                className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
                            >
                                Browse Inventory
                            </a>
                            <a
                                href="#"
                                className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-colors"
                            >
                                Contact Us
                            </a>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </div>
    );
}
