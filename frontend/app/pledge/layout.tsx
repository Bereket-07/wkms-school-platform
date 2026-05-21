import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate Now",
  description: "Pledge your support to Wakero Keleboro Memorial Primary and middle school. Join us in providing quality education to rural Ethiopia.",
  openGraph: {
    title: "Donate Now | Wakero Keleboro Foundation",
    description: "Pledge your support to Wakero Keleboro Memorial Primary and middle school. Join us in providing quality education to rural Ethiopia.",
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
            "name": "Pledge to Wakero Keleboro Foundation",
            "description": "Make a pledge to support the Wakero Keleboro Memorial Primary and middle school.",
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
