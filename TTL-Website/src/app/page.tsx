import Header from "@/components/landing/Header";
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ValuesVision from "@/components/landing/ValuesVision";
import StatsSection from "@/components/landing/StatsSection";
import TargetSection from "@/components/landing/TargetSection";
import ApproachSection from "@/components/landing/ApproachSection";
import GallerySection from "@/components/landing/GallerySection";
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
        <ValuesVision />
        <FeaturesSection />
        <StatsSection />
        <TargetSection />
        <ApproachSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
      
    </PageWrapper>
  );
}
