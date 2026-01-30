"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditCarPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Multi-image state
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

    const [formLoading, setFormLoading] = useState(false); // New state for processing images

    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: 0,
        priceRange: "",
        mileage: "",
        transmission: "Automatic",
        drivetrain: "AWD",
        power: "",
        bodyType: "Sedan",
        engine: "",
        engineCC: "",
        mpg: "",
        seats: 5,
        doors: 4,
        extColors: [] as string[],
        status: "Available",
        featured: false,
        geran: "Yes",
        spareKey: "Yes"
    });

    useEffect(() => {
        const fetchCar = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "cars", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData(prev => ({ ...prev, ...data }));

                    // Handle legacy image vs new images array
                    if (data.images && Array.isArray(data.images)) {
                        setExistingImages(data.images);
                    } else if (data.image) {
                        setExistingImages([data.image]);
                    }
                } else {
                    alert("Car not found");
                    router.push("/admin");
                }
            } catch (error) {
                console.error("Error fetching car:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id, router]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const totalImages = existingImages.length + newImageFiles.length + files.length;
        if (totalImages > 10) {
            alert(`You can only have a maximum of 10 images. You currently have ${existingImages.length + newImageFiles.length}.`);
            return;
        }

        setFormLoading(true);

        try {
            const processedFiles = await Promise.all(files.map(async (file) => {
                const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");

                if (isHeic) {
                    try {
                        console.log("Converting HEIC file:", file.name);
                        const heic2any = (await import("heic2any")).default;

                        const blob = await heic2any({
                            blob: file,
                            toType: "image/jpeg",
                            quality: 0.8
                        });
                        const convertedBlob = Array.isArray(blob) ? blob[0] : blob;
                        return new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), { type: "image/jpeg" });
                    } catch (err: any) {
                        console.error("HEIC conversion failed for", file.name);
                        console.error("Error details:", err);
                        alert(`Failed to process HEIC image: ${file.name}. Error: ${err?.message || "Check console"}`);
                        return null;
                    }
                }
                return file;
            }));

            const validFiles = processedFiles.filter((f): f is File => f !== null);

            if (validFiles.length > 0) {
                const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
                setNewImageFiles(prev => [...prev, ...validFiles]);
                setNewPreviews(prev => [...prev, ...newPreviewUrls]);
            }

        } catch (error) {
            console.error("Error processing images:", error);
        } finally {
            setFormLoading(false);
            e.target.value = "";
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const uploadedImageUrls: string[] = [];

            // Upload new images
            for (const file of newImageFiles) {
                const storageRef = ref(storage, `cars/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                uploadedImageUrls.push(url);
            }

            // Combine existing and new images
            const finalImages = [...existingImages, ...uploadedImageUrls];
            const mainImage = finalImages.length > 0 ? finalImages[0] : "";

            // Check featured car limit if this car is being featured
            let featuredAt = formData.featured ? new Date() : null;
            if (formData.featured) {
                const { query: fsQuery, where, getDocs, doc: fsDoc, collection: fsCollection } = await import('firebase/firestore');
                const featuredQuery = fsQuery(fsCollection(db, "cars"), where("featured", "==", true));
                const featuredSnapshot = await getDocs(featuredQuery);

                // Filter out the current car from the count
                const otherFeaturedCars = featuredSnapshot.docs.filter(doc => doc.id !== id);

                if (otherFeaturedCars.length >= 3) {
                    const featuredCars = otherFeaturedCars.map((doc: any) => ({
                        id: doc.id,
                        brand: doc.data().brand as string,
                        model: doc.data().model as string,
                        featuredAt: doc.data().featuredAt
                    }));

                    featuredCars.sort((a, b) => {
                        const aTime = a.featuredAt?.toMillis() || 0;
                        const bTime = b.featuredAt?.toMillis() || 0;
                        return aTime - bTime;
                    });

                    const oldestFeatured = featuredCars[0];

                    if (!confirm(`You already have 3 featured cars. Featuring "${formData.brand} ${formData.model}" will unfeature "${oldestFeatured.brand} ${oldestFeatured.model}". Continue?`)) {
                        setSubmitting(false);
                        return;
                    }

                    await updateDoc(fsDoc(db, "cars", oldestFeatured.id), {
                        featured: false,
                        featuredAt: null
                    });
                }
            }

            // Update Firestore
            const docRef = doc(db, "cars", id);
            await updateDoc(docRef, {
                ...formData,
                year: Number(formData.year),
                seats: Number(formData.seats),
                doors: Number(formData.doors),
                image: mainImage, // Update main image (legacy support)
                images: finalImages, // Save all images
                featuredAt: featuredAt,
                updatedAt: new Date()
            });

            router.push("/admin");
        } catch (error) {
            console.error("Error updating car:", error);
            alert("Failed to update car.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-black">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-black">Edit Vehicle</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Images (Max 10)
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {/* Existing Images */}
                        {existingImages.map((src, index) => (
                            <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                                <Image src={src} alt={`Existing ${index}`} fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(index)}
                                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                                        Main
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* New Previews */}
                        {newPreviews.map((src, index) => (
                            <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                                <Image src={src} alt={`New Preview ${index}`} fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>
                                <div className="absolute bottom-2 left-2 bg-green-500/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                                    New
                                </div>
                            </div>
                        ))}

                        {/* Upload Button Block */}
                        {(existingImages.length + newPreviews.length) < 10 && (
                            <div className="relative aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                {formLoading ? (
                                    <Loader2 size={24} className="animate-spin text-gray-400" />
                                ) : (
                                    <>
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-400 group-hover:scale-110 transition-transform">
                                            <Upload size={20} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">Add Image</span>
                                        <input
                                            type="file"
                                            accept="image/*, .heic, .heif"
                                            multiple
                                            onChange={handleImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                            value={formData.brand}
                            onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                            value={formData.model}
                            onChange={e => setFormData({ ...formData, model: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                            required
                            type="number"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                            value={formData.year}
                            onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">RM</span>
                            <input
                                required
                                type="text"
                                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                value={formData.priceRange}
                                onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Available">Available</option>
                            <option value="Sold">Sold</option>
                        </select>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-bold mb-6 text-black">Technical Specs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500"
                                value={formData.mileage} onChange={e => setFormData({ ...formData, mileage: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black"
                                value={formData.transmission} onChange={e => setFormData({ ...formData, transmission: e.target.value })}>
                                <option>Automatic</option>
                                <option>Manual</option>
                                <option>PDK</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Drivetrain</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black"
                                value={formData.drivetrain} onChange={e => setFormData({ ...formData, drivetrain: e.target.value })}>
                                <option>AWD</option>
                                <option>RWD</option>
                                <option>FWD</option>
                                <option>4WD</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Horsepower</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500"
                                value={formData.power} onChange={e => setFormData({ ...formData, power: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black"
                                value={formData.engine} onChange={e => setFormData({ ...formData, engine: e.target.value })}>
                                <option>Petrol</option>
                                <option>Diesel</option>
                                <option>EV</option>
                                <option>Hydrogen</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black"
                                value={formData.bodyType} onChange={e => setFormData({ ...formData, bodyType: e.target.value })}>
                                <option>Sedan</option>
                                <option>Coupe</option>
                                <option>SUV</option>
                                <option>Convertible</option>
                                <option>Hatchback</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Engine CC</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500" placeholder="e.g. 2998cc"
                                value={formData.engineCC} onChange={e => setFormData({ ...formData, engineCC: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                            <input type="number" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black" min="2" max="9"
                                value={formData.seats} onChange={e => setFormData({ ...formData, seats: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Doors</label>
                            <input type="number" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black" min="2" max="5"
                                value={formData.doors} onChange={e => setFormData({ ...formData, doors: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Geran (Registration)</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black"
                                value={formData.geran} onChange={e => setFormData({ ...formData, geran: e.target.value })}>
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Spare Key</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black"
                                value={formData.spareKey} onChange={e => setFormData({ ...formData, spareKey: e.target.value })}>
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500" placeholder="e.g. Black, White, Red"
                                value={formData.extColors.join(', ')}
                                onChange={e => setFormData({ ...formData, extColors: e.target.value.split(',').map(c => c.trim()).filter(c => c) })} />
                            <p className="text-xs text-gray-500 mt-1">Separate multiple colors with commas</p>
                        </div>
                    </div>
                </div>

                {/* Feature on Homepage Checkbox */}
                <div className="border-t border-gray-100 pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-900">Feature on Homepage</span>
                            <p className="text-xs text-gray-500">Display this car in the "Latest Arrivals" section (max 3 cars)</p>
                        </div>
                    </label>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <Link href="/admin" className="px-6 py-3 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting && <Loader2 size={18} className="animate-spin" />}
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
