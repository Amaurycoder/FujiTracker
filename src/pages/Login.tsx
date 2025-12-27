import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

const AUTHORIZED_EMAIL = 'michauxamauryp@gmail.com';

export const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user.email === AUTHORIZED_EMAIL) {
                navigate('/explore');
            } else {
                await auth.signOut();
                setError("Accès refusé. Seul l'administrateur peut se connecter.");
            }
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la connexion. Veuillez réessayer.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-zinc-800 text-center animate-fade-in">
                <div className="flex justify-center mb-6 text-fuji-red">
                    <Camera size={48} />
                </div>

                <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">FujiTracker</h1>
                <p className="text-gray-500 dark:text-zinc-400 mb-8">Admin Access Only</p>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-900/50">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all text-gray-700 dark:text-white font-medium shadow-sm hover:shadow-md active:scale-95"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
};
