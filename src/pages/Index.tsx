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
      <div className="caution-stripe h-3" />
      <CeqaExplainer />
      <div className="caution-stripe h-3" />
      <WhyItMatters />
      <div className="caution-stripe h-3" />
      <ItsAlreadyHappening />
      <div className="caution-stripe h-3" />
      <AdvancedManufacturing />
      <div className="caution-stripe h-3" />
      <CtaBanner />
    </main>
    <SiteFooter />
  </div>
);

export default Index;
