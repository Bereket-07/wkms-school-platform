import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = localFont({
  src: [
    { path: "../font/Montserrat-Thin.otf", weight: "100", style: "normal" },
    { path: "../font/Montserrat-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../font/Montserrat-Light.otf", weight: "300", style: "normal" },
    { path: "../font/Montserrat-Regular.otf", weight: "400", style: "normal" },
    { path: "../font/Montserrat-Medium.otf", weight: "500", style: "normal" },
    { path: "../font/Montserrat-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../font/Montserrat-Bold.otf", weight: "700", style: "normal" },
    { path: "../font/Montserrat-ExtraBold.otf", weight: "800", style: "normal" },
    { path: "../font/Montserrat-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-montserrat",
});

const montserratAlt = localFont({
  src: [
    { path: "../font/MontserratAlternates-Thin.otf", weight: "100", style: "normal" },
    { path: "../font/MontserratAlternates-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../font/MontserratAlternates-Light.otf", weight: "300", style: "normal" },
    { path: "../font/MontserratAlternates-Regular.otf", weight: "400", style: "normal" },
    { path: "../font/MontserratAlternates-Medium.otf", weight: "500", style: "normal" },
    { path: "../font/MontserratAlternates-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../font/MontserratAlternates-Bold.otf", weight: "700", style: "normal" },
    { path: "../font/MontserratAlternates-ExtraBold.otf", weight: "800", style: "normal" },
    { path: "../font/MontserratAlternates-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-montserrat-alt",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wakerokelborofoundation.org"),
  title: {
    default: "WKMS - Wakero Keleboro Memorial Primary and Middle School",
    template: "%s | Wakero Keleboro Foundation",
  },
  description: "Connecting Education, Opportunity & Impact in rural Ethiopia. Join us in building a future for the children of Wakero Keleboro.",
  keywords: ["Education in Ethiopia", "Wakero Keleboro Memorial Primary and Middle School", "Rural School Ethiopia", "Charity for Education", "NGO Ethiopia", "Support Ethiopian Students", "Build Schools in Africa"],
  authors: [{ name: "Wakero Keleboro Foundation" }],
  creator: "Wakero Keleboro Foundation",
  publisher: "Wakero Keleboro Foundation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "WKMS - Wakero Keleboro Memorial Primary and Middle School",
    description: "Connecting Education, Opportunity & Impact in rural Ethiopia. Join us in building a future for the children of Wakero Keleboro.",
    url: "https://wakerokelborofoundation.org",
    siteName: "Wakero Keleboro Foundation",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Wakero Keleboro Memorial Primary and Middle School Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WKMS - Wakero Keleboro Memorial Primary and Middle School",
    description: "Connecting Education, Opportunity & Impact in rural Ethiopia.",
    creator: "@wkmspre_school", // Replace with actual handle if applicable
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://wakerokelborofoundation.org/#website",
                  "url": "https://wakerokelborofoundation.org/",
                  "name": "Wakero Keleboro Foundation",
                  "description": "Connecting Education, Opportunity & Impact in rural Ethiopia.",
                  "publisher": {
                    "@id": "https://wakerokelborofoundation.org/#organization"
                  }
                },
                {
                  "@type": ["NGO", "Organization"],
                  "@id": "https://wakerokelborofoundation.org/#organization",
                  "name": "Wakero Keleboro Foundation",
                  "url": "https://wakerokelborofoundation.org/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://wakerokelborofoundation.org/icon.png"
                  },
                  "image": "https://wakerokelborofoundation.org/opengraph-image.png",
                  "description": "Connecting Education, Opportunity & Impact in rural Ethiopia. Join us in building a future for the children of Wakero Keleboro.",
                  "areaServed": {
                    "@type": "Country",
                    "name": "Ethiopia"
                  },
                  "knowsAbout": ["Education", "Primary School", "Middle School", "Rural Development", "Charity"]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${montserratAlt.variable} font-sans bg-gray-50 text-emerald-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
