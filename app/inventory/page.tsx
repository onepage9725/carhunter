"use client";

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransitionLink from '@/components/TransitionLink';

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
    transmissionGeneric?: string;
    extColors: string[];
    intColors: string[];
    mpg: string;
    seats: number;
    priceRange: string;
    image: string;
    logo: string;
}

export default function InventoryPage() {
    const [allCars, setAllCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
    const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
    const [selectedDrivetrains, setSelectedDrivetrains] = useState<string[]>([]);
    const [yearRange, setYearRange] = useState({ min: '', max: '' });

    useEffect(() => {
        const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const carsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Car[];

            setAllCars(carsData);
            setFilteredCars(carsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Apply filters whenever any filter changes
    useEffect(() => {
        let filtered = [...allCars];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(car =>
                car.brand.toLowerCase().includes(query) ||
                car.model.toLowerCase().includes(query) ||
                car.year.toString().includes(query)
            );
        }

        // Brand filter
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(car => selectedBrands.includes(car.brand));
        }

        // Body type filter
        if (selectedBodyTypes.length > 0) {
            filtered = filtered.filter(car => selectedBodyTypes.includes(car.bodyType));
        }

        // Transmission filter
        if (selectedTransmissions.length > 0) {
            filtered = filtered.filter(car => selectedTransmissions.includes(car.transmission));
        }

        // Drivetrain filter
        if (selectedDrivetrains.length > 0) {
            filtered = filtered.filter(car => selectedDrivetrains.includes(car.drivetrain));
        }

        // Year range filter
        if (yearRange.min) {
            filtered = filtered.filter(car => car.year >= parseInt(yearRange.min));
        }
        if (yearRange.max) {
            filtered = filtered.filter(car => car.year <= parseInt(yearRange.max));
        }

        setFilteredCars(filtered);
    }, [searchQuery, selectedBrands, selectedBodyTypes, selectedTransmissions, selectedDrivetrains, yearRange, allCars]);

    // Get unique values for filters
    const uniqueBrands = Array.from(new Set(allCars.map(car => car.brand))).sort();
    const uniqueBodyTypes = Array.from(new Set(allCars.map(car => car.bodyType))).sort();
    const uniqueTransmissions = Array.from(new Set(allCars.map(car => car.transmission))).sort();
    const uniqueDrivetrains = Array.from(new Set(allCars.map(car => car.drivetrain))).sort();

    const toggleFilter = (value: string, selected: string[], setter: (val: string[]) => void) => {
        if (selected.includes(value)) {
            setter(selected.filter(item => item !== value));
        } else {
            setter([...selected, value]);
        }
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedBrands([]);
        setSelectedBodyTypes([]);
        setSelectedTransmissions([]);
        setSelectedDrivetrains([]);
        setYearRange({ min: '', max: '' });
    };

    const hasActiveFilters = searchQuery || selectedBrands.length > 0 || selectedBodyTypes.length > 0 ||
        selectedTransmissions.length > 0 || selectedDrivetrains.length > 0 || yearRange.min || yearRange.max;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="bg-gray-50 min-h-screen pt-24 pb-12">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Inventory</h1>
                        <p className="text-gray-600">Browse our complete collection of premium vehicles</p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by brand, model, or year..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                />
                            </div>

                            {/* Filter Toggle Button */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${showFilters ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                <SlidersHorizontal size={20} />
                                Filters
                                {hasActiveFilters && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        Active
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">Filters</h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                        >
                                            <X size={16} />
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Brand Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {uniqueBrands.map(brand => (
                                                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrands.includes(brand)}
                                                        onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
                                                        className="rounded border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <span className="text-sm text-gray-900">{brand}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Body Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                                        <div className="space-y-2">
                                            {uniqueBodyTypes.map(type => (
                                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBodyTypes.includes(type)}
                                                        onChange={() => toggleFilter(type, selectedBodyTypes, setSelectedBodyTypes)}
                                                        className="rounded border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <span className="text-sm text-gray-900">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Transmission Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                                        <div className="space-y-2">
                                            {uniqueTransmissions.map(trans => (
                                                <label key={trans} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTransmissions.includes(trans)}
                                                        onChange={() => toggleFilter(trans, selectedTransmissions, setSelectedTransmissions)}
                                                        className="rounded border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <span className="text-sm text-gray-900">{trans}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Drivetrain Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Drivetrain</label>
                                        <div className="space-y-2">
                                            {uniqueDrivetrains.map(drive => (
                                                <label key={drive} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDrivetrains.includes(drive)}
                                                        onChange={() => toggleFilter(drive, selectedDrivetrains, setSelectedDrivetrains)}
                                                        className="rounded border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <span className="text-sm text-gray-900">{drive}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Year Range Filter */}
                                    <div className="md:col-span-2 lg:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Year Range</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={yearRange.min}
                                                onChange={(e) => setYearRange({ ...yearRange, min: e.target.value })}
                                                className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={yearRange.max}
                                                onChange={(e) => setYearRange({ ...yearRange, max: e.target.value })}
                                                className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Showing <span className="font-bold text-gray-900">{filteredCars.length}</span> of <span className="font-bold text-gray-900">{allCars.length}</span> vehicles
                        </p>
                    </div>

                    {/* Cars Grid */}
                    {filteredCars.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No vehicles found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-black font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCars.map((car) => (
                                <TransitionLink key={car.id} href={`/cars/${car.id}`}>
                                    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer">
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{car.brand} {car.model}</h3>
                                            <p className="text-gray-500 text-sm font-medium">
                                                {car.brand} • Model Year {car.year} • {car.mileage} Miles
                                            </p>
                                        </div>

                                        <div
                                            className="relative h-56 w-full rounded-2xl overflow-hidden mb-8 bg-gray-100"
                                            style={{ viewTransitionName: `car-image-${car.id}` } as React.CSSProperties}
                                        >
                                            <Image
                                                src={car.image || '/placeholder.png'}
                                                alt={`${car.brand} ${car.model}`}
                                                fill
                                                className="object-cover transition-transform duration-500 ease-out hover:scale-110"
                                            />
                                        </div>

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
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
