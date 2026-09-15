import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Services from "@/components/services";
import InstagramWork from "@/components/InstagramWork";
import WhyChoose from "@/components/WhyChoose";
import Trustedby from "@/components/trustedby";
import Contact from "@/components/Contact";
import About from "@/components/About";
import Footer from "@/components/Footer";
import MobileCallCTA from "@/components/MobileCallCTA";
import MarqueeBand from "@/components/MarqueeBand";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import Cursor from "@/components/motion/Cursor";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import { getTrusted } from "@/lib/trusted";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const trusted = await getTrusted();

  return (
    <SmoothScrollProvider>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <NavBar />
      <Hero />
      <MarqueeBand />
      <Services />
      <InstagramWork />
      <About />
      <WhyChoose />
      <Trustedby logos={trusted} />
      <Contact />
      <Footer />
      <MobileCallCTA />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </SmoothScrollProvider>
  );
}
