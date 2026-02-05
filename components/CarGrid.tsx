"use client";

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ScrollReveal from './ScrollReveal';
import TransitionLink from './TransitionLink';

interface Car {
    id: string;
    slug?: string;
    brand: string;
    model: string;
    year: number;
    mileage: string;
    transmission: string;
    drivetrain: string;
    power: string;
    bodyType: string;
    engine: string;
    transmissionGeneric?: string;
    extColors: string[];
    intColors: string[];
    mpg: string;
    seats: number;
    priceRange: string;
    image: string;
    logo: string;
}

export default function CarGrid() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "cars"),
            orderBy("featuredAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const carsData = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter((car: any) => car.featured === true)
                .slice(0, 3) as Car[];

            setCars(carsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-gray-50 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </section>
        )
    }

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <ScrollReveal>
                    <div className="text-left mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">
                            Latest Arrivals
                        </h2>
                    </div>
                </ScrollReveal>

                {/* Grid */}
                {cars.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No featured cars yet</h3>
                        <p className="text-gray-500">Featured cars will appear here once added by admin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cars.map((car, index) => (
                            <ScrollReveal key={car.id} delay={index * 0.15}>
                                <TransitionLink href={`/cars/${car.slug || car.id}`}>
                                    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer">

                                        {/* Header */}
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{car.brand} {car.model}</h3>
                                            <p className="text-gray-500 text-sm font-medium">
                                                {car.brand} • Model Year {car.year} • {car.mileage} Miles
                                            </p>
                                        </div>

                                        {/* Image with view-transition-name */}
                                        <div
                                            className="relative h-56 w-full rounded-2xl overflow-hidden mb-8 bg-gray-100"
                                            style={{ viewTransitionName: `car-image-${car.slug || car.id}` } as React.CSSProperties}
                                        >
                                            <Image
                                                src={car.image || '/placeholder.png'}
                                                alt={`${car.brand} ${car.model}`}
                                                fill
                                                className="object-cover transition-transform duration-500 ease-out hover:scale-110"
                                            />
                                        </div>

                                        {/* Main Specs (3 Cols) */}
                                        <div className="flex justify-between text-center mb-8 px-2">
                                            <div className="w-1/3">
                                                <span className="block text-lg font-bold text-gray-900">{car.drivetrain}</span>
                                                <span className="text-xs text-gray-400 font-medium uppercase">Drivetrain</span>
                                            </div>
                                            <div className="w-1/3 border-l border-r border-gray-100">
                                                <span className="block text-lg font-bold text-gray-900">{car.transmission}</span>
                                                <span className="text-xs text-gray-400 font-medium uppercase">Transmission</span>
                                            </div>
                                            <div className="w-1/3">
                                                <span className="block text-lg font-bold text-gray-900">{car.power}</span>
                                                <span className="text-xs text-gray-400 font-medium uppercase">Power</span>
                                            </div>
                                        </div>

                                        {/* Detailed Specs List */}
                                        <div className="space-y-3 mb-8 text-sm">
                                            <div className="flex items-center">
                                                <span className="w-1/3 text-gray-500">Body type</span>
                                                <span className="font-bold text-gray-900">{car.bodyType}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-1/3 text-gray-500">Engine</span>
                                                <span className="font-bold text-gray-900">{car.engine}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-1/3 text-gray-500">Transmission</span>
                                                <span className="font-bold text-gray-900">{car.transmissionGeneric || car.transmission}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-1/3 text-gray-500">Exterior color</span>
                                                <div className="flex items-center gap-2">
                                                    {/* Exterior Dots */}
                                                    {car.extColors?.map((color, i) => (
                                                        <div key={i} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-1/3 text-gray-500">Seats</span>
                                                <span className="font-bold text-gray-900">{car.seats}</span>
                                            </div>
                                        </div>

                                        {/* Footer / Price */}
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">RM {car.priceRange}</div>
                                                <div className="text-xs text-gray-400 font-medium">Avg. price</div>
                                            </div>

                                            {/* Brand Logo Circle */}
                                            <div className="w-10 h-10 rounded-full border border-gray-200 p-2 flex items-center justify-center bg-white">
                                                <img src={car.logo} alt={car.brand} className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                </TransitionLink>
                            </ScrollReveal>
                        ))}
                    </div>
                )}

                {/* Explore All Cars Button */}
                <ScrollReveal delay={0.3}>
                    <div className="flex justify-center mt-12">
                        <TransitionLink
                            href="/inventory"
                            className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10 flex items-center gap-2"
                        >
                            Explore All Cars
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </TransitionLink>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
