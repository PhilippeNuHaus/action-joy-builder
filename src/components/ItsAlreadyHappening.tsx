import { Link } from "react-router-dom";
import districtMap from "@/assets/district-map.png";
import songsNuclear from "@/assets/songs-nuclear.jpg";
import encinaPower from "@/assets/encina-power.jpg";

const ItsAlreadyHappening = () => (
  <section className="bg-card py-10 md:py-14">
    <div className="container">
      <h2 className="font-heading text-3xl md:text-5xl uppercase text-center mb-6">
        The Long-Term <span className="text-primary">Costs</span>
      </h2>

      <div className="caution-stripe h-4 mb-6" />

      <div className="relative overflow-hidden rounded-sm border border-border min-h-[620px]">
        <img
          src={districtMap}
          alt="Map of Senate District 38"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/35" />

        <svg
          viewBox="0 0 1200 700"
          className="pointer-events-none absolute inset-0 hidden lg:block w-full h-full"
          aria-hidden="true"
        >
          <polyline
            points="300,150 540,150 551,301"
            fill="none"
            stroke="hsl(var(--navy))"
            strokeWidth="4"
          />
          <polyline
            points="920,425 750,425 642,455"
            fill="none"
            stroke="hsl(var(--navy))"
            strokeWidth="4"
          />
          <circle cx="551" cy="301" r="12" fill="hsl(var(--primary))" stroke="hsl(var(--navy))" strokeWidth="4" />
          <circle cx="642" cy="455" r="12" fill="hsl(var(--primary))" stroke="hsl(var(--navy))" strokeWidth="4" />
        </svg>

        <div className="relative z-10 p-4 md:p-6 lg:p-8">

          <div className="grid gap-6 lg:grid-cols-[minmax(0,368px)_1fr_minmax(0,368px)] lg:items-start">
            <article className="bg-card/95 border-2 border-primary rounded-xl p-4">
              <h3 className="font-heading text-3xl uppercase tracking-wide text-center mb-4">
                Risking Our <span className="text-primary">Environment</span>
              </h3>
              <img
                src={songsNuclear}
                alt="San Onofre Nuclear Generating Station"
                className="w-full h-28 object-cover rounded-sm border border-primary grayscale mb-3"
              />
              <p className="text-xs md:text-sm text-foreground leading-relaxed font-medium text-justify">
                Industrial infrastructure along the Southern California coast has already left lasting risks for surrounding
                communities. The San Onofre Nuclear Generating Station (SONGS), located within the district, was permanently
                shut down in 2013 following equipment failures and a radiation leak, yet more than 3.6 million pounds of
                nuclear waste remain stored on-site, just feet from the Pacific Ocean. Despite ongoing mitigation efforts,
                the site continues to raise serious concerns around coastal erosion, groundwater contamination, and long-term
                storage safety in a seismically active region. With no full CEQA process to address the significant negative
                impacts in place, highly radioactive waste remains stranded in the community indefinitely. Large-scale
                industrial projects can leave behind consequences that persist for decades, and without strong environmental
                oversight, communities risk being exposed to long-term hazards while taxpayers are left carrying the cost of
                monitoring, mitigation, and cleanup.
              </p>
            </article>

            <div className="hidden lg:block" />

            <article className="bg-card/95 border-2 border-primary rounded-xl p-4">
              <h3 className="font-heading text-3xl uppercase tracking-wide text-center mb-4">
                Long Term <span className="text-primary">Costs</span>
              </h3>
              <img
                src={encinaPower}
                alt="Encina Power Station in Carlsbad"
                className="w-full h-28 object-cover rounded-sm border border-primary mb-3"
              />
              <p className="text-xs md:text-sm text-foreground leading-relaxed font-medium text-justify">
                Industrial activity along the North County coastline has already left a lasting environmental footprint. The Encina Power Station in Carlsbad operated for decades along the Pacific, using once-through ocean cooling that killed marine life and discharged heated water back into the ocean, disrupting local ecosystems. It also contributed to air pollution and greenhouse gas emissions in surrounding communities before its closure in 2018.
                {" "}Because the plant was built before modern environmental laws, many of these impacts occurred without the level of oversight required today. That's exactly why CEQA is so important — it requires projects to disclose impacts, reduce harm, and protect public health.
                {" "}When Encina was finally shut down, CEQA review helped guide environmental cleanup and redevelopment, ensuring the site addressed long-term damage instead of passing those costs onto the community.
                {" "}Without strong CEQA protections — and with the advanced manufacturing loophole — projects could move forward without full environmental review, increasing the risk of long-term environmental damage and costly cleanup for coastal communities.
              </p>
            </article>
          </div>

        </div>
      </div>
    </div>
  </section>
);

export default ItsAlreadyHappening;
