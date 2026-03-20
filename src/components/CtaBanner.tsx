import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const CtaBanner = () => (
  <section className="py-16 bg-card">
    <div className="container">
      
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-3xl md:text-5xl uppercase mb-6">
          Take Action to<br />
          <span className="text-primary">Protect Your Community</span>
        </h2>

        <p className="font-heading text-lg uppercase tracking-wider text-foreground mb-6">
          Tell Senator <span className="text-primary">Catherine Blakespear</span>:
        </p>

        <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
            <span className="text-muted-foreground text-sm">Keep environmental review in place for advanced manufacturing projects.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
            <span className="text-muted-foreground text-sm">Protect water, air, and public health in our communities.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/take-action"
            className="bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-8 py-3 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 animate-pulse-glow"
          >
            Send Message <ArrowRight size={16} />
          </Link>
          <Link
            to="/take-action"
            className="border border-primary text-primary font-heading text-sm uppercase tracking-wider px-8 py-3 rounded-sm hover:bg-primary/10 transition-colors"
          >
            Take Action
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CtaBanner;
