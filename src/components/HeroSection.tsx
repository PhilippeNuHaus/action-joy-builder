import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Users } from "lucide-react";
import heroImg from "@/assets/hero-coastal.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroImg} alt="Southern California coast with industrial facilities" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/85" />
    </div>

    {/* Caution tape top */}



    <div className="relative z-10 container py-16 md:py-28">
      <div className="max-w-3xl mx-auto text-center bg-background/40 backdrop-blur-sm rounded-lg p-8 md:p-12">
        <p className="font-heading text-xs uppercase tracking-[0.3em] text-primary mb-4 flex items-center justify-center gap-2">
          <AlertTriangle size={14} />
          Orange and San Diego County
        </p>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-4">
          Protect Your{" "}
          <span className="text-gold-gradient">Communities</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed mx-auto max-w-xl">
          Protect your right to know about dangerous facilities going into your neighborhood.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center">
          <Link
            to="/take-action"
            className="bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 animate-pulse-glow"
          >
            Contact Senator Catherine Blakespear <ArrowRight size={16} />
          </Link>
          <a
            href="#advanced-manufacturing"
            className="border border-primary text-primary font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-primary/10 transition-colors text-center"
          >
            Learn About the Dangers
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
