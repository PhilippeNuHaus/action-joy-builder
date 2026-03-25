import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Send, Mail, Phone, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TakeAction = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    zip: "",
    message: `Dear Senator Blakespear:\n\nThank you for authoring SB 954 and your work to protect and restore our right to know under the California Environmental Quality Act (CEQA).\n\nI was shocked to learn the Legislature last year exempted a wide variety of polluting industrial projects from CEQA's critical public health and environmental protection requirements. That exemption will result in more contamination of our air and water, more greenhouse gas emissions, and more damage to critical wildlife habitat.\n\nThe so-called "advanced manufacturing" projects include industries that use, and at times emit, dangerous chemicals like cyanide, PFAs, arsenic, hexavalent chromium, lead, and many others. It just doesn't make sense to exempt these types of projects from California's foundational law protecting public health and the environment.\n\nI greatly appreciate your leadership on this urgent public health issue. Please continue the effort to limit any exemptions to only truly clean industries sited in locations that don't threaten our air, water, natural and coastal lands, or our communities. The Legislature made a serious mistake when it adopted the advanced manufacturing exemption to CEQA.\n\nThank you for working to correct this mistake.`,
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [districtError, setDistrictError] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDistrictError(false);
    setValidating(true);

    try {
      // Validate district first
      const fullAddress = `${formData.address}, ${formData.zip}`;
      const { data: districtData, error: districtFnError } = await supabase.functions.invoke("validate-district", {
        body: { address: fullAddress },
      });

      if (districtFnError) {
        console.error("District validation error:", districtFnError);
      }

      if (!districtData?.inDistrict) {
        setDistrictError(true);
        setValidating(false);
        return;
      }

      setValidating(false);
      setSending(true);

      const id = crypto.randomUUID();

      // Send the letter to the senator's office
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "senator-notification",
          recipientEmail: "senator.blakespear@senate.ca.gov",
          idempotencyKey: `senator-notify-${id}`,
          templateData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            address: formData.address,
            zip: formData.zip,
            message: formData.message,
          },
        },
      });

      // Send confirmation to the user
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "take-action-confirmation",
          recipientEmail: formData.email,
          idempotencyKey: `take-action-confirm-${id}`,
          templateData: { firstName: formData.firstName },
        },
      });
      setSent(true);
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
      setSent(true);
    } finally {
      setSending(false);
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="caution-stripe h-3" />

        <section className="py-16">
          <div className="container max-w-4xl">
            <h1 className="font-heading text-4xl md:text-5xl uppercase text-center mb-3">
              Take <span className="text-primary">Action</span>
            </h1>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Contact Senator Catherine Blakespear and demand accountability. Your voice matters.
            </p>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form */}
              <div className="lg:col-span-3">
                {sent ? (
                  <div className="bg-card border border-primary/30 rounded-sm p-8 text-center">
                    <CheckCircle size={48} className="text-primary mx-auto mb-4" />
                    <h2 className="font-heading text-2xl uppercase text-foreground mb-2">Message Sent!</h2>
                    <p className="text-muted-foreground">Thank you for standing up for your community.</p>
                    <button
                      onClick={() => { setSent(false); setDistrictError(false); }}
                      className="mt-4 text-primary text-sm underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 space-y-4">
                    <h2 className="font-heading text-lg uppercase tracking-wider text-primary mb-2">
                      Send a Message to the Senator
                    </h2>

                    {districtError && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-sm p-4 flex items-start gap-3">
                        <AlertTriangle size={20} className="text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground font-medium">Outside Senate District 38</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            This message tool is designed for constituents of California Senate District 38, represented by Senator Blakespear. If you believe this is an error, please double-check your address. You can still reach the Senator directly via email or phone using the contact options on this page.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      value={formData.address}
                      onChange={(e) => { setFormData({ ...formData, address: e.target.value }); setDistrictError(false); }}
                      className="w-full bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      required
                      value={formData.zip}
                      onChange={(e) => { setFormData({ ...formData, zip: e.target.value }); setDistrictError(false); }}
                      className="w-full bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 italic">
                        Feel free to personalize the message below — adding your own perspective makes it even more impactful.
                      </p>
                      <textarea
                        rows={10}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending || validating}
                      className="w-full bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send size={16} /> {validating ? "Verifying Address..." : sending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar actions */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-card border border-border rounded-sm p-5">
                  <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-3">Other Ways to Help</h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:senator.blakespear@senate.ca.gov"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail size={16} className="text-primary shrink-0" />
                      Email the Senator directly
                    </a>
                    <a
                      href="tel:+19168516038"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone size={16} className="text-primary shrink-0" />
                      Call: (916) 651-6038
                    </a>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Share:</span>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://righttoknow-blakespear.org")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Protect our communities from toxic pollution! Thank Senator Blakespear for fighting to restore CEQA protections. Take action:")}&url=${encodeURIComponent("https://righttoknow-blakespear.org")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Share on X"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://righttoknow-blakespear.org")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-sm p-5">
                  <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-2">Why Your Voice Matters</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Legislators pay close attention to constituent feedback. Every message counts toward building the pressure needed to close the advanced manufacturing loophole and protect our communities.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TakeAction;
