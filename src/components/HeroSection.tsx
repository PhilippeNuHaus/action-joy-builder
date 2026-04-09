import { ArrowRight, AlertTriangle } from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero-aerial-coast.png";
import DistrictCheckDialog from "@/components/DistrictCheckDialog";

const HeroSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Polluting industrial facility near residential area" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/25 to-background/60" />
        </div>

        <div className="relative z-10 container py-16 md:py-28 flex items-center justify-center min-h-[70vh]">
          <div className="relative max-w-3xl w-full text-center rounded-lg p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm rounded-lg" />

            <div className="relative z-10">
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-primary mb-4 flex items-center justify-center gap-2">
                <AlertTriangle size={14} />
                San Diego and Southwestern Orange Counties
              </p>
              <h1 className="font-heading text-2xl md:text-4xl lg:text-[2.8rem] font-bold uppercase mb-10 flex flex-col items-center gap-4">
                <span>Thank State Senator</span>
                <span>Catherine Blakespear for</span>
                <span>Protecting <span className="text-gold-gradient">Our Community</span></span>
                <span>from Toxic Pollution</span>
                <span>by Enacting the SB 954 Public</span>
                <span>Health and Environment Safeguards</span>
                
              </h1>

              <div className="flex justify-center">
                <button
                  onClick={() => setDialogOpen(true)}
                  className="bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-10 py-5 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 animate-pulse-glow max-w-[400px] w-full"
                >
                  Click to Quickly Send a Thank You to<br />Senator Blakespear <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DistrictCheckDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default HeroSection;
