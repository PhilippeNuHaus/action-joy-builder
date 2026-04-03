import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

const DEFAULT_MESSAGE = `Dear Senator Blakespear:

Thank you for authoring SB 954 and your work to protect and restore our right to know under the California Environmental Quality Act (CEQA).

I was shocked to learn the Legislature last year exempted a wide variety of polluting industrial projects from CEQA's critical public health and environmental protection requirements. That exemption will result in more contamination of our air and water, more greenhouse gas emissions, more damage to critical wildlife habitat, and more exposure to cancer-causing chemicals.

The so-called "advanced manufacturing" projects include industries that use, and at times emit, dangerous chemicals like cyanide, PFAs, arsenic, hexavalent chromium, lead, and many others. It just doesn't make sense to exempt these types of projects from California's foundational law protecting public health and the environment.

I greatly appreciate your leadership on this urgent public health issue. Please continue the effort to limit any exemptions to only truly clean industries sited in locations that don't threaten our air, water, natural and coastal lands, or our communities. The Legislature made a serious mistake when it adopted the advanced manufacturing exemption to CEQA.

Thank you for working to correct this mistake.`;

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(50, "Message must be at least 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const SenatorContactForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verifiedAddress, setVerifiedAddress] = useState("");
  const [zip, setZip] = useState("");
  const [campaignSource, setCampaignSource] = useState("direct");

  useEffect(() => {
    const addr = sessionStorage.getItem("verified_address") || "";
    setVerifiedAddress(addr);
    const zipMatch = addr.match(/\b(\d{5})\b/);
    if (zipMatch) setZip(zipMatch[1]);
    setCampaignSource(sessionStorage.getItem("campaign_source") || "direct");
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: DEFAULT_MESSAGE,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const submissionId = crypto.randomUUID();
      const idempotencyKey = `senator-${submissionId}`;

      // Store submission in database
      await supabase.from("contact_submissions").insert({
        id: submissionId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        address: verifiedAddress || null,
        zip: zip || null,
        message: data.message,
        source: campaignSource,
      });

      // Send senator notification
      const { error: senatorError } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "senator-notification",
          idempotencyKey,
          templateData: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            address: verifiedAddress,
            zip,
            message: data.message,
          },
        },
      });

      if (senatorError) throw senatorError;

      // Send confirmation to user
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "take-action-confirmation",
          recipientEmail: data.email,
          idempotencyKey: `confirm-${idempotencyKey}`,
          templateData: {
            firstName: data.firstName,
          },
        },
      });

      setSubmitted(true);
      toast.success("Your message has been sent to Senator Blakespear!");
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card border border-border rounded-sm p-8 text-center">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={20} className="text-primary" />
        </div>
        <h3 className="font-heading text-xl uppercase mb-2">Message Sent!</h3>
        <p className="text-sm text-muted-foreground">
          Thank you for contacting Senator Blakespear. A confirmation has been sent to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-sm p-6">
      <h2 className="font-heading text-lg uppercase tracking-wider text-primary mb-1">
        Send Your Message
      </h2>
      <p className="text-xs text-muted-foreground mb-5">
        The letter below is ready to send. Feel free to personalize it, but please keep the core message about SB 954 and CEQA.
      </p>

      {verifiedAddress && (
        <div className="bg-primary/10 border-l-3 border-primary p-3 mb-5 rounded-sm">
          <p className="text-xs font-semibold text-foreground">
            Verified constituent address: {verifiedAddress}
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Your Message to Senator Blakespear</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={14}
                    className="text-sm leading-relaxed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full font-heading uppercase tracking-wider"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Sending…
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SenatorContactForm;
