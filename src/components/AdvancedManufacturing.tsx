import { FlaskConical, Recycle, Mountain, Zap, Factory, BatteryCharging } from "lucide-react";

const categories = [
  {
    icon: FlaskConical,
    title: "Toxic Chemical Production",
    items: ["Pesticide manufacturing", "Silicon anode powder manufacturing", "Composites manufacturing", "Aircarbon manufacturing", "Soil amendments production"],
  },
  {
    icon: Recycle,
    title: "Recycling & Waste Processing",
    items: ["Lead-acid battery recycling", "Waste incineration", "Metal recycling", "Precious metals recycling", "Medical waste recycling"],
  },
  {
    icon: Mountain,
    title: "Heavy Industry / Extraction",
    items: ["Strip mining", "Chemical manufacturing", "Fertilizer manufacturing", "Metal mining and extraction"],
  },
  {
    icon: Zap,
    title: "Energy & Fuel Production",
    items: ["Nuclear energy testing", "Fuel-grade hydrogen production", "Biomass processing and fuel", "Landfill gas capture"],
  },
  {
    icon: Factory,
    title: "Metal, Plastic Processing & Refining",
    items: ["Metal forging", "Thin steel plate manufacturing", "Metal products manufacturing", "Tooling and metal stamping", "Plastic manufacturing and fabrication"],
  },
  {
    icon: BatteryCharging,
    title: "Battery & EV Supply Chain",
    items: ["Lithium recovery and processing", "Lithium battery cell manufacturing", "EV battery manufacturing", "Plug-in hybrid vehicle manufacturing"],
  },
];

const AdvancedManufacturing = () => (
  <section id="advanced-manufacturing" className="py-16 scroll-mt-20">
    <div className="container">
      
      <h2 className="font-heading text-3xl md:text-5xl uppercase text-center mb-3">
        What Qualifies as{" "}
        <span className="text-gold-gradient">"Advanced Manufacturing"</span>?
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        California defines "advanced manufacturing" extremely broadly, covering more than 75 categories of industrial facilities — including facilities that use and, at times, emit toxic chemicals.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.title} className="bg-card rounded-sm border border-border p-5 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                <cat.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-heading text-xs uppercase tracking-wider text-foreground">{cat.title}</h3>
            </div>
            <ul className="space-y-1.5">
              {cat.items.map((item) => (
                <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AdvancedManufacturing;
