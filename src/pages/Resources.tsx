import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ResourceCard from "@/components/ResourceCard";
import ResourcePdfModal from "@/components/ResourcePdfModal";
import { useState } from "react";
import advocacyThumb from "@/assets/advocacy-letter-thumb.jpg";
import factsThumb from "@/assets/myths-facts-thumb.jpg";
import sb954Thumb from "@/assets/sb954-support-thumb.jpg";
import laborNgoThumb from "@/assets/labor-ngo-cleanup-thumb.jpg";

export interface Resource {
  title: string;
  category: string;
  description: string;
  pdfUrl: string;
  thumbUrl: string;
}

const resources: Resource[] = [
  {
    title: "120+ Orgs: Support in Concept for SB 954",
    category: "Advocacy",
    description:
      "A coalition of 120+ labor, environmental, and environmental justice organizations expressing support in concept for SB 954 (Blakespear), which addresses the environmental and public health rollbacks enacted under SB 131.",
    pdfUrl: "/resources/sb954-support-letter.pdf",
    thumbUrl: sb954Thumb,
  },
  {
    title: "Labor × NGO SB 131 Adv. Manufacturing Cleanup Letter",
    category: "Advocacy",
    description:
      "A joint labor and environmental coalition letter urging removal of the advanced manufacturing CEQA exemption from SB 131 via a budget trailer bill.",
    pdfUrl: "/resources/labor-ngo-cleanup-letter.pdf",
    thumbUrl: laborNgoThumb,
  },
  {
    title: "NGO SB 131 Cleanup Letter",
    category: "Advocacy",
    description:
      "A coalition letter urging lawmakers to restore CEQA protections and close the 'advanced manufacturing' loophole that threatens California communities.",
    pdfUrl: "/resources/advocacy-letter.pdf",
    thumbUrl: advocacyThumb,
  },
  {
    title: "SB 131 Myths vs. Facts",
    category: "The Facts",
    description:
      "A fact sheet debunking common misconceptions about the advanced manufacturing CEQA exemption and SB 131's proposed reforms.",
    pdfUrl: "/resources/myths-facts.pdf",
    thumbUrl: factsThumb,
  },
];

const Resources = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight uppercase">
              <span className="text-foreground">Resource </span>
              <span className="text-primary">Library</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Key documents, fact sheets, and advocacy letters related to the advanced manufacturing loophole and the fight for SB 954.
            </p>
          </div>
        </section>

        <div className="caution-stripe h-3" />

        {/* Grid */}
        <section className="container py-12 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {resources.map((resource, i) => (
              <ResourceCard
                key={i}
                resource={resource}
                onClick={() => setSelectedResource(resource)}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />

      {/* PDF Reader Modal */}
      {selectedResource && (
        <ResourcePdfModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

export default Resources;
