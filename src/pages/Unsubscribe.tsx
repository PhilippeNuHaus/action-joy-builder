import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://oztsxdkfhhumesajakod.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already_unsubscribed");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container max-w-md text-center">
          {status === "loading" && (
            <p className="text-muted-foreground">Verifying...</p>
          )}
          {status === "valid" && (
            <div className="space-y-4">
              <h1 className="font-heading text-2xl uppercase">Unsubscribe</h1>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to unsubscribe from email notifications?
              </p>
              <button
                onClick={handleUnsubscribe}
                className="bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-gold-dark transition-colors"
              >
                Confirm Unsubscribe
              </button>
            </div>
          )}
          {status === "success" && (
            <div className="space-y-2">
              <h1 className="font-heading text-2xl uppercase text-primary">Unsubscribed</h1>
              <p className="text-muted-foreground text-sm">You've been successfully unsubscribed.</p>
            </div>
          )}
          {status === "already_unsubscribed" && (
            <div className="space-y-2">
              <h1 className="font-heading text-2xl uppercase">Already Unsubscribed</h1>
              <p className="text-muted-foreground text-sm">This email has already been unsubscribed.</p>
            </div>
          )}
          {status === "invalid" && (
            <div className="space-y-2">
              <h1 className="font-heading text-2xl uppercase">Invalid Link</h1>
              <p className="text-muted-foreground text-sm">This unsubscribe link is invalid or expired.</p>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-2">
              <h1 className="font-heading text-2xl uppercase text-destructive">Error</h1>
              <p className="text-muted-foreground text-sm">Something went wrong. Please try again later.</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Unsubscribe;
