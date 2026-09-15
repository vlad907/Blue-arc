import "./globals.css";
import { assetPath } from "@/lib/asset-path";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = "https://bluearcnetworks.tech";
const iconSrc = assetPath("/logos/Blue-arc.png");

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Blue Arc Networks | IT Support, Networking & Surveillance in Chico, CA",
    template: "%s | Blue Arc Networks",
  },
  description:
    "Local IT support, business Wi-Fi, structured cabling, and surveillance camera installation in Chico, CA. Same-day onsite service for Northern California businesses. Call (530) 208-9290.",
  keywords: [
    "IT support Chico CA",
    "Chico network installation",
    "structured cabling Chico",
    "surveillance camera installation Chico",
    "business Wi-Fi Chico",
    "Cat6 cabling Northern California",
    "managed IT services Chico",
    "low-voltage installation Chico",
    "onsite IT support Chico",
    "Blue Arc Networks",
  ],
  authors: [{ name: "Blue Arc Networks" }],
  creator: "Blue Arc Networks",
  publisher: "Blue Arc Networks",
  alternates: {
    canonical: "/",
  },
  category: "Information Technology Services",
  openGraph: {
    title: "Blue Arc Networks – IT, Networking & Surveillance for Chico Businesses",
    description:
      "Onsite IT support, business Wi-Fi, structured cabling, and surveillance camera installation for businesses across Chico and Northern California.",
    url: SITE_URL,
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
  twitter: {
    card: "summary_large_image",
    title: "Blue Arc Networks – IT, Networking & Surveillance | Chico, CA",
    description:
      "Onsite IT, Wi-Fi, structured cabling, and surveillance for businesses in Chico and Northern California.",
    images: [iconSrc],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: iconSrc,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}#business`,
  name: "Blue Arc Networks",
  image: `${SITE_URL}${iconSrc}`,
  url: SITE_URL,
  telephone: "+1-530-208-9290",
  email: "info@bluearcnetworks.com",
  priceRange: "$$",
  description:
    "Onsite IT support, network installation, structured cabling, and surveillance camera systems for businesses in Chico and Northern California.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chico",
    addressRegion: "CA",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 39.7285,
    longitude: -121.8375,
  },
  areaServed: [
    { "@type": "City", name: "Chico" },
    { "@type": "City", name: "Paradise" },
    { "@type": "City", name: "Oroville" },
    { "@type": "City", name: "Durham" },
    { "@type": "City", name: "Magalia" },
    { "@type": "AdministrativeArea", name: "Butte County" },
    { "@type": "AdministrativeArea", name: "Northern California" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  sameAs: [] as string[],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "IT & Network Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Managed IT & Computer Support",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Network Design & Business Wi-Fi",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Server & Infrastructure Support",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Surveillance Camera Installation",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Structured Cabling (Cat6 & Fiber)",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Commercial Audio / Video Installation",
        },
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-neutral-950 text-neutral-100 antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
