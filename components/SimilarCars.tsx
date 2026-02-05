"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TransitionLink from '@/components/TransitionLink';
import { ArrowRight } from 'lucide-react';

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
    priceRange: string;
    image: string;
    logo: string;
    extColors?: string[];
    seats?: number;
    transmissionGeneric?: string;
}

interface SimilarCarsProps {
    currentCarId: string;
    currentBodyType: string;
    currentPrice: string;
}

export default function SimilarCars({ currentCarId, currentBodyType, currentPrice }: SimilarCarsProps) {
    const [similarCars, setSimilarCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const parsePrice = (priceStr: string) => {
        if (!priceStr) return 0;
        // Take the first part of the string (in case of range "X - Y")
        const firstPart = priceStr.split('-')[0];
        // Extract all digits and convert to number
        const digits = firstPart.replace(/\D/g, '');
        return parseInt(digits) || 0;
    };

    useEffect(() => {
        const fetchSimilarCars = async () => {
            try {
                // Fetch cars with same body type
                const carsRef = collection(db, "cars");
                const q = query(carsRef, where("bodyType", "==", currentBodyType));

                const querySnapshot = await getDocs(q);
                let cars = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Car))
                    .filter(car => car.id !== currentCarId && car.slug !== currentCarId); // Exclude current car

                // Parse current car price
                const currentPriceVal = parsePrice(currentPrice);

                // Sort by price difference
                cars.sort((a, b) => {
                    const priceA = parsePrice(a.priceRange);
                    const priceB = parsePrice(b.priceRange);

                    const diffA = Math.abs(priceA - currentPriceVal);
                    const diffB = Math.abs(priceB - currentPriceVal);

                    return diffA - diffB;
                });

                // If less than 3 cars, we could fetch more, but for now let's just take top 3 matching body type
                // If the user wants to fallback to "just similar price" if body type matches are few, we'd need another query.
                // Requirement said: "Please always show the same body type of car with similar price first. else just show the similar car price."

                if (cars.length < 3) {
                    // Fetch all cars to find price similars if not enough body type matches
                    const allCarsQ = query(collection(db, "cars"));
                    const allCarsSnapshot = await getDocs(allCarsQ);
                    const allCars = allCarsSnapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() } as Car))
                        .filter(car => car.id !== currentCarId && car.slug !== currentCarId);

                    // Filter out cars already in our list
                    const existingIds = new Set(cars.map(c => c.id));
                    const remainingCars = allCars.filter(c => !existingIds.has(c.id));

                    // Sort remaining by price diff
                    remainingCars.sort((a, b) => {
                        const priceA = parsePrice(a.priceRange);
                        const priceB = parsePrice(b.priceRange);
                        return Math.abs(priceA - currentPriceVal) - Math.abs(priceB - currentPriceVal);
                    });

                    // Fill up to 3
                    const needed = 3 - cars.length;
                    cars = [...cars, ...remainingCars.slice(0, needed)];
                }

                setSimilarCars(cars.slice(0, 3));
            } catch (error) {
                console.error("Error fetching similar cars:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentBodyType) {
            fetchSimilarCars();
        }
    }, [currentCarId, currentBodyType, currentPrice]);

    if (loading || similarCars.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-16 border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Similar Vehicles</h2>
                        <p className="text-gray-500">Other vehicles you might be interested in</p>
                    </div>
                    <TransitionLink
                        href="/inventory"
                        className="group hidden md:flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all"
                    >
                        Explore more cars
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </TransitionLink>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {similarCars.map((car) => (
                        <TransitionLink key={car.id} href={`/cars/${car.slug || car.id}`}>
                            <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer h-full flex flex-col">

                                {/* Header */}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{car.brand} {car.model}</h3>
                                    <p className="text-gray-500 text-sm font-medium">
                                        {car.brand} • Model Year {car.year} • {car.mileage} Miles
                                    </p>
                                </div>

                                {/* Image */}
                                <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-8 bg-gray-100">
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
                                <div className="space-y-3 mb-8 text-sm mt-auto">
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
                                    <div className="w-10 h-10 rounded-full border border-gray-200 p-2 flex items-center justify-center bg-white">
                                        <img src={car.logo} alt={car.brand} className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        </TransitionLink>
                    ))}
                </div>

                {/* Mobile only CTA */}
                <div className="md:hidden mt-8 text-center">
                    <TransitionLink
                        href="/inventory"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-medium w-full justify-center"
                    >
                        Explore more cars
                        <ArrowRight size={18} />
                    </TransitionLink>
                </div>
            </div>
        </section>
    );
}
