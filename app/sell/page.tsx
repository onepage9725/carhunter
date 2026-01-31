"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Component as GlitterBackground } from '@/components/ui/animated-hero-with-web-gl-glitter';
import { motion } from 'framer-motion';
import { Banknote, Zap, ShieldCheck } from 'lucide-react';
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function SellPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        brand: '',
        model: '',
        year: '',
        mileage: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const message = `*New Car Valuation Request*
Name: ${formData.name}
Email: ${formData.email}
Contact: ${formData.contact}
Car: ${formData.year} ${formData.brand} ${formData.model}
Mileage: ${formData.mileage} km`;

        // Simulate short processing delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        const whatsappUrl = `https://wa.me/601119453913?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        setIsSubmitting(false);
        setIsSuccess(true); // Optional: Keep success state or reset
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute inset-0 z-0">
                <GlitterBackground speed={0.5} intensity={5} />
            </div>

            {/* Content using z-index to sit on top */}
            <div className="relative z-10">
                <Navbar />

                <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                            >
                                Sell Your Car
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-lg text-gray-400 max-w-xl mx-auto"
                            >
                                Get a competitive valuation for your premium vehicle. Fill out the form below and our team will be in touch shortly.
                            </motion.p>
                        </div>

                        {/* Form */}
                        {isSuccess ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center"
                            >
                                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                                <p className="text-gray-400">Thank you, {formData.name}. We'll contact you within 24 hours.</p>
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="mt-8 text-white underline hover:text-gray-300 transition-colors"
                                >
                                    Submit another vehicle
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                onSubmit={handleSubmit}
                                className="space-y-12 bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10"
                            >
                                {/* Personal Information */}
                                <section>
                                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-600"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-600"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label htmlFor="contact" className="text-sm font-medium text-gray-300">Contact Number</label>
                                            <input
                                                type="tel"
                                                id="contact"
                                                name="contact"
                                                required
                                                value={formData.contact}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-600"
                                                placeholder="+60123456789"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Vehicle Information */}
                                <section>
                                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Vehicle Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="brand" className="text-sm font-medium text-gray-300">Brand</label>
                                            <input
                                                type="text"
                                                id="brand"
                                                name="brand"
                                                required
                                                value={formData.brand}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-600"
                                                placeholder="e.g. BMW"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="model" className="text-sm font-medium text-gray-300">Model</label>
                                            <input
                                                type="text"
                                                id="model"
                                                name="model"
                                                required
                                                value={formData.model}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-600"
                                                placeholder="e.g. M3 Competition"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="year" className="text-sm font-medium text-gray-300">Year</label>
                                            <input
                                                type="number"
                                                id="year"
                                                name="year"
                                                required
                                                min="1900"
                                                max={new Date().getFullYear() + 1}
                                                value={formData.year}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-600"
                                                placeholder="2023"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="mileage" className="text-sm font-medium text-gray-300">Mileage (km)</label>
                                            <input
                                                type="text"
                                                id="mileage"
                                                name="mileage"
                                                required
                                                value={formData.mileage}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-600"
                                                placeholder="e.g. 15,000"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="flex justify-center pt-8">
                                    <ShinyButton
                                        className="w-full md:w-auto min-w-[200px] flex justify-center !text-white hover:!scale-105"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            "Get Valuation"
                                        )}
                                    </ShinyButton>
                                </div>
                            </motion.form>
                        )}

                        {/* Features Section */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            <div className="relative rounded-2xl p-[1px]">
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={3}
                                />
                                <div className="relative bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center hover:bg-white/5 transition-colors duration-300 z-10 h-full">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Banknote className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Fair Market Value</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">We provide competitive offers based on real-time market data.</p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl p-[1px]">
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={3}
                                />
                                <div className="relative bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center hover:bg-white/5 transition-colors duration-300 z-10 h-full">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Quick Process</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">Fast evaluation and paperwork handling to get you paid quickly</p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl p-[1px]">
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={3}
                                />
                                <div className="relative bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center hover:bg-white/5 transition-colors duration-300 z-10 h-full">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Trusted Service</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">Join thousands of satisfied customers who trust us with their vehicle.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
