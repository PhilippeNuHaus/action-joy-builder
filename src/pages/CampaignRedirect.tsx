import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getDeviceType = (ua: string): string => {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|android.*mobile/i.test(ua)) return "mobile";
  return "desktop";
};

const SOURCE_MAP: Record<string, string> = {
  blakespear: "sms",
  sms: "sms",
  social: "social",
  fb: "social",
  ig: "social",
  email: "email",
  text: "sms",
};

const CampaignRedirect = () => {
  const { channel } = useParams<{ channel: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const logVisit = async () => {
      const source = SOURCE_MAP[channel || ""] || channel || "unknown";
      const userAgent = navigator.userAgent;
      const deviceType = getDeviceType(userAgent);
      const referrer = document.referrer || null;

      // Try to get approximate location for map plotting
      let latitude: number | null = null;
      let longitude: number | null = null;
      try {
        const geoRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.latitude && geo.longitude) {
            latitude = geo.latitude;
            longitude = geo.longitude;
          }
        }
      } catch {
        // silent - location is optional
      }

      try {
        await supabase.from("campaign_visits").insert({
          source,
          referrer,
          user_agent: userAgent,
          device_type: deviceType,
          latitude,
          longitude,
        });
      } catch (err) {
        console.error("Failed to log campaign visit:", err);
      }

      // Store source for form attribution
      sessionStorage.setItem("campaign_source", source);

      // Instant redirect to homepage
      navigate("/", { replace: true });
    };

    logVisit();
  }, [channel, navigate]);

  // Return nothing — redirect is instant
  return null;
};

export default CampaignRedirect;
