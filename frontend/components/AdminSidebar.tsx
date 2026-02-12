"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Megaphone,
    Image as ImageIcon,
    LogOut,
    Settings,
    Heart,
    Edit3,
    X,
    Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    onCloseMobile?: () => void;
}

export default function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
        { name: "Site Content", href: "/admin/cms", icon: Edit3 },
        { name: "Media Gallery", href: "/admin/gallery", icon: ImageIcon },
        { name: "Messages", href: "/admin/messages", icon: Mail },
        { name: "Donations", href: "/admin/donations", icon: Heart }, // Future placeholder
        // { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col h-full">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <div>
                    <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                        WKMS <span className="text-emerald-500">Admin</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Management Console</p>
                </div>
                {/* Close Button (Mobile Only) */}
                <button
                    onClick={onCloseMobile}
                    className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    // Strict match for exact paths, or partial match for sub-routes (but ensuring path segment separator)
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onCloseMobile}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 font-medium"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => {
                        // Simple logout handling for now
                        localStorage.removeItem('token');
                        window.location.href = '/admin/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
