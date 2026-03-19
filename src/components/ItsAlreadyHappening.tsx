import { Link } from "react-router-dom";
import districtMap from "@/assets/district-map.png";
import industrialCoast from "@/assets/industrial-coast.jpg";

const ItsAlreadyHappening = () => (
  <section className="py-16 bg-card">
    <div className="container">
      <div className="caution-stripe h-2 mb-8 rounded-sm" />
      <h2 className="font-heading text-3xl md:text-4xl uppercase text-center mb-10">
        It's Already <span className="text-primary">Happening</span>
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Long Term Costs - SONGS */}
        <div className="bg-secondary/30 rounded-sm border border-border p-6">
          <h3 className="font-heading text-sm uppercase tracking-wider text-destructive mb-3">Long Term Costs</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The San Onofre Nuclear Generating Station (SONGS) was permanently shut down in 2013 following equipment failures and a radiation leak, yet more than 3.6 million pounds of nuclear waste remain stored on-site, just feet from the Pacific Ocean. Despite ongoing mitigation efforts, the site continues to raise serious concerns.
          </p>
        </div>

        {/* Know What's Near You */}
        <div className="bg-secondary/30 rounded-sm border border-border overflow-hidden">
          <div className="p-6">
            <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-3">Know What's Near You</h3>
          </div>
          <img src={districtMap} alt="Senate District 38 map" className="w-full px-4 pb-2" />
          <div className="p-4">
            <Link
              to="/whats-near-you"
              className="block text-center bg-primary text-primary-foreground font-heading text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-gold-dark transition-colors"
            >
              Explore the Map
            </Link>
          </div>
        </div>

        {/* Long Term Costs - Encina */}
        <div className="bg-secondary/30 rounded-sm border border-border overflow-hidden">
          <img src={industrialCoast} alt="Industrial facilities on the coast" className="w-full h-40 object-cover" />
          <div className="p-6">
            <h3 className="font-heading text-sm uppercase tracking-wider text-destructive mb-3">Long Term Costs</h3>
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
