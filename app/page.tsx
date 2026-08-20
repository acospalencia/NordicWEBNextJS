import { AppNavbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { BusinessLines } from "@/components/business-lines";
import { FeaturedProjects } from "@/components/featured-projects";
import { AlliancesSection } from "@/components/alliances-section";
import { CtaSection } from "@/components/cta-section";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <AppNavbar />
      <Hero />
      <About />
      <BusinessLines />
      <FeaturedProjects />
      <AlliancesSection />
      <CtaSection />
      <Contact />
      <Footer />
    </>
  );
}
