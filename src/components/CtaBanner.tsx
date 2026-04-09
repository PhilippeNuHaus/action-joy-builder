import { ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import DistrictCheckDialog from "@/components/DistrictCheckDialog";

const CtaBanner = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-xl md:text-2xl uppercase mb-6">
              Take Action to <span className="text-primary">Protect Your Community</span>
            </h2>

            <p className="font-heading text-3xl md:text-5xl uppercase tracking-wider text-foreground mb-6 leading-[1.35]">
              Thank Senator{" "}
              <span className="text-primary">Blakespear</span><br />
              for Introducing SB 954<br />
              and Leading the Fight to…
            </p>

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
                onClick={() => setDialogOpen(true)}
                className="bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-8 py-3 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 animate-pulse-glow"
              >
                Click to Quickly Send a Thank You<br />to Senator Blakespear <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <DistrictCheckDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default CtaBanner;
