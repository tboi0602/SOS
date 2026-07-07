"use client";
import Header from "@/components/landing/Header";
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import HeroSection from "@/components/landing/HeroSection";
import MissionSection from "@/components/landing/MissionSection";
import EcosystemSection from "@/components/landing/EcosystemSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import PageWrapper from "@/components/landing/PageWrapper";
import MouseGlow from "@/components/landing/MouseGlow";
import FeaturesSection from "@/components/landing/FeaturesSection";
import GallerySection from "@/components/landing/GallerySection";
import ValuesVision from "@/components/landing/ValuesVision";
import IntroAnimation from "@/components/landing/IntroAnimation";

export default function Home() {
  return (
    <IntroAnimation>
      <PageWrapper>
        <BackgroundEffects />
        <MouseGlow />
        <Header />
        <main>
          <HeroSection />
          <EcosystemSection />
          <ValuesVision />
          <FeaturesSection />
          <MissionSection />
          <GallerySection />
          <ContactSection />
        </main>
        <Footer />
      </PageWrapper>
    </IntroAnimation>
  );
}
