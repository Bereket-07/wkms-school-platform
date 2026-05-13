import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Make a Pledge",
  description: "Pledge your support to Wakero Keleboro Memorial Pre-School. Join us in providing quality education to rural Ethiopia.",
  openGraph: {
    title: "Make a Pledge | WKMS Foundation",
    description: "Pledge your support to Wakero Keleboro Memorial Pre-School. Join us in providing quality education to rural Ethiopia.",
  }
};

export default function PledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
