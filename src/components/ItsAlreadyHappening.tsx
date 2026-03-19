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
        {/* Long Term Costs - SONGS (text only) */}
        <div className="bg-secondary/30 rounded-sm border border-border p-6 flex flex-col">
          <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-4">
            Long Term <span className="text-foreground font-bold">Costs</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The San Onofre Nuclear Generating Station (SONGS) was permanently shut down in 2013 following equipment failures and a radiation leak, yet more than 3.6 million pounds of nuclear waste remain stored on-site, just feet from the Pacific Ocean. Despite ongoing mitigation efforts, the site continues to raise serious concerns.
          </p>
        </div>

        {/* Know What's Near You */}
        <div className="bg-secondary/30 rounded-sm border border-border overflow-hidden flex flex-col">
          <div className="p-6 pb-4">
            <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-4">
              Know What's Near You
            </h3>
          </div>
          <div className="px-6">
            <img
              src={songsNuclear}
              alt="San Onofre Nuclear Generating Station"
              className="w-full rounded-sm"
            />
          </div>
          <div className="p-6 pt-4 mt-auto">
            <Link
              to="/whats-near-you"
              className="block text-center bg-primary text-primary-foreground font-heading text-xs uppercase tracking-wider px-4 py-3 rounded-sm hover:bg-gold-dark transition-colors"
            >
              What's Near You
            </Link>
          </div>
        </div>

        {/* Long Term Costs - Encina */}
        <div className="bg-secondary/30 rounded-sm border border-border overflow-hidden flex flex-col">
          <img
            src={encinaPower}
            alt="Encina Power Station in Carlsbad"
            className="w-full h-48 object-cover"
          />
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
