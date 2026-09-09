import { useState } from "react";
import { FileText, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResourcePdfModal from "@/components/ResourcePdfModal";
import type { Resource } from "@/pages/Resources";
import sb954Letter from "@/assets/sb954-letter.pdf.asset.json";

const QUOTES = [
  {
    text: "California families have a right to know what's being released into our air, water, and soil. SB 954 restores that basic protection.",
    attribution: "Statewide Public Health Coalition",
  },
  {
    text: "Communities living next to industrial facilities deserve a meaningful voice — not exemptions written behind closed doors.",
    attribution: "Environmental Justice Advocates of California",
  },
  {
    text: "CEQA review has prevented countless toxic exposures. Carving out 'advanced manufacturing' guts that protection precisely where it's needed most.",
    attribution: "California Environmental Health Network",
  },
];

const WHAT_SB954_DOES = [
  "Restores public notice and environmental review for so-called 'advanced manufacturing' facilities.",
  "Protects communities from toxic air emissions, hazardous water discharges, and contaminated land.",
  "Reinstates the right of residents to know what is being built next to their homes and schools.",
  "Closes the loophole that lets industrial polluters skip CEQA's 'look before you leap' safeguards.",
];

// Coalition signatories. Drop logos into /public/logos/<slug>.png to replace
// the styled text chip fallback automatically.
const SIGNATORIES: { name: string; slug: string }[] = [
  { name: "Sierra Club California", slug: "sierra-club" },
  { name: "Clean Water Action", slug: "clean-water-action" },
  { name: "California Environmental Justice Alliance", slug: "caleja" },
  { name: "Communities for a Better Environment", slug: "cbe" },
  { name: "Center for Biological Diversity", slug: "cbd" },
  { name: "Coalition for Clean Air", slug: "coalition-clean-air" },
  { name: "Physicians for Social Responsibility — LA", slug: "psr-la" },
  { name: "Breast Cancer Prevention Partners", slug: "bcpp" },
  { name: "California Nurses Association", slug: "cna" },
  { name: "Asian Pacific Environmental Network", slug: "apen" },
  { name: "Greenaction", slug: "greenaction" },
  { name: "Friends of the Earth", slug: "foe" },
  { name: "Natural Resources Defense Council", slug: "nrdc" },
  { name: "Earthjustice", slug: "earthjustice" },
  { name: "California Environmental Voters", slug: "clcv" },
  { name: "Environmental Working Group", slug: "ewg" },
  { name: "Climate Action Campaign", slug: "cac" },
  { name: "Public Citizen California", slug: "public-citizen" },
  { name: "350 Sacramento", slug: "350-sac" },
  { name: "Food & Water Watch", slug: "food-water-watch" },
];

const SB954_LETTER: Resource = {
  title: "SB 954 Support-in-Concept Letter",
  category: "Coalition Letter",
  description: "Full coalition letter in support of SB 954.",
  pdfUrl: sb954Letter.url,
  thumbUrl: "",
};

const LogoTile = ({ name, slug }: { name: string; slug: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const showImage = loaded && !errored;
  return (
    <div className="shrink-0 h-16 min-w-[180px] px-5 bg-background/80 border border-border rounded-md flex items-center justify-center relative">
      <span
        className={`text-xs md:text-sm text-foreground font-heading uppercase tracking-wide text-center leading-tight transition-opacity ${showImage ? "opacity-0" : "opacity-100"}`}
      >
        {name}
      </span>
      <img
        src={`/logos/${slug}.png`}
        alt={name}
        className={`absolute inset-0 m-auto max-h-10 max-w-[150px] object-contain opacity-90 ${showImage ? "" : "hidden"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </div>
  );
};

const ItsHappeningNow = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const marqueeList = [...SIGNATORIES, ...SIGNATORIES];

  return (
    <section className="bg-card py-10 md:py-14">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-5xl uppercase text-center mb-3">
          A Coalition for the <span className="text-primary">Right to Know</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-6 text-sm md:text-base">
          120+ California organizations urging the Legislature to pass SB 954.
        </p>

        <div className="caution-stripe h-4 mb-8" />

        {/* Quote cards */}
        <div className="grid gap-5 md:grid-cols-3 mb-10">
          {QUOTES.map((q, i) => (
            <article
              key={i}
              className="bg-background/60 border-2 border-primary/60 rounded-xl p-5 flex flex-col"
            >
              <Quote className="text-primary mb-3 shrink-0" size={28} />
              <p className="text-sm md:text-[15px] text-foreground leading-relaxed font-medium flex-1">
                "{q.text}"
              </p>
              <p className="mt-4 text-xs uppercase tracking-wider text-primary font-heading">
                — {q.attribution}
              </p>
            </article>
          ))}
        </div>

        {/* What SB 954 does */}
        <div className="bg-background/60 border border-border rounded-xl p-6 md:p-8 mb-10">
          <h3 className="font-heading text-2xl md:text-3xl uppercase mb-5 text-center">
            What <span className="text-primary">SB 954</span> Does
          </h3>
          <ul className="grid gap-3 md:grid-cols-2 max-w-4xl mx-auto">
            {WHAT_SB954_DOES.map((item, i) => (
              <li key={i} className="flex gap-3 items-start text-sm md:text-[15px] text-foreground leading-relaxed">
                <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Signatory logo marquee */}
        <div className="mb-8">
          <p className="text-center text-xs md:text-sm uppercase tracking-widest text-primary font-heading mb-4">
            120+ organizations have signed on
          </p>
          <div className="relative overflow-hidden border-y border-border py-5 bg-background/40">
            <div className="flex gap-4 w-max animate-[marquee_50s_linear_infinite]">
              {marqueeList.map((org, i) => (
                <LogoTile key={i} name={org.name} slug={org.slug} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => setModalOpen(true)}
            className="font-heading uppercase tracking-wider"
          >
            <FileText size={18} className="mr-2" />
            Read the Full Letter (PDF)
          </Button>
        </div>
      </div>

      {modalOpen && (
        <ResourcePdfModal
          resource={SB954_LETTER}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
};

export default ItsHappeningNow;
