import "./globals.css";
import { assetPath } from "@/lib/asset-path";
import type { Metadata } from "next";

const iconSrc = assetPath("/logos/Blue-arc.png");

export const metadata: Metadata = {
  title: "Blue Arc Networks – IT Support, Networking & Surveillance | Chico, CA",
  description: "Professional IT support, network installation, structured cabling, and surveillance systems for businesses in Chico and Northern California.",
  keywords: [
    "Chico IT support",
    "Chico network installation",
    "structured cabling Chico",
    "surveillance camera installation Chico",
    "business Wi-Fi setup Northern California",
    "Blue Arc Networks",
    "low-voltage installation",
    "onsite IT support",
  ],
  authors: [{ name: "Blue Arc Networks" }],
  openGraph: {
    title: "Blue Arc Networks – IT, Networking & Surveillance for Chico Businesses",
    description: "Professional IT support, networking, cabling, and surveillance for businesses across Chico and Northern California.",
    url: "https://bluearcnetworks.tech",
    siteName: "Blue Arc Networks",
    images: [
      {
        url: iconSrc,
        width: 1200,
        height: 630,
        alt: "Blue Arc Networks – IT support and networking in Chico, CA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: iconSrc,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100">{children}</body>
    </html>
  );
}
