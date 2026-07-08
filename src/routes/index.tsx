import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { WhySection } from "@/components/landing/WhySection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-background text-foreground">
        <CustomCursor />
        <Navbar />
        <main>
          <h1 className="sr-only">Novara — Institutional Digital Asset Management</h1>
          <Hero />
          <TrustStrip />
          <WhySection />
          <PlatformSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
