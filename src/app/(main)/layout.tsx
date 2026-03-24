import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Services from "@/components/services";
import ProjectHighlights from "@/components/ProjectHighlights";
import WhyChoose from "@/components/WhyChoose";
import Trustedby from "@/components/trustedby";
import Contact from "@/components/Contact";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { getProjects } from "@/lib/projects";
import { getTrusted } from "@/lib/trusted";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const [projects, trusted] = await Promise.all([getProjects(), getTrusted()]);

  return (
    <>
      <NavBar />
      <Hero />
      <Services />
      <ProjectHighlights items={projects} />
      <About />
      <WhyChoose />
      <Trustedby logos={trusted} />
      <Contact />
      <Footer />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
