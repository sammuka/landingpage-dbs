import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { JourneyTimeline } from "@/components/sections/JourneyTimeline";
import { ArchitectureMaps } from "@/components/sections/ArchitectureMaps";
import { EndpointStrategy } from "@/components/sections/EndpointStrategy";
import { UIComparison } from "@/components/sections/UIComparison";
import { StackComparison } from "@/components/sections/StackComparison";
import { SecurityVulnerabilities } from "@/components/sections/SecurityVulnerabilities";
import { IntegrationModel } from "@/components/sections/IntegrationModel";
import { MetricsAnimated } from "@/components/sections/MetricsAnimated";
import { DevOpsPipeline } from "@/components/sections/DevOpsPipeline";
import { ADRCards } from "@/components/sections/ADRCards";
import { Footer } from "@/components/sections/Footer";
import { ParticlesBackground } from "@/components/ui/ParticlesBackground";
import { Orbs } from "@/components/ui/Orbs";
import { GrainOverlay } from "@/components/ui/GrainOverlay";

export default function Home() {
  return (
    <>
      <ParticlesBackground />
      <Orbs />
      <GrainOverlay />
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <div className="section-divider" />
        <JourneyTimeline />
        <div className="section-divider" />
        <ArchitectureMaps />
        <div className="section-divider" />
        <EndpointStrategy />
        <div className="section-divider" />
        <UIComparison />
        <div className="section-divider" />
        <StackComparison />
        <div className="section-divider" />
        <SecurityVulnerabilities />
        <div className="section-divider" />
        <IntegrationModel />
        <div className="section-divider" />
        <MetricsAnimated />
        <div className="section-divider" />
        <DevOpsPipeline />
        <div className="section-divider" />
        <ADRCards />
      </main>
      <Footer />
    </>
  );
}
