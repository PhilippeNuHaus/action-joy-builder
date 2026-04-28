import { ArrowRight, CheckCircle } from "lucide-react";

const CtaBanner = () => {
  const scrollToForm = () => {
    const el =
      document.getElementById("contact-form") ||
      document.getElementById("contact-form-desktop");
    el?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => window.dispatchEvent(new Event("pulse-form")), 400);
  };

  return (
    <section className="py-16 bg-card">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-xl md:text-2xl uppercase mb-6">
            Take Action to <span className="text-primary">Protect Your Community</span>
          </h2>

          <div className="font-heading text-3xl md:text-5xl uppercase tracking-wider text-foreground mb-6 flex flex-col items-center gap-3 md:gap-5">
            <span>Thank Senator{" "}<span className="text-primary">Blakespear</span></span>
            <span>for Introducing SB 954</span>
            <span>and Leading the Fight to…</span>
          </div>

          <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground text-lg">Keep environmental review in place for "advanced manufacturing" projects.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground text-lg">Protect water, air, and public health in our communities.</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={scrollToForm}
              className="relative bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-10 py-4 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 animate-pulse-glow max-w-[400px] w-full"
            >
              <span className="flex flex-col items-center leading-[1.5] md:hidden">
                <span>Click to Quickly Send</span>
                <span>A Thank You To</span>
                <span>Senator Blakespear</span>
              </span>
              <ArrowRight size={16} className="absolute right-10 top-1/2 -translate-y-1/2 md:hidden" />
              <span className="hidden md:inline">
                Click to Quickly Send a Thank You<br />to Senator Blakespear
              </span>
              <ArrowRight size={16} className="hidden md:block" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
