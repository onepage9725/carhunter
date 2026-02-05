"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, Database, Settings, Link2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== "/admin93193913/login") {
            router.push("/admin93193913/login");
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!user && pathname !== "/admin93193913/login") {
        return null; // Will redirect via useEffect
    }

    // If on login page, just render children (the login form)
    if (pathname === "/admin93193913/login") {
        return <>{children}</>;
    }

    // Dashboard Layout
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col">
                <div className="p-8 border-b border-gray-100">
                    <div className="relative h-8 w-32">
                        <Image
                            src="/assets/logo.png"
                            alt="byride Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                    <span className="text-xs text-gray-400 block mt-2 tracking-widest uppercase ml-1">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin93193913"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin93193913' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                        href="/admin93193913/migrate-slugs"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin93193913/migrate-slugs' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Link2 size={20} />
                        <span className="font-medium">Migrate Slugs</span>
                    </Link>
                    {/* Placeholder links for future */}
                    <div className="px-4 py-3 text-gray-400 flex items-center gap-3 cursor-not-allowed opacity-50">
                        <Database size={20} />
                        <span className="font-medium">Inventory</span>
                    </div>
                    <div className="px-4 py-3 text-gray-400 flex items-center gap-3 cursor-not-allowed opacity-50">
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={async () => {
                            await logout();
                            router.push('/');
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                    <div className="mt-4 px-4 text-xs text-gray-400">
                        Logged in as <br />
                        <span className="font-medium text-gray-900 truncate block">{user?.email}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
