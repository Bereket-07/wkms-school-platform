import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Make a direct impact. Donate to Wakero Kelboro Memorial Primary and Middle School and help us provide quality education in rural Ethiopia.",
  openGraph: {
    title: "Donate | Wakero Kelboro Foundation",
    description: "Make a direct impact. Donate to Wakero Kelboro Memorial Primary and Middle School and help us provide quality education in rural Ethiopia.",
    url: "https://wakerokelborofoundation.org/donate",
  }
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DonateAction",
            "name": "Donate to Wakero Kelboro Foundation",
            "description": "Donate to support the Wakero Kelboro Memorial Primary and Middle School.",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://wakerokelborofoundation.org/donate",
              "inLanguage": "en-US",
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}
