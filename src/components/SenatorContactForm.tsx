import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_MESSAGE = `Dear Senator Blakespear,

Thank you for authoring SB 954 to restore CEQA protections for communities impacted by advanced manufacturing facilities. I urge you to continue fighting to close the advanced manufacturing loophole that allows potentially dangerous industrial facilities to be built near homes and schools without environmental review.

Our communities deserve the right to know about toxic pollution risks in our neighborhoods. Please keep pushing for transparency and accountability.

Sincerely,`;

type FormStatus = "idle" | "sending" | "sent" | "error";

const SenatorContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [status, setStatus] = useState<FormStatus>("idle");

  useEffect(() => {
    const verified = sessionStorage.getItem("verified_address");
    if (verified) {
      setAddress(verified);
      // Try to extract zip from the address
      const zipMatch = verified.match(/\b(\d{5})(?:-\d{4})?\b/);
      if (zipMatch) setZip(zipMatch[1]);
    }
  }, []);

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    address.trim() &&
    message.trim() &&
    status !== "sending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");

    try {
      const id = crypto.randomUUID();

      // Send to senator
      const { error: senatorErr } = await supabase.functions.invoke(
        "send-transactional-email",
        {
          body: {
            templateName: "senator-notification",
            recipientEmail: "senator.blakespear@senate.ca.gov",
            idempotencyKey: `senator-msg-${id}`,
            templateData: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
              address: address.trim(),
              zip: zip.trim(),
              message: message.trim(),
            },
          },
        }
      );

      if (senatorErr) throw senatorErr;

      // Send confirmation to the user
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "take-action-confirmation",
          recipientEmail: email.trim(),
          idempotencyKey: `confirm-${id}`,
          templateData: { firstName: firstName.trim() },
        },
      });

      setStatus("sent");
      toast.success("Your message has been sent to Senator Blakespear!");
    } catch (err) {
      console.error("Send error:", err);
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-primary/30 bg-primary/5 p-8 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
          <CheckCircle2 className="text-primary" size={28} />
        </div>
        <h3 className="font-heading text-xl uppercase text-foreground">
          Message Sent!
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Your message has been delivered to Senator Blakespear's office. A
          confirmation has been sent to your email. Thank you for making your
          voice heard!
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setStatus("idle");
            setMessage(DEFAULT_MESSAGE);
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-border bg-card/40 p-5 space-y-4"
    >
      <h3 className="font-heading text-sm uppercase tracking-wider text-primary">
        Send a Message to Senator Blakespear
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-xs">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            disabled={status === "sending"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-xs">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Smith"
            disabled={status === "sending"}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          disabled={status === "sending"}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="address" className="text-xs">Street Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Encinitas, CA"
            disabled={status === "sending"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="zip" className="text-xs">ZIP Code</Label>
          <Input
            id="zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="92024"
            disabled={status === "sending"}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-xs">Your Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          disabled={status === "sending"}
          className="text-sm leading-relaxed"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle size={16} />
          Something went wrong. Please try again.
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!canSubmit}>
        {status === "sending" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send My Message"
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        Your message will be emailed directly to Senator Blakespear's office.
        You'll receive a confirmation copy at your email address.
      </p>
    </form>
  );
};

export default SenatorContactForm;
