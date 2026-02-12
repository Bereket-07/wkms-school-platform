import type { Metadata } from "next";
import { Merriweather, Outfit, Lato } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-outfit",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "WKMS - Wakero Keleboro Memorial Pre-School",
  description: "Connecting Education, Opportunity & Impact in rural Ethiopia.",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${merriweather.variable} ${lato.variable} font-sans bg-gray-50 text-emerald-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
