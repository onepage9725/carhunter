"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    priceRange: string;
    image: string;
    status: 'Available' | 'Sold';
    mileage?: string;
    featured?: boolean;
    featuredAt?: any;
}

export default function AdminDashboard() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const carsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Car[];
            setCars(carsData);
            setLoading(false);
        }, (error) => {
            console.error("Dashboard Error:", error);
            // Even if there is an error (like permissions), we must stop loading
            setLoading(false);
            // Optionally set an error state here to show in UI
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            await deleteDoc(doc(db, "cars", id));
        }
    };

    const handleToggleFeatured = async (car: Car) => {
        const { updateDoc, serverTimestamp, query: fsQuery, where, getDocs } = await import('firebase/firestore');

        if (!car.featured) {
            // Featuring a car - check if we already have 3 featured
            const featuredQuery = fsQuery(collection(db, "cars"), where("featured", "==", true));
            const featuredSnapshot = await getDocs(featuredQuery);

            if (featuredSnapshot.size >= 3) {
                // Find the oldest featured car
                const featuredCars = featuredSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Car[];

                featuredCars.sort((a, b) => {
                    const aTime = a.featuredAt?.toMillis() || 0;
                    const bTime = b.featuredAt?.toMillis() || 0;
                    return aTime - bTime;
                });

                const oldestFeatured = featuredCars[0];

                if (!confirm(`You already have 3 featured cars. Featuring "${car.brand} ${car.model}" will unfeature "${oldestFeatured.brand} ${oldestFeatured.model}". Continue?`)) {
                    return;
                }

                // Unfeature the oldest car
                await updateDoc(doc(db, "cars", oldestFeatured.id), {
                    featured: false,
                    featuredAt: null
                });
            }

            // Feature the new car
            await updateDoc(doc(db, "cars", car.id), {
                featured: true,
                featuredAt: serverTimestamp()
            });
        } else {
            // Unfeaturing a car
            await updateDoc(doc(db, "cars", car.id), {
                featured: false,
                featuredAt: null
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your vehicle inventory</p>
                </div>

                <Link
                    href="/admin93193913/add"
                    className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10"
                >
                    <Plus size={18} />
                    <span>Add New Car</span>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Listings</span>
                    <div className="text-4xl font-bold mt-2 text-gray-900">{cars.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active</span>
                    <div className="text-4xl font-bold mt-2 text-green-600">{cars.filter(c => c.status === 'Available').length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Views (Today)</span>
                    <div className="text-4xl font-bold mt-2 text-blue-600">-</div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <h2 className="text-lg font-bold">Recent Listings</h2>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search cars..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Car</th>
                                <th className="px-6 py-4 font-medium">Details</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Featured</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cars.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No listings found. Add your first car!
                                    </td>
                                </tr>
                            ) : (
                                cars.map((car) => (
                                    <tr key={car.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                                                    <Image src={car.image || '/placeholder.png'} alt={car.model} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{car.model}</div>
                                                    <div className="text-sm text-gray-500">{car.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {car.year} • {car.mileage || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            RM {car.priceRange}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${car.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {car.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleFeatured(car)}
                                                className={`p-2 rounded-lg transition-colors ${car.featured
                                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                                                    }`}
                                                title={car.featured ? 'Remove from featured' : 'Add to featured'}
                                            >
                                                <Star size={18} fill={car.featured ? 'currentColor' : 'none'} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin93193913/edit/${car.id}`} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(car.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
