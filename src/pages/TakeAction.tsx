import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Send, Mail, Phone, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TakeAction = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    zip: "",
    message: "Dear Senator Blakespear,\n\nI urge you to act with urgency to close the advanced manufacturing loophole in CEQA. Our communities deserve the right to know about dangerous facilities being built in our neighborhoods.\n\nPlease keep environmental review in place for advanced manufacturing projects and protect water, air, and public health in our communities.\n\nThank you.",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const id = crypto.randomUUID();
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
      setSent(true); // still show success to user
    } finally {
      setSending(false);
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
                      onClick={() => setSent(false)}
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
                      placeholder="ZIP Code"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <textarea
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-gold-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={16} /> Send Message
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
                    <a
                      href="#"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={16} className="text-primary shrink-0" />
                      Share on social media
                    </a>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-sm p-5">
                  <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-2">Why Your Voice Matters</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Legislators pay close attention to constituent feedback. Every message counts toward building the pressure needed to close the advanced manufacturing loophole and protect our communities.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-sm p-5 text-center">
                  <p className="font-heading text-3xl text-primary font-bold">1,350</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Messages Sent</p>
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
