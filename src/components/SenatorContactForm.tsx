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
import { lookupDistricts, ALL_CITIES } from "@/lib/district-map";

const DEFAULT_MESSAGE_BODY = `Dear Senator Blakespear,

I was very disappointed to learn that the State Legislature exempted "advanced manufacturing" projects from the California Environmental Quality Act (CEQA). This ill-advised exemption will lead to avoidable harm to our air and water quality, our communities, our coast, and our natural areas. Thank you for leading the effort by introducing SB 954 to repeal or limit the scope of this dangerous exemption.

CEQA is California's central law that provides the public with the right to know about the harms that industrial projects can impose on communities and our environment. It is designed to require that potential harms be disclosed before industrial projects are approved and that any significant harm be prevented or lessened. CEQA is common sense. Exempting industrial projects from this law directly threatens our health and the safety of our air and water.

I strongly encourage you to secure the strongest public health and environmental protections in your legislation to address the advanced manufacturing exemption.

Thanks again for your leadership on this urgent issue.

Sincerely,`;

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  city: z.string().min(1, "City/Town is required"),
  message: z.string().min(50, "Message must be at least 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const STORAGE_KEY = "rtk_form_data";
const OUT_OF_DISTRICT_MESSAGE =
  "Sorry — this campaign is for SD-38 constituents only. Your city isn't in the district.";

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
  const cityValue = form.watch("city");

  const cityDistricts = lookupDistricts(cityValue || "");
  const cityEntered = (cityValue || "").trim().length >= 2;
  const outOfDistrict = cityEntered && !cityDistricts.recognized;

  useEffect(() => {
    const currentMessage = form.getValues("message");
    const baseMessage = currentMessage.replace(/(Sincerely,)\s*\n?.*/s, "$1");
    const nameLine = firstName || lastName ? `\n${firstName} ${lastName}`.trimEnd() : "";
    form.setValue("message", baseMessage + nameLine, { shouldValidate: false, shouldDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName]);

  const onSubmit = async (data: FormValues) => {
    const districts = lookupDistricts(data.city);
    if (!districts.recognized) {
      toast.error(OUT_OF_DISTRICT_MESSAGE);
      return;
    }
    setSubmitting(true);
    try {
      const submissionId = crypto.randomUUID();

      let finalMessage = data.message;
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      if (fullName && finalMessage.includes("Sincerely,") && !finalMessage.includes(fullName)) {
        finalMessage = finalMessage.replace(/(Sincerely,)\s*$/, `$1\n${fullName}`);
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

      // Senator notification (primary recipient + team BCC)
      const recipients = [
        "senator.blakespear@senate.ca.gov",
        "philippe@nuhausdm.com",
      ];
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
              idempotencyKey: `blakespear-${submissionId}-${recipient}`,
              templateData,
            },
          });
        } catch (emailErr) {
          console.warn(`Senator notification to ${recipient} failed:`, emailErr);
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
                <FormLabel className="text-xs text-primary">Your Message to Senator Blakespear</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={14} className="text-sm leading-relaxed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {cityEntered && (
            outOfDistrict ? (
              <p className="text-sm text-destructive font-semibold text-center">
                {OUT_OF_DISTRICT_MESSAGE}
              </p>
            ) : (
              <p className="text-sm text-primary font-semibold text-center">
                Your letter will be sent to Senator Blakespear.
              </p>
            )
          )}

          <Button
            type="submit"
            disabled={submitting || outOfDistrict}
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
