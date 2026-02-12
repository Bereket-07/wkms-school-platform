"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Don't render Navbar on admin pages
    if (pathname?.startsWith('/admin')) return null;

    const navLinks = [
        { name: "About", href: "/#about" },
        { name: "Community", href: "/#community" },
        { name: "Our Impact", href: "/#impact" },
        { name: "Gallery", href: "/#media" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen
                ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        W
                    </div>
                    <div className={`flex flex-col transition-colors ${scrolled || isOpen ? 'text-slate-900' : 'text-slate-900'}`}>
                        <span className="font-black text-xl leading-none tracking-wide text-emerald-600 font-lato">
                            WKMS
                        </span>
                        <span className="font-medium text-[0.65rem] md:text-xs text-slate-600 leading-tight tracking-wide uppercase">
                            Wakero Keleboro Memorial School
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`font-medium text-sm hover:text-emerald-500 transition-colors ${scrolled ? "text-slate-600" : "text-slate-800 hover:text-emerald-600"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link
                        href="/donate"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        Donate Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-slate-600 focus:outline-none z-50 relative"
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-slate-900" />
                    ) : (
                        <Menu className={`w-6 h-6 ${scrolled ? 'text-slate-900' : 'text-slate-900'}`} />
                    )}
                </button>

                {/* Mobile Menu Overlay */}
                <div
                    className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={handleLinkClick}
                            className="text-2xl font-medium text-slate-800 hover:text-emerald-600 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/donate"
                        onClick={handleLinkClick}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                        Donate Now <Heart className="w-5 h-5 fill-current" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
