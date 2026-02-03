"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Reorder } from "framer-motion";

export default function AddCarPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Multi-image state with drag-and-drop support
    const [uploadedImages, setUploadedImages] = useState<{ id: string, file: File, preview: string }[]>([]);

    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
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

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // No maximum limit check here anymore

        setLoading(true); // Temporarily show loading while converting

        try {
            const processedFiles = await Promise.all(files.map(async (file) => {
                const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");

                if (isHeic) {
                    try {
                        console.log("Converting HEIC file:", file.name);
                        // Dynamic import to ensure client-side execution
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
                        if (err && typeof err === 'object') {
                            try {
                                console.error("Stringified error:", JSON.stringify(err));
                            } catch (e) { /* ignore circular */ }
                        }
                        alert(`Failed to process HEIC image: ${file.name}. Error: ${err?.message || "Unknown error"}`);
                        return null;
                    }
                }
                return file;
            }));

            const validFiles = processedFiles.filter((f): f is File => f !== null);

            if (validFiles.length > 0) {
                const newImages = validFiles.map(file => ({
                    id: Math.random().toString(36).substr(2, 9), // Simple unique ID
                    file,
                    preview: URL.createObjectURL(file)
                }));
                setUploadedImages(prev => [...prev, ...newImages]);
            }
        } catch (error) {
            console.error("Error processing images:", error);
        } finally {
            setLoading(false);
            // Reset input value
            e.target.value = "";
        }
    };

    const removeImage = (idToRemove: string) => {
        setUploadedImages(prev => {
            const itemToRemove = prev.find(img => img.id === idToRemove);
            if (itemToRemove) {
                URL.revokeObjectURL(itemToRemove.preview);
            }
            return prev.filter(img => img.id !== idToRemove);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Starting car creation process...");

        try {
            const imageUrls: string[] = [];

            // Use the current order of uploadedImages
            const imagesToUpload = uploadedImages.map(img => img.file);
            console.log(`Processing ${imagesToUpload.length} images...`);

            // Upload all images
            for (const [index, file] of imagesToUpload.entries()) {
                try {
                    console.log(`Uploading image ${index + 1}/${imagesToUpload.length}: ${file.name} (${file.type}, ${file.size} bytes)`);

                    if (!file || file.size === 0) {
                        console.error(`Skipping invalid file: ${file.name}`);
                        continue;
                    }

                    const storageRef = ref(storage, `cars/${Date.now()}_${index}_${file.name}`);

                    console.log("Storage ref created:", storageRef.fullPath);
                    console.log("Attempting upload...");

                    const snapshot = await uploadBytes(storageRef, file, {
                        contentType: file.type || 'image/jpeg'
                    });

                    console.log("Upload complete, getting download URL...");
                    const url = await getDownloadURL(snapshot.ref);
                    imageUrls.push(url);
                    console.log(`Image ${index + 1} uploaded successfully: ${url}`);
                } catch (uploadError: any) {
                    console.error(`Failed to upload image ${file.name}`);
                    console.error("Full error:", uploadError);
                    console.error("Error code:", uploadError?.code);
                    console.error("Error message:", uploadError?.message);

                    let errorMessage = `Failed to upload image ${file.name}.`;

                    if (uploadError?.code === 'storage/unauthorized') {
                        errorMessage += " Firebase Storage permissions not configured. Please check Firebase Console > Storage > Rules.";
                    } else if (uploadError?.message) {
                        errorMessage += ` Error: ${uploadError.message}`;
                    }

                    alert(errorMessage);
                    setLoading(false);
                    return; // Stop the process if an image fails to upload
                }
            }

            // Fallback default image if none uploaded
            const mainImage = imageUrls.length > 0 ? imageUrls[0] : "https://images.unsplash.com/photo-1580273916550-e323be2ebdd9?q=80&w=2232";

            console.log("Images uploaded. Adding document to Firestore...");

            // Check featured car limit if this car is being featured
            let featuredAt = null;
            if (formData.featured) {
                const { query: fsQuery, where, getDocs, updateDoc, doc: fsDoc } = await import('firebase/firestore');
                const featuredQuery = fsQuery(collection(db, "cars"), where("featured", "==", true));
                const featuredSnapshot = await getDocs(featuredQuery);

                if (featuredSnapshot.size >= 3) {
                    const featuredCars = featuredSnapshot.docs.map(doc => ({
                        id: doc.id,
                        brand: doc.data().brand,
                        model: doc.data().model,
                        featuredAt: doc.data().featuredAt
                    }));

                    featuredCars.sort((a, b) => {
                        const aTime = a.featuredAt?.toMillis() || 0;
                        const bTime = b.featuredAt?.toMillis() || 0;
                        return aTime - bTime;
                    });

                    const oldestFeatured = featuredCars[0];

                    if (!confirm(`You already have 3 featured cars. Featuring "${formData.brand} ${formData.model}" will unfeature "${oldestFeatured.brand} ${oldestFeatured.model}". Continue?`)) {
                        setLoading(false);
                        return;
                    }

                    await updateDoc(fsDoc(db, "cars", oldestFeatured.id), {
                        featured: false,
                        featuredAt: null
                    });
                }

                featuredAt = new Date();
            }

            // Add a timeout for Firestore write as well
            const firestorePromise = addDoc(collection(db, "cars"), {
                ...formData,
                year: Number(formData.year),
                seats: Number(formData.seats),
                doors: Number(formData.doors),
                logo: `https://cdn.simpleicons.org/${formData.brand.toLowerCase().replace(/ /g, '')}/000000`,
                image: mainImage, // Keep main image field for backward compatibility
                images: imageUrls, // Store all images
                createdAt: new Date(),
                featuredAt: featuredAt,
                intColors: ["#000000"]
            });

            const firestoreTimeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Database write timed out")), 10000)
            );

            const docRef = await Promise.race([firestorePromise, firestoreTimeoutPromise]) as any;

            console.log("Document successfully written with ID: ", docRef.id);

            alert("Car added successfully!");
            router.push("/admin");
        } catch (error) {
            console.error("Critical Error adding car:", error);
            alert("Failed to add car. Check console for details.");
        } finally {
            setLoading(false);
            console.log("Process finished, loading state reset.");
        }
    };


    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-black">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-black">Add New Vehicle</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Images (Unlimited - Drag to reorder)
                    </label>

                    <Reorder.Group
                        axis="y"
                        values={uploadedImages}
                        onReorder={setUploadedImages}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
                    >
                        {uploadedImages.map((item, index) => (
                            <Reorder.Item
                                key={item.id}
                                value={item}
                                className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group cursor-move touch-none"
                                whileDrag={{ scale: 1.05, zIndex: 10 }}
                            >
                                <Image src={item.preview} alt={`Preview ${index}`} fill className="object-cover pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent drag start when clicking remove
                                        removeImage(item.id);
                                    }}
                                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-medium z-10">
                                        Main
                                    </div>
                                )}
                            </Reorder.Item>
                        ))}

                        {/* Upload Button Block */}
                        <div className="relative aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                            {loading && uploadedImages.length === 0 ? (
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
                    </Reorder.Group>
                    {uploadedImages.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">
                            {loading ? "Processing images..." : "No images selected. Upload at least one image."}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                            placeholder="e.g. BMW"
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
                            placeholder="e.g. M4 Competition"
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
                                placeholder="400,000 - 450,000"
                                value={formData.priceRange}
                                onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-bold mb-6 text-black">Technical Specs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500" placeholder="e.g. 15,000"
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
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500" placeholder="e.g. 503 hp"
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
                        disabled={loading}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Creating..." : "Create Listing"}
                    </button>
                </div>
            </form>
        </div>
    );
}
