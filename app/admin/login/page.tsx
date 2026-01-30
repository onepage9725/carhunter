"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (err: any) {
            console.error("Login failed:", err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("Incorrect email or password. have you created a user in the Firebase Console?");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError("Login failed. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-white">
            {/* Left: Branding & Visual */}
            <div className="hidden md:flex flex-col justify-between bg-black text-white p-12 relative overflow-hidden">
                <div className="z-10">
                    <div className="relative h-8 w-32 mb-8">
                        <Image
                            src="/assets/logo.png"
                            alt="CarHunter Logo"
                            fill
                            className="object-contain object-left invert"
                            priority
                        />
                    </div>
                    <h1 className="text-4xl font-bold leading-tight max-w-sm">
                        Manage your premium inventory with precision.
                    </h1>
                </div>

                {/* Abstract Visual / Gradient */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-900 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="z-10 text-sm text-zinc-500">
                    © 2025 byride Internal System
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 bg-white">
                <div className="w-full max-w-sm space-y-8">

                    {/* Mobile Logo */}
                    <div className="md:hidden relative h-8 w-32 mx-auto mb-8">
                        <Image
                            src="/assets/logo.png"
                            alt="CarHunter Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                        <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-all outline-none bg-gray-50/50 focus:bg-white"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black transition-all outline-none bg-gray-50/50 focus:bg-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center text-xs text-gray-400 mt-8">
                        Protected by Firebase Authentication
                    </div>
                </div>
            </div>
        </div>
    );
}
