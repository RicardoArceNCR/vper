import Header from "@/sections/header";
import Hero from "@/sections/hero";
import LogoTicker from "@/sections/logo-ticker";
import WorkGallery from "@/sections/work-gallery";
import ServicesGrid from "@/sections/services-grid";
import ProcessSection from "@/sections/process-section";
import AboutUs from "@/sections/about-us";
import ContactSection from "@/sections/contact-section";
import GlowMark from "@/sections/glow-mark";
import Footer from "@/sections/footer";

export default function Home() {
  return (
    <>
      {/* El CSS bloquea el parser; sin esto el retrato LCP se descubre
          tarde. `media` replica el <picture> del hero (md = 768). */}
      <link
        rel="preload"
        as="image"
        href="/images/hero-face-mobile.webp"
        type="image/webp"
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/hero-face-desktop.webp"
        type="image/webp"
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col overflow-x-clip">
        <Header />
        <Hero />
        <LogoTicker />
        <WorkGallery />
        <ServicesGrid />
        <ProcessSection />
        <AboutUs />
        <ContactSection />
        <GlowMark />
        <Footer />
      </div>
    </>
  );
}
