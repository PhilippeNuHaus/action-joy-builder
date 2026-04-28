import { useEffect, useState } from "react";
import cleanWaterActionLogo from "@/assets/allies/clean-water-action.png";
import environmentCaliforniaLogo from "@/assets/allies/environment-california.png";
import pclLogo from "@/assets/allies/pcl.png";
import sierraClubLogo from "@/assets/allies/sierra-club.png";

// NOTE: Allies list is in progress — confirm before launch.
type Ally = { name: string; logo?: string; logoClassName?: string };

const DEFAULT_LOGO_CLASS = "h-[68px] md:h-[82px] w-auto object-contain";

const ALLIES: Ally[] = [
  { name: "Planning and Conservation League", logo: pclLogo },
  { name: "Sierra Club", logo: sierraClubLogo, logoClassName: "h-[78px] md:h-[94px] w-auto object-contain" },
  { name: "Clean Water Action", logo: cleanWaterActionLogo },
  { name: "Environment California", logo: environmentCaliforniaLogo },
];

const PULSE_INTERVAL = 1200;
const PAUSE_AFTER_CYCLE = 1500;

const AlliesStrip = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const advance = () => {
      setActiveIndex((current) => {
        const next = current + 1;
        if (next >= ALLIES.length) {
          timeoutId = setTimeout(advance, PAUSE_AFTER_CYCLE);
          return 0;
        }
        timeoutId = setTimeout(advance, PULSE_INTERVAL);
        return next;
      });
    };

    timeoutId = setTimeout(advance, PULSE_INTERVAL);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section
      aria-label="Coalition allies"
      className="bg-secondary border-t-2 border-primary"
    >
      <div className="container mx-auto px-4 py-5">
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
                  className={`${ally.logoClassName ?? DEFAULT_LOGO_CLASS} transition-transform duration-300 ${
                    activeIndex === i ? "scale-110" : "scale-100"
                  }`}
                  loading="lazy"
                />
              ) : (
                <span className="font-heading font-semibold uppercase tracking-widest text-primary text-sm md:text-base">
                  {ally.name}
                </span>
              )}
              {i < ALLIES.length - 1 && (
                <span className="text-primary/60 hidden md:inline" aria-hidden="true">
                  •
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlliesStrip;
