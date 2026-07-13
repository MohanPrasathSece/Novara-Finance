import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { Navbar } from "@/components/landing/Navbar";
import { AuthModal } from "@/components/landing/AuthModal";
import { FomoNotification } from "@/components/landing/FomoNotification";
import { Hero } from "@/components/landing/Hero";
import { WhySection } from "@/components/landing/WhySection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-background text-foreground pt-10">
        <CustomCursor />
        <Navbar />
        <AuthModal />
        <FomoNotification />
        <main>
          <h1 className="sr-only">Novara — Institutional Digital Asset Management</h1>
          <Hero />
          <WhySection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
