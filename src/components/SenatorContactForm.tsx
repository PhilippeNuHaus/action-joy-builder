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
import { ALL_CITIES } from "@/lib/district-map";

const DEFAULT_MESSAGE_BODY = `Dear Governor Newsom,

I am writing to you today to urge you to sign Senate Bill 954 (Blakespear) into law. SB 954 helps protect public health by safeguarding the air we breathe and the water we drink from toxic chemical and other pollutants.

When CEQA overhaul was implemented last year, concerns were raised about the toxic pollution loophole, and state leaders promised that there would be a fix in this legislative session. SB 954 is that fix.

A broad coalition of labor, environmental, environmental justice, public health, and Democratic Party organizations supports SB 954, and it's my understanding that there is no opposition from housing organizations.

It's simple: heavy industry – including facilities that use and can release toxic chemicals like arsenic, PFAS, and cyanide – should be subject to appropriate environmental review. These kinds of projects can cause tremendous harm to communities and schools if not appropriately reviewed, and the CEQA process is designed to identify safer alternatives.

I urge you to cement your legacy as a reformer who is both looking toward the future AND protecting our community from toxic pollution by signing SB 954 into law.

Thank you,`;

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  city: z.string().min(1, "City/Town is required"),
  message: z.string().min(50, "Message must be at least 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const STORAGE_KEY = "rtk_form_data";

const SenatorContactForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const saved = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const channel = (() => {
    try {
      return sessionStorage.getItem("utm_channel") || sessionStorage.getItem("campaign_source") || "";
    } catch {
      return "";
    }
  })();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: saved.firstName || "",
      lastName: saved.lastName || "",
      email: saved.email || "",
      city: saved.city || "",
      message: DEFAULT_MESSAGE_BODY + "\n",
    },
  });

  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");

  useEffect(() => {
    const currentMessage = form.getValues("message");
    const baseMessage = currentMessage.replace(/(Thank you,)\s*\n?.*/s, "$1");
    const nameLine = firstName || lastName ? `\n${firstName} ${lastName}`.trimEnd() : "";
    form.setValue("message", baseMessage + nameLine, { shouldValidate: false, shouldDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const submissionId = crypto.randomUUID();

      let finalMessage = data.message;
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      if (fullName && finalMessage.includes("Thank you,") && !finalMessage.includes(fullName)) {
        finalMessage = finalMessage.replace(/(Thank you,)\s*$/, `$1\n${fullName}`);
      }

      // Atomic insert — store city in the existing address column
      await supabase.from("contact_submissions").insert({
        id: submissionId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        address: data.city,
        zip: null,
        message: finalMessage,
        source: channel || "direct",
      });

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          city: data.city,
        })
      );

      // Letter notification (team inbox)
      const recipients = ["philippe@nuhausdm.com"];
      const templateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.city,
        zip: "",
        message: finalMessage,
      };
      for (const recipient of recipients) {
        try {
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "senator-notification",
              recipientEmail: recipient,
              idempotencyKey: `newsom-${submissionId}-${recipient}`,
              templateData,
            },
          });
        } catch (emailErr) {
          console.warn(`Letter notification to ${recipient} failed:`, emailErr);
        }
      }

      // Confirmation to user
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "take-action-confirmation",
            recipientEmail: data.email,
            idempotencyKey: `confirm-${submissionId}`,
            templateData: { firstName: data.firstName },
          },
        });
      } catch (emailErr) {
        console.warn("Confirmation email failed:", emailErr);
      }

      setSubmitted(true);
      toast.success("Your letter has been sent to Governor Newsom!");
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
        <h3 className="font-heading text-xl uppercase mb-2">Letter Sent!</h3>
        <p className="text-sm text-muted-foreground">
          Thank you for urging Governor Newsom to sign SB 954. A confirmation has been sent to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-sm p-6">
      <p className="text-xs text-muted-foreground mb-5">
        The letter below is ready to send. Feel free to personalize it, but please keep the core message about SB 954 and CEQA.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-primary">First Name</FormLabel>
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
                  <FormLabel className="text-xs text-primary">Last Name</FormLabel>
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
                <FormLabel className="text-xs text-primary">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} className="text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-primary">City / Town</FormLabel>
                <FormControl>
                  <>
                    <Input list="district-cities" placeholder="e.g. Encinitas" {...field} className="text-sm" />
                    <datalist id="district-cities">
                      {ALL_CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </>
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
                <FormLabel className="text-xs text-primary">Your Letter to Governor Newsom</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={14} className="text-sm leading-relaxed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-sm text-primary font-semibold text-center">
            Your letter will be sent to Governor Newsom.
          </p>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full font-heading uppercase tracking-wider animate-pulse-glow"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Sending…
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send Letter
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SenatorContactForm;
