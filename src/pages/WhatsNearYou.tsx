import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { MapPin, AlertTriangle, ExternalLink } from "lucide-react";
import districtMap from "@/assets/district-map.png";

const facilities = [
  {
    name: "San Onofre Nuclear Generating Station (SONGS)",
    location: "San Clemente",
    risk: "high",
    description: "3.6 million pounds of nuclear waste stored on-site, just feet from the Pacific Ocean.",
  },
  {
    name: "Encina Power Station (Decommissioned)",
    location: "Carlsbad",
    risk: "medium",
    description: "Decades of environmental impact from once-through ocean cooling. Currently undergoing remediation.",
  },
  {
    name: "Potential Advanced Manufacturing Sites",
    location: "Various locations, District 38",
    risk: "high",
    description: "Under the new CEQA loophole, new industrial facilities could be approved without environmental review anywhere in the district.",
  },
];

const WhatsNearYou = () => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader />
    <main className="flex-1">
      <div className="caution-stripe h-3" />

      <section className="py-16">
        <div className="container">
          <h1 className="font-heading text-4xl md:text-5xl uppercase text-center mb-3">
            What's <span className="text-primary">Near You</span>
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Explore industrial sites and potential risks in Senate District 38 — Orange and San Diego County.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map area */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-heading text-sm uppercase tracking-wider text-primary flex items-center gap-2">
                  <MapPin size={16} /> Senate District 38
                </h2>
              </div>
              <div className="p-4">
                <img
                  src={districtMap}
                  alt="Map of Senate District 38 showing Orange and San Diego Counties"
                  className="w-full rounded-sm"
                />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Interactive map coming soon. Contact us to report a facility near you.
                </p>
              </div>
            </div>

            {/* Facility list */}
            <div className="space-y-4">
              <h2 className="font-heading text-lg uppercase tracking-wider text-foreground">Known Sites & Risks</h2>
              {facilities.map((f) => (
                <div key={f.name} className="bg-card border border-border rounded-sm p-5 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-heading text-sm uppercase tracking-wider text-foreground">{f.name}</h3>
                    <span className={`shrink-0 flex items-center gap-1 text-xs font-heading uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                      f.risk === "high"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-primary/20 text-primary"
                    }`}>
                      <AlertTriangle size={10} />
                      {f.risk} risk
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin size={10} className="text-primary" /> {f.location}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}

              <div className="bg-primary/10 border border-primary/30 rounded-sm p-5 mt-6">
                <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-2">Know of a Site?</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Help us document facilities in your area. Report a location and we'll investigate.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-gold-dark transition-colors font-heading uppercase tracking-wider"
                >
                  <ExternalLink size={14} /> Report a Facility
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default WhatsNearYou;
