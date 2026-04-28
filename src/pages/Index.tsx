import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TypewriterGlow from "@/components/TypewriterGlow";
import AlliesStrip from "@/components/AlliesStrip";
import HeroSection from "@/components/HeroSection";
import CeqaExplainer from "@/components/CeqaExplainer";
import ItsAlreadyHappening from "@/components/ItsAlreadyHappening";
import AdvancedManufacturing from "@/components/AdvancedManufacturing";
import CtaBanner from "@/components/CtaBanner";
import SenatorContactForm from "@/components/SenatorContactForm";
import OtherWaysToHelp from "@/components/OtherWaysToHelp";

const Index = () => {
  const [pulseForm, setPulseForm] = useState(false);

  useEffect(() => {
    const handler = () => {
      setPulseForm(true);
      setTimeout(() => setPulseForm(false), 600);
    };
    window.addEventListener("pulse-form", handler);
    return () => window.removeEventListener("pulse-form", handler);
  }, []);

  const pulseClass = pulseForm
    ? "scale-[1.03] transition-transform duration-300"
    : "scale-100 transition-transform duration-300";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="lg:grid lg:grid-cols-[1fr_420px] 2xl:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <HeroSection />
            <div className="lg:hidden">
              <AlliesStrip />
            </div>
            <div className={`lg:hidden ${pulseClass}`} id="contact-form">
              <div className="caution-stripe h-3" />
              <div className="container py-7">
                <h2 className="font-heading text-lg uppercase tracking-wider text-foreground mb-4 text-center">
                  Send Your Message to <TypewriterGlow text="Senator Blakespear" />
                </h2>
                <SenatorContactForm />
                <div className="mt-5">
                  <OtherWaysToHelp />
                </div>
              </div>
              <div className="caution-stripe h-3" />
            </div>
            <div className="hidden lg:block">
              <AlliesStrip />
            </div>
            <div className="hidden lg:block caution-stripe h-3" />
            <CeqaExplainer />
            <div className="caution-stripe h-3" />
            <ItsAlreadyHappening />
            <div className="caution-stripe h-3" />
            <AdvancedManufacturing />
            <div className="caution-stripe h-3" />
            <CtaBanner />
          </div>
          <div className="hidden lg:block border-l border-border" id="contact-form-desktop">
            <div className={`sticky top-20 p-6 pt-2 max-h-[calc(100vh-5rem)] overflow-y-auto ${pulseClass}`}>
              <h2 className="font-heading text-lg uppercase tracking-wider text-foreground mb-4 text-center">
                Send Your Message to <TypewriterGlow text="Senator Blakespear" />
              </h2>
              <SenatorContactForm />
              <div className="mt-5">
                <OtherWaysToHelp />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
