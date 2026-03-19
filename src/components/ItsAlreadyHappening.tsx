import { Link } from "react-router-dom";
import songsNuclear from "@/assets/songs-nuclear.jpg";
import encinaPower from "@/assets/encina-power.jpg";

const ItsAlreadyHappening = () => (
  <section className="py-16 bg-card">
    <div className="container">
      <h2 className="font-heading text-3xl md:text-4xl uppercase text-center mb-10">
        It's Already <span className="text-primary">Happening</span>
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - Long Term Costs: SONGS text only */}
        <div className="rounded-sm border border-border p-6 flex flex-col">
          <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-4">
            Long Term <span className="text-foreground font-bold">Costs</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The San Onofre Nuclear Generating Station (SONGS) was permanently shut down in 2013 following equipment failures and a radiation leak, yet more than 3.6 million pounds of nuclear waste remain stored on-site, just feet from the Pacific Ocean. Despite ongoing mitigation efforts, the site continues to raise serious concerns.
          </p>
        </div>

        {/* Center - Know What's Near You */}
        <div className="flex flex-col">
          <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-4">
            Know What's Near You
          </h3>
          <div className="flex-1 flex flex-col justify-between">
            <img
              src={songsNuclear}
              alt="San Onofre Nuclear Generating Station"
              className="w-full rounded-sm grayscale"
            />
            <Link
              to="/whats-near-you"
              className="block text-center bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-4 py-3 rounded-sm hover:bg-gold-dark transition-colors mt-6"
            >
              What's Near You
            </Link>
          </div>
        </div>

        {/* Right - Long Term Costs: Encina with image */}
        <div className="rounded-sm border border-border overflow-hidden flex flex-col">
          <div className="relative">
            <img
              src={encinaPower}
              alt="Encina Power Station in Carlsbad"
              className="w-full h-52 object-cover"
            />
            {/* Diagonal caution stripes on corners */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
              <div className="caution-stripe-thin absolute -right-4 -top-4 w-24 h-24 rotate-45 origin-center" />
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
              <div className="caution-stripe-thin absolute -left-4 -bottom-4 w-24 h-24 rotate-45 origin-center" />
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-4">
              Long Term <span className="text-foreground font-bold">Costs</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Encina Power Station in Carlsbad operated for decades along the Pacific, relying on once-through ocean cooling that drew in and killed marine life while discharging heated water back into the ocean. Large-scale industrial facilities can leave behind consequences that persist well beyond their operation.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ItsAlreadyHappening;
