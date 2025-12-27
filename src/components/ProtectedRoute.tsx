import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from "../services/firebase";
import { Loader2 } from 'lucide-react';

const AUTHORIZED_EMAIL = 'michauxamauryp@gmail.com';

export const ProtectedRoute = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <Loader2 className="animate-spin text-fuji-red" size={32} />
            </div>
        );
    }

    if (!user || user.email !== AUTHORIZED_EMAIL) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
