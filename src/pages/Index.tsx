import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeSection from "@/components/MarqueeSection";
import AboutSection from "@/components/AboutSection";
import ScrollyRedesignSection from "@/components/ScrollyRedesignSection";
import ScrollyDisgenetSection from "@/components/ScrollyDisgenetSection";
import ScrollyMaiaSection from "@/components/ScrollyMaiaSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="noise">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <div id="use-cases" className="scroll-mt-20">
        <ScrollyRedesignSection />
        <ScrollyDisgenetSection />
        <ScrollyMaiaSection />
      </div>
      <SkillsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
