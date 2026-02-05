"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        console.log("AuthProvider: Initializing...");

        // Safety timeout in case Firebase is slow/blocked
        const timer = setTimeout(() => {
            console.warn("AuthProvider: Timeout reached, forcing loading=false");
            setLoading((l) => {
                if (l) return false;
                return l;
            });
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("AuthProvider: Auth state changed", user ? "User found" : "No user");
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
            clearTimeout(timer);
        }, (error) => {
            console.error("AuthProvider Error:", error);
            setLoading(false);
            clearTimeout(timer);
        });

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const logout = async () => {
        await signOut(auth);
        router.push("/admin93193913/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
