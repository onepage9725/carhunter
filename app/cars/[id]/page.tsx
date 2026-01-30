"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ShinyButton } from '@/components/ui/shiny-button';
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    mileage: string;
    transmission: string;
    drivetrain: string;
    power: string;
    bodyType: string;
    engine: string;
    engineCC?: string;
    mpg: string;
    seats: number;
    doors?: number;
    priceRange: string;
    image: string;
    images?: string[];
    logo: string;
    extColors: string[];
    status: string;
    geran?: string;
    spareKey?: string;
}

export default function CarDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchCar = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "cars", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCar({ id: docSnap.id, ...docSnap.data() } as Car);
                } else {
                    router.push('/inventory');
                }
            } catch (error) {
                console.error("Error fetching car:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!car) {
        return null;
    }

    const allImages = car.images && car.images.length > 0 ? car.images : [car.image];

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <div className="min-h-screen bg-black">
            <Navbar />

            <div className="pt-4">
                {/* Back Button */}
                <div className="container mx-auto px-4 md:px-6 py-3">
                    <Link
                        href="/inventory"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Inventory
                    </Link>
                </div>

                {/* Main Content - 60/40 Split */}
                <div className="flex flex-col lg:flex-row min-h-screen">
                    {/* Left Side - Images (60%) - Desktop: Vertical Column, Mobile: Carousel */}
                    <div className="lg:w-[60%] bg-black">
                        {/* Mobile Carousel */}
                        <div className="lg:hidden">
                            <div
                                className="relative w-full h-[60vh]"
                                style={{ viewTransitionName: `car-image-${id}` } as React.CSSProperties}
                            >
                                <Image
                                    src={allImages[selectedImage] || '/placeholder.png'}
                                    alt={`${car.brand} ${car.model}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />

                                {/* Navigation Arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                                        >
                                            <ArrowLeft size={24} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                                        >
                                            <ArrowRight size={24} />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter */}
                                {allImages.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                                        {selectedImage + 1} / {allImages.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {allImages.length > 1 && (
                                <div className="bg-black border-t border-gray-800 p-4">
                                    <div className="flex gap-2 overflow-x-auto">
                                        {allImages.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? 'border-white scale-105'
                                                    : 'border-gray-700 hover:border-gray-500'
                                                    }`}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`View ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Desktop Vertical Column */}
                        <div className="hidden lg:block space-y-0">
                            {allImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative w-full h-screen"
                                    style={index === 0 ? { viewTransitionName: `car-image-${id}` } as React.CSSProperties : {}}
                                >
                                    <Image
                                        src={img || '/placeholder.png'}
                                        alt={`${car.brand} ${car.model} - View ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Sticky Information (40%) */}
                    <div className="lg:w-[40%] bg-black">
                        <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-600">
                            <div className="p-8 lg:p-12 text-white">
                                {/* Brand & Model */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img src={car.logo} alt={car.brand} className="w-12 h-12 object-contain invert" />
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                                {car.status}
                                            </span>
                                        </div>
                                        <ShinyButton className="text-sm px-6 py-2">
                                            Enquire Now
                                        </ShinyButton>
                                    </div>
                                    <h1 className="text-xl text-gray-400 mb-2">{car.brand}</h1>
                                    <h2 className="text-4xl font-bold mb-6">{car.model}</h2>
                                    <p className="text-gray-400 mb-4">Year {car.year}</p>
                                    <div className="text-sm text-gray-500 mb-2">Price Range</div>
                                    <div className="text-5xl font-bold">RM {car.priceRange}</div>
                                </div>

                                {/* Specifications */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-6 text-white">Specifications</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Mileage */}
                                        <div className="relative rounded-lg p-[1px]">
                                            <GlowingEffect
                                                spread={40}
                                                glow={true}
                                                disabled={false}
                                                proximity={64}
                                                inactiveZone={0.01}
                                                borderWidth={3}
                                            />
                                            <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">Mileage</span>
                                                <span className="text-base font-bold text-white">{car.mileage}</span>
                                            </div>
                                        </div>

                                        {/* Fuel Type */}
                                        <div className="relative rounded-lg p-[1px]">
                                            <GlowingEffect
                                                spread={40}
                                                glow={true}
                                                disabled={false}
                                                proximity={64}
                                                inactiveZone={0.01}
                                                borderWidth={3}
                                            />
                                            <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">Fuel Type</span>
                                                <span className="text-base font-bold text-white">{car.engine}</span>
                                            </div>
                                        </div>

                                        {/* Body Type */}
                                        <div className="relative rounded-lg p-[1px]">
                                            <GlowingEffect
                                                spread={40}
                                                glow={true}
                                                disabled={false}
                                                proximity={64}
                                                inactiveZone={0.01}
                                                borderWidth={3}
                                            />
                                            <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">Body Type</span>
                                                <span className="text-base font-bold text-white">{car.bodyType}</span>
                                            </div>
                                        </div>

                                        {/* Transmission */}
                                        <div className="relative rounded-lg p-[1px]">
                                            <GlowingEffect
                                                spread={40}
                                                glow={true}
                                                disabled={false}
                                                proximity={64}
                                                inactiveZone={0.01}
                                                borderWidth={3}
                                            />
                                            <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">Transmission</span>
                                                <span className="text-base font-bold text-white">{car.transmission}</span>
                                            </div>
                                        </div>

                                        {/* Drivetrain */}
                                        <div className="relative rounded-lg p-[1px]">
                                            <GlowingEffect
                                                spread={40}
                                                glow={true}
                                                disabled={false}
                                                proximity={64}
                                                inactiveZone={0.01}
                                                borderWidth={3}
                                            />
                                            <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">Drivetrain</span>
                                                <span className="text-base font-bold text-white">{car.drivetrain}</span>
                                            </div>
                                        </div>

                                        {/* Horsepower */}
                                        <div className="relative rounded-lg p-[1px]">
                                            <GlowingEffect
                                                spread={40}
                                                glow={true}
                                                disabled={false}
                                                proximity={64}
                                                inactiveZone={0.01}
                                                borderWidth={3}
                                            />
                                            <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">Horsepower</span>
                                                <span className="text-base font-bold text-white">{car.power}</span>
                                            </div>
                                        </div>

                                        {/* Color */}
                                        {car.extColors && car.extColors.length > 0 && (
                                            <div className="relative rounded-lg p-[1px]">
                                                <GlowingEffect
                                                    spread={40}
                                                    glow={true}
                                                    disabled={false}
                                                    proximity={64}
                                                    inactiveZone={0.01}
                                                    borderWidth={3}
                                                />
                                                <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Color</span>
                                                    <span className="text-base font-bold text-white">{car.extColors.join(', ')}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Engine CC */}
                                        {car.engineCC && (
                                            <div className="relative rounded-lg p-[1px]">
                                                <GlowingEffect
                                                    spread={40}
                                                    glow={true}
                                                    disabled={false}
                                                    proximity={64}
                                                    inactiveZone={0.01}
                                                    borderWidth={3}
                                                />
                                                <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Engine CC</span>
                                                    <span className="text-base font-bold text-white">{car.engineCC}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Seats */}
                                        <div className="relative rounded-lg p-[1px]">
                                            <GlowingEffect
                                                spread={40}
                                                glow={true}
                                                disabled={false}
                                                proximity={64}
                                                inactiveZone={0.01}
                                                borderWidth={3}
                                            />
                                            <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest">Seats</span>
                                                <span className="text-base font-bold text-white">{car.seats}</span>
                                            </div>
                                        </div>

                                        {/* Doors */}
                                        {car.doors && (
                                            <div className="relative rounded-lg p-[1px]">
                                                <GlowingEffect
                                                    spread={40}
                                                    glow={true}
                                                    disabled={false}
                                                    proximity={64}
                                                    inactiveZone={0.01}
                                                    borderWidth={3}
                                                />
                                                <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Doors</span>
                                                    <span className="text-base font-bold text-white">{car.doors}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Geran */}
                                        {car.geran && (
                                            <div className="relative rounded-lg p-[1px]">
                                                <GlowingEffect
                                                    spread={40}
                                                    glow={true}
                                                    disabled={false}
                                                    proximity={64}
                                                    inactiveZone={0.01}
                                                    borderWidth={3}
                                                />
                                                <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Geran</span>
                                                    <span className="text-base font-bold text-white">{car.geran}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Spare Key */}
                                        {car.spareKey && (
                                            <div className="relative rounded-lg p-[1px]">
                                                <GlowingEffect
                                                    spread={40}
                                                    glow={true}
                                                    disabled={false}
                                                    proximity={64}
                                                    inactiveZone={0.01}
                                                    borderWidth={3}
                                                />
                                                <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/10 p-4 bg-black/40 backdrop-blur-sm z-10">
                                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Spare Key</span>
                                                    <span className="text-base font-bold text-white">{car.spareKey}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
