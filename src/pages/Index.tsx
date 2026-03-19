import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/HeroSection";
import CeqaExplainer from "@/components/CeqaExplainer";
import WhyItMatters from "@/components/WhyItMatters";
import ItsAlreadyHappening from "@/components/ItsAlreadyHappening";
import AdvancedManufacturing from "@/components/AdvancedManufacturing";
import CtaBanner from "@/components/CtaBanner";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader />
    <main className="flex-1">
      <HeroSection />
      <CeqaExplainer />
      <WhyItMatters />
      <ItsAlreadyHappening />
      <AdvancedManufacturing />
      <CtaBanner />
    </main>
    <SiteFooter />
  </div>
);

export default Index;
