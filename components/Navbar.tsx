"use client";

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Menu, X } from 'lucide-react'
import TransitionLink from './TransitionLink'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full bg-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
            {/* Logo */}
            <TransitionLink href="/" className="relative h-8 w-32 flex-shrink-0 z-50">
                <Image
                    src="/assets/logo.png"
                    alt="CarHunter Logo"
                    fill
                    className="object-contain object-left"
                    priority
                />
            </TransitionLink>

            {/* Desktop Nav - Centered & Simple */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                <TransitionLink href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
                    Home
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </TransitionLink>
                <TransitionLink href="/services" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
                    Services
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </TransitionLink>
                <TransitionLink href="/inventory" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
                    Browse Car
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </TransitionLink>
                <TransitionLink href="/sell" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
                    Sell Your Car
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </TransitionLink>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 z-50">
                <TransitionLink
                    href="/inventory"
                    className="hidden md:block bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-black transition-colors"
                >
                    Browse Car
                </TransitionLink>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6 text-black" />
                    ) : (
                        <Menu className="w-6 h-6 text-black" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {/* Overlay background */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <div className={`fixed top-0 right-0 w-[75%] max-w-sm h-full bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full pt-24 px-6 pb-6">
                    <div className="flex flex-col gap-6">
                        <TransitionLink
                            href="/"
                            className="text-lg font-medium text-gray-900 hover:text-red-600 transition-colors border-b border-gray-100 pb-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </TransitionLink>
                        <TransitionLink
                            href="/services"
                            className="text-lg font-medium text-gray-900 hover:text-red-600 transition-colors border-b border-gray-100 pb-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Services
                        </TransitionLink>
                        <TransitionLink
                            href="/inventory"
                            className="text-lg font-medium text-gray-900 hover:text-red-600 transition-colors border-b border-gray-100 pb-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Browse Car
                        </TransitionLink>
                        <TransitionLink
                            href="/sell"
                            className="text-lg font-medium text-gray-900 hover:text-red-600 transition-colors border-b border-gray-100 pb-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sell Your Car
                        </TransitionLink>
                    </div>

                    <div className="mt-auto flex flex-col gap-4">
                        <TransitionLink
                            href="/inventory"
                            className="w-full bg-zinc-900 text-white text-center text-sm font-medium px-5 py-3 rounded-lg hover:bg-black transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Browse Car
                        </TransitionLink>
                        <button className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 font-medium px-5 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <Phone className="w-4 h-4" />
                            <span>Call Us</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
