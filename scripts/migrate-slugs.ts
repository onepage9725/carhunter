/**
 * Migration script to add slugs to existing cars
 * Run this once after deploying the slug changes
 * 
 * Usage: npx ts-node --esm scripts/migrate-slugs.ts
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDsU00p8_jwWr-ljDuLs_0Qq8l2rDhmNxg",
    authDomain: "carhunter-52d21.firebaseapp.com",
    projectId: "carhunter-52d21",
    storageBucket: "carhunter-52d21.firebasestorage.app",
    messagingSenderId: "1066282934568",
    appId: "1:1066282934568:web:ce7138f95201b2399cb01d",
    measurementId: "G-75Q1HYFS67"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

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
    while (true) {
        const candidateSlug = `${baseSlug}-${suffix}`;
        if (!(await isSlugTaken(candidateSlug, excludeDocId))) {
            return candidateSlug;
        }
        suffix++;
    }
}

async function migrateSlugs() {
    console.log("Starting slug migration...");

    const carsRef = collection(db, 'cars');
    const snapshot = await getDocs(carsRef);

    console.log(`Found ${snapshot.size} cars to process`);

    let updated = 0;
    let skipped = 0;

    for (const carDoc of snapshot.docs) {
        const data = carDoc.data();

        // Skip if already has a slug
        if (data.slug) {
            console.log(`Skipping ${data.brand} ${data.model} - already has slug: ${data.slug}`);
            skipped++;
            continue;
        }

        const slug = await generateUniqueSlug(data.brand, data.model, carDoc.id);

        await updateDoc(doc(db, 'cars', carDoc.id), { slug });
        console.log(`Updated ${data.brand} ${data.model} with slug: ${slug}`);
        updated++;
    }

    console.log(`\nMigration complete!`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
}

migrateSlugs().catch(console.error);
