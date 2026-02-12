"use client";

import { useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const handleLogin = () => {
        // Redirect to Backend Google Auth Endpoint
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        window.location.href = `${apiUrl}/auth/login`;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-emerald-900 p-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Lock className="w-8 h-8 text-gold-500" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold">Admin Portal</h1>
                    <p className="text-emerald-200/80 text-sm mt-2">Secure access for school staff only.</p>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg border border-red-200">
                            ⚠️ Access Denied. Your email is not whitelisted.
                        </div>
                    )}

                    <div className="text-center text-gray-600 text-sm">
                        Please sign in with your authorized Google Account to manage campaigns and gallery content.
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition shadow-sm hover:shadow-md"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        Sign in with Google
                    </button>

                    <div className="text-center text-xs text-gray-400 mt-6">
                        Protected by Modern Auth &copy; 2024
                    </div>
                </div>
            </div>
        </div>
    );
}
