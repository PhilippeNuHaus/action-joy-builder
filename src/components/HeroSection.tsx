import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Users } from "lucide-react";
import heroImg from "@/assets/hero-coastal.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImg} alt="Polluting industrial facility near residential area" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/25 to-background/60" />
    </div>

    <div className="relative z-10 container py-16 md:py-28">
      <div className="max-w-3xl mx-auto text-center bg-background/40 backdrop-blur-sm rounded-lg p-8 md:p-12">
        <p className="font-heading text-xs uppercase tracking-[0.3em] text-primary mb-4 flex items-center justify-center gap-2">
          <AlertTriangle size={14} />
          San Diego and Southwestern Orange County
        </p>
        <h1 className="font-heading text-2xl md:text-4xl lg:text-[2.8rem] font-bold uppercase mb-4 flex flex-col items-center gap-3">
          <span>Thank Senator Catherine</span>
          <span>Blakespear for Protecting</span>
          <span className="text-gold-gradient">Your Community</span>
          <span>from Toxic Pollution</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center">
          <Link
            to="/take-action"
            className="bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 animate-pulse-glow"
          >
            Thank Senator Catherine Blakespear <ArrowRight size={16} />
          </Link>
          <a
            href="#advanced-manufacturing"
            className="border border-primary text-primary font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-primary/10 transition-colors text-center"
          >
            Learn More About the Dangers of the Advanced Manufacturing Exemption
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Users size={16} className="text-primary" />
          <span className="text-sm font-heading tracking-wider">
            <span className="text-primary font-bold">1,350</span> messages already sent
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
