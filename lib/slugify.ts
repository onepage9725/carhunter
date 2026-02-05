import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Generate a URL-safe slug from brand and model
 */
export function createSlug(brand: string, model: string): string {
    const combined = `${brand} ${model}`;
    return combined
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single
}

/**
 * Generate a unique slug by checking Firestore for existing slugs
 * Appends a number suffix if duplicate exists
 */
export async function generateUniqueSlug(brand: string, model: string, excludeDocId?: string): Promise<string> {
    const baseSlug = createSlug(brand, model);

    // Check if base slug exists
    const carsRef = collection(db, 'cars');
    const q = query(carsRef, where('slug', '==', baseSlug));
    const snapshot = await getDocs(q);

    // If no match, or only match is the current doc being edited, use base slug
    if (snapshot.empty || (snapshot.size === 1 && snapshot.docs[0].id === excludeDocId)) {
        return baseSlug;
    }

    // Find next available suffix
    let suffix = 2;
    while (true) {
        const candidateSlug = `${baseSlug}-${suffix}`;
        const qCandidate = query(carsRef, where('slug', '==', candidateSlug));
        const candidateSnapshot = await getDocs(qCandidate);

        if (candidateSnapshot.empty || (candidateSnapshot.size === 1 && candidateSnapshot.docs[0].id === excludeDocId)) {
            return candidateSlug;
        }
        suffix++;
    }
}
