"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { getSiteContent } from "@/lib/api";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoUrl, setLogoUrl] = useState("/wkmslogo.svg");
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Fetch global branding content
        const fetchContent = async () => {
            try {
                const data = await getSiteContent();
                const mainLogo = data.find(c => c.key === 'logo_main');
                if (mainLogo && mainLogo.content) {
                    setLogoUrl(mainLogo.content);
                }
            } catch (err) {
                console.error("Failed to load branding content", err);
            }
        };
        fetchContent();

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
        { name: "About Us", href: "/#about" },
        { name: "Community", href: "/#community" },
        { name: "Our Impact", href: "/#impact" },
        { name: "Gallery", href: "/#media" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isOpen
                    ? "bg-white py-4" // Solid white when open
                    : scrolled
                        ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
                        : "bg-transparent py-6"
                    }`}
            >
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
                        <div className="relative w-16 md:w-20 h-auto flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <img
                                src={logoUrl}
                                alt="WKMS Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`font-medium text-[16px] hover:text-brand-red transition-colors ${scrolled || isOpen ? "text-slate-700" : "text-white/90 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <Link
                            href="/pledge"
                            className="bg-brand-red hover:bg-[#d4151a] text-white px-6 py-2.5 rounded-md font-medium text-[17px] transition-all flex items-center gap-2 ml-4"
                        >
                            Donate Now <Heart className="w-4 h-4 fill-current text-white" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-slate-600 focus:outline-none z-[60] relative"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-slate-900" />
                        ) : (
                            <Menu className={`w-6 h-6 ${scrolled ? 'text-slate-900' : 'text-white/90'}`} />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay - Placed completely outside <nav> to prevent CSS filter containing block bugs */}
            <div
                className={`fixed top-0 left-0 w-full h-[100dvh] bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden transform-gpu ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={handleLinkClick}
                        className="text-2xl font-bold text-brand-dark hover:text-brand-red transition-colors"
                    >
                        {link.name}
                    </Link>
                ))}
                <Link
                    href="/pledge"
                    onClick={handleLinkClick}
                    className="bg-brand-red text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 mt-4"
                >
                    Donate Now <Heart className="w-5 h-5 fill-current" />
                </Link>
            </div>
        </>
    );
}
