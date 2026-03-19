import { FlaskConical, Recycle, Mountain, Zap, Factory, BatteryCharging } from "lucide-react";

const categories = [
  {
    icon: FlaskConical,
    title: "Chemical & Toxic Production",
    items: ["Silicon anode powder manufacturing", "Composites manufacturing", "Aircarbon manufacturing", "Soil amendments production"],
  },
  {
    icon: Recycle,
    title: "Recycling & Waste Processing",
    items: ["Metal and plastic recycling", "Precious metals recycling", "Medical waste recycling", "Lead-acid battery recycling"],
  },
  {
    icon: Mountain,
    title: "Heavy Industry / Extraction",
    items: ["Metal mining and extraction", "Rare earth materials (strip mining)", "Petroleum refineries", "Chemical manufacturing"],
  },
  {
    icon: Zap,
    title: "Energy & Fuel Production",
    items: ["Nuclear energy testing", "Fuel-grade hydrogen production", "Biomass processing and fuel", "Landfill gas capture"],
  },
  {
    icon: Factory,
    title: "Industrial Processing & Refining",
    items: ["Metal forging", "Thin steel plate manufacturing", "Metal products manufacturing", "Tooling and metal stamping"],
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
      
      <h2 className="font-heading text-3xl md:text-4xl uppercase text-center mb-3">
        What Qualifies as{" "}
        <span className="text-gold-gradient">"Advanced Manufacturing"</span>?
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        California defines "advanced manufacturing" extremely broadly, covering any process that improves or creates materials and processes, with no requirement that it reduce pollution or environmental impacts.
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
