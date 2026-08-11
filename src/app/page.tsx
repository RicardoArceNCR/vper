import Header from "@/sections/header";
import Hero from "@/sections/hero";
import LogoTicker from "@/sections/logo-ticker";
import WorkGallery from "@/sections/work-gallery";
import ServicesGrid from "@/sections/services-grid";
import ProcessSection from "@/sections/process-section";
import AboutUs from "@/sections/about-us";
import ContactSection from "@/sections/contact-section";
import Footer from "@/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col overflow-x-clip">
      <Header />
      <Hero />
      <LogoTicker />
      <WorkGallery />
      <ServicesGrid />
      <ProcessSection />
      <AboutUs />
      <ContactSection />
      <Footer />
    </div>
  );
}
