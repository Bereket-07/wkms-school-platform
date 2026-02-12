"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter(); // Import needed
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
            setIsLoading(false);
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
                <AdminSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
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
                        <h2 className="text-sm font-bold text-slate-900 lg:hidden">
                            WKMS Admin
                        </h2>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs ring-2 ring-white ring-offset-2 ring-offset-slate-50">
                            A
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
