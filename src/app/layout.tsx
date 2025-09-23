import "./globals.css";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Services from "@/components/services";
import Trustedby from "@/components/trustedby";
import Contact from "@/components/Contact";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Jobs from "@/components/gallery";
import { assetPath } from "@/lib/asset-path";
import type { Metadata } from "next";

const iconSrc = assetPath("/logos/Blue-arc.png");

export const metadata: Metadata = {
  title: "Blue Arc Networks – Reliable IT Help",
  description: "Professional IT support, networking, and computer repair services serving Chico and Northern California.",
  keywords: [
    "IT support",
    "computer repair",
    "networking",
    "server setup",
    "Wi-Fi troubleshooting",
    "Blue Arc Networks",
    "Chico California IT"
  ],
  authors: [{ name: "Blue Arc Networks" }],
  openGraph: {
    title: "Blue Arc Networks – Reliable IT Help",
    description: "Serving Chico and Northern California with IT support, networking, and repair.",
    url: "https://bluearcnetworks.tech",
    siteName: "Blue Arc Networks",
    images: [
      {
        url: iconSrc,
        width: 1200,
        height: 630,
        alt: "Blue Arc Networks Logo",
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
      <body className="bg-neutral-950 text-neutral-100">
        <NavBar />
        <Hero />
        <Services />
        <About />
        <Trustedby />
        <Contact />
        <Pricing />
        <Jobs/>
        <Footer />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
