import Header from "@/components/landing/Header";
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import HeroSection from "@/components/landing/HeroSection";
import MissionSection from "@/components/landing/MissionSection";
import EcosystemSection from "@/components/landing/EcosystemSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import PageWrapper from "@/components/landing/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <BackgroundEffects />
      <Header />
      <main>
        <HeroSection />
        <MissionSection />
        <EcosystemSection />
        <ContactSection />
      </main>
      <Footer />
    </PageWrapper>
  );
}
