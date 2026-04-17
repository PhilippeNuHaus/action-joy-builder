import cleanWaterActionLogo from "@/assets/allies/clean-water-action.png";
import environmentCaliforniaLogo from "@/assets/allies/environment-california.png";
import pclLogo from "@/assets/allies/pcl.png";

// NOTE: Allies list is in progress — confirm before launch.
type Ally = { name: string; logo?: string; logoClassName?: string };

const DEFAULT_LOGO_CLASS = "h-10 md:h-12 w-auto object-contain";

const ALLIES: Ally[] = [
  { name: "Planning and Conservation League", logo: pclLogo },
  { name: "Clean Water Action", logo: cleanWaterActionLogo },
  { name: "Environment California", logo: environmentCaliforniaLogo },
];

const AlliesStrip = () => (
  <section
    aria-label="Coalition allies"
    className="bg-secondary border-t-2 border-b-2 border-primary"
  >
    <div className="container mx-auto px-4 py-3">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
        <span className="font-heading font-semibold uppercase tracking-widest text-primary text-sm md:text-base">
          Join
        </span>
        <span className="text-primary/60 hidden md:inline" aria-hidden="true">
          •
        </span>
        {ALLIES.map((ally, i) => (
          <span key={ally.name} className="flex items-center gap-x-4">
            {ally.logo ? (
              <img
                src={ally.logo}
                alt={ally.name}
                className={ally.logoClassName ?? DEFAULT_LOGO_CLASS}
                loading="lazy"
              />
            ) : (
              <span className="font-heading font-semibold uppercase tracking-widest text-primary text-sm md:text-base">
                {ally.name}
              </span>
            )}
            {i < ALLIES.length - 1 && (
              <span className="text-primary/60" aria-hidden="true">
                •
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default AlliesStrip;
