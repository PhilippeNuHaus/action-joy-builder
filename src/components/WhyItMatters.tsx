import drBonnie from "@/assets/dr-bonnie.jpg";
import firefighterMark from "@/assets/firefighter-mark.jpg";
import mariaG from "@/assets/maria-g.jpg";

const testimonials = [
  {
    name: "Dr. Bonnie Hamilton",
    image: drBonnie,
    quote: "I'm worried about pollution from heavy industry harming the health of our communities.",
  },
  {
    name: "Firefighter Mark R.",
    image: firefighterMark,
    quote: "I've seen fires, toxic accidents, even explosions at industrial sites in our area. Safety must come first.",
  },
  {
    name: "Maria G.",
    image: mariaG,
    quote: "Families deserve to know what is being built near our homes and how it will affect our water and air.",
  },
];

const WhyItMatters = () => (
  <section className="py-16">
    <div className="container">
      
      <h2 className="font-heading text-3xl md:text-5xl uppercase text-center mb-10">
        Why This <span className="text-primary">Matters</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-card rounded-sm overflow-hidden border border-border group hover:border-primary/50 transition-colors">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={t.image}
                alt={t.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-2">{t.name}</h3>
              <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyItMatters;
