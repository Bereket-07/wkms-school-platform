"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            // Redirect to Dashboard
            router.push('/admin/dashboard');
        } else {
            // Failed login logic
            router.push('/admin/login?error=missing_token');
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                <h2 className="text-xl font-bold text-gray-700">Verifying Credentials...</h2>
                <p className="text-gray-500">Please wait while we log you in securely.</p>
            </div>
        </div>
    );
}
