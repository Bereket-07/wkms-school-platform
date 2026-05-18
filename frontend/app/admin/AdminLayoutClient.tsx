"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter(); // Import needed
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSuperUser, setIsSuperUser] = useState(false);
    const [userInitial, setUserInitial] = useState("A");
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (isLoginPage) {
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
        } else {
            // Fetch user profile
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.is_superuser !== undefined) {
                    setIsSuperUser(data.is_superuser);
                    if (data.full_name) {
                        setUserInitial(data.full_name.charAt(0).toUpperCase());
                    } else if (data.email) {
                        setUserInitial(data.email.charAt(0).toUpperCase());
                    }
                }
            })
            .catch(err => console.error("Failed to fetch user profile", err))
            .finally(() => setIsLoading(false));
        }
    }, [pathname, isLoginPage, router]);

    if (isLoading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Container
                - Mobile: Fixed, slide-in, z-50
                - Desktop: Static (part of flex flow), always visible
            */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <AdminSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} isSuperUser={isSuperUser} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full min-w-0 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                            aria-label="Open Sidebar"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                            {pathname.split('/').pop()?.replace(/-/g, ' ')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 lg:hidden">
                            <div className="relative w-6 h-6">
                                <img src="/wkmslogo.svg" alt="WKMS Logo" className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Admin
                            </h2>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-dark font-bold text-xs ring-2 ring-white ring-offset-2 ring-offset-slate-50 uppercase">
                            {userInitial}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
