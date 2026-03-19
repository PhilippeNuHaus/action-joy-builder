import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const WhatsNearYou = () => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader />
    <main className="flex-1">
      <div className="caution-stripe h-3" />

      <section className="py-24 md:py-32">
        <div className="container max-w-3xl text-center">
          <h1 className="font-heading text-4xl md:text-6xl uppercase mb-4">
            What's <span className="text-primary">Near You</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This page is intentionally blank for now. We’ll add the interactive map and local site details next.
          </p>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default WhatsNearYou;
