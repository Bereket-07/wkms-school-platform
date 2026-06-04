import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate Now",
  description: "Pledge your support to Wakero Kelboro Memorial Primary and Middle School. Join us in providing quality education to rural Ethiopia.",
  openGraph: {
    title: "Donate Now | Wakero Kelboro Foundation",
    description: "Pledge your support to Wakero Kelboro Memorial Primary and Middle School. Join us in providing quality education to rural Ethiopia.",
    url: "https://wakerokelborofoundation.org/pledge",
  }
};

export default function PledgeLayout({
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
            "name": "Pledge to Wakero Kelboro Foundation",
            "description": "Make a pledge to support the Wakero Kelboro Memorial Primary and Middle School.",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://wakerokelborofoundation.org/pledge",
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
