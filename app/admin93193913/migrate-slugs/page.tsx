"use client";

import { useState } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowLeft, Play, Check, AlertCircle } from "lucide-react";

interface MigrationResult {
    brand: string;
    model: string;
    slug: string;
    status: 'success' | 'skipped' | 'error';
    message?: string;
}

function createSlug(brand: string, model: string): string {
    const combined = `${brand} ${model}`;
    return combined
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

async function isSlugTaken(slug: string, excludeDocId?: string): Promise<boolean> {
    const carsRef = collection(db, 'cars');
    const q = query(carsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return false;
    if (snapshot.size === 1 && snapshot.docs[0].id === excludeDocId) return false;
    return true;
}

async function generateUniqueSlug(brand: string, model: string, excludeDocId?: string): Promise<string> {
    const baseSlug = createSlug(brand, model);

    if (!(await isSlugTaken(baseSlug, excludeDocId))) {
        return baseSlug;
    }

    let suffix = 2;
    while (suffix < 100) {
        const candidateSlug = `${baseSlug}-${suffix}`;
        if (!(await isSlugTaken(candidateSlug, excludeDocId))) {
            return candidateSlug;
        }
        suffix++;
    }
    return `${baseSlug}-${Date.now()}`;
}

export default function MigrateSlugsPage() {
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState<MigrationResult[]>([]);
    const [complete, setComplete] = useState(false);

    const runMigration = async () => {
        setRunning(true);
        setResults([]);
        setComplete(false);

        try {
            const carsRef = collection(db, 'cars');
            const snapshot = await getDocs(carsRef);

            for (const carDoc of snapshot.docs) {
                const data = carDoc.data();

                if (data.slug) {
                    setResults(prev => [...prev, {
                        brand: data.brand,
                        model: data.model,
                        slug: data.slug,
                        status: 'skipped',
                        message: 'Already has slug'
                    }]);
                    continue;
                }

                try {
                    const slug = await generateUniqueSlug(data.brand, data.model, carDoc.id);
                    await updateDoc(doc(db, 'cars', carDoc.id), { slug });

                    setResults(prev => [...prev, {
                        brand: data.brand,
                        model: data.model,
                        slug,
                        status: 'success'
                    }]);
                } catch (error) {
                    setResults(prev => [...prev, {
                        brand: data.brand,
                        model: data.model,
                        slug: '',
                        status: 'error',
                        message: error instanceof Error ? error.message : 'Unknown error'
                    }]);
                }
            }
        } catch (error) {
            console.error('Migration error:', error);
        } finally {
            setRunning(false);
            setComplete(true);
        }
    };

    const successCount = results.filter(r => r.status === 'success').length;
    const skippedCount = results.filter(r => r.status === 'skipped').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                href="/admin93193913"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8"
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Migrate Car Slugs</h1>
            <p className="text-gray-500 mb-8">
                Add SEO-friendly URL slugs to existing cars that don&apos;t have them yet.
            </p>

            {!complete && (
                <button
                    onClick={runMigration}
                    disabled={running}
                    className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {running ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            Running Migration...
                        </>
                    ) : (
                        <>
                            <Play size={18} />
                            Run Migration
                        </>
                    )}
                </button>
            )}

            {results.length > 0 && (
                <div className="mt-8">
                    <div className="flex gap-6 mb-6">
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                            <span className="font-bold">{successCount}</span> Updated
                        </div>
                        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                            <span className="font-bold">{skippedCount}</span> Skipped
                        </div>
                        {errorCount > 0 && (
                            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                                <span className="font-bold">{errorCount}</span> Errors
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {results.map((result, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {result.brand} {result.model}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                                            {result.slug || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {result.status === 'success' && (
                                                <span className="inline-flex items-center gap-1 text-green-600">
                                                    <Check size={16} /> Updated
                                                </span>
                                            )}
                                            {result.status === 'skipped' && (
                                                <span className="text-gray-500">{result.message}</span>
                                            )}
                                            {result.status === 'error' && (
                                                <span className="inline-flex items-center gap-1 text-red-600">
                                                    <AlertCircle size={16} /> {result.message}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {complete && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                    Migration complete! You can now deploy the changes.
                </div>
            )}
        </div>
    );
}
