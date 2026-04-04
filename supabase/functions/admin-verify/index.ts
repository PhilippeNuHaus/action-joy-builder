import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "RightToKnowAdmin/1.0" },
    });
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // silent fail
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password, action } = await req.json();
    const expected = Deno.env.get("ADMIN_DASHBOARD_PASSWORD");

    if (!expected || password !== expected) {
      return new Response(JSON.stringify({ valid: false }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Geocode action — called separately to avoid timeout
    if (action === "geocode") {
      const { data: subs } = await supabase
        .from("contact_submissions")
        .select("id, address, zip");

      const results: Array<{ id: string; latitude: number; longitude: number }> = [];
      for (const s of subs || []) {
        if (s.address) {
          const coords = await geocodeAddress(s.address);
          if (coords) {
            results.push({ id: s.id, latitude: coords.lat, longitude: coords.lng });
          }
          await new Promise((r) => setTimeout(r, 1100));
        }
      }

      return new Response(JSON.stringify({ valid: true, geocoded: results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default: return stats
    const [visitsRes, submissionsRes, emailsRes] = await Promise.all([
      supabase.from("campaign_visits").select("source, created_at, latitude, longitude"),
      supabase.from("contact_submissions").select("first_name, last_name, email, source, created_at, address, zip"),
      supabase
        .from("email_send_log")
        .select("*")
        .eq("recipient_email", "senator.blakespear@senate.ca.gov"),
    ]);

    // Deduplicate emails by message_id
    const allEmails = emailsRes.data || [];
    const latestByMessageId = new Map<string, typeof allEmails[0]>();
    for (const row of allEmails) {
      const key = row.message_id || row.id;
      const existing = latestByMessageId.get(key);
      if (!existing || new Date(row.created_at) > new Date(existing.created_at)) {
        latestByMessageId.set(key, row);
      }
    }
    const dedupedEmails = Array.from(latestByMessageId.values());

    // Group visits by source
    const visitsBySource: Record<string, number> = {};
    for (const v of visitsRes.data || []) {
      visitsBySource[v.source] = (visitsBySource[v.source] || 0) + 1;
    }

    // Group submissions by source
    const submissionsBySource: Record<string, number> = {};
    for (const s of submissionsRes.data || []) {
      const src = s.source || "direct";
      submissionsBySource[src] = (submissionsBySource[src] || 0) + 1;
    }

    const allChannels = new Set([...Object.keys(visitsBySource), ...Object.keys(submissionsBySource)]);

    // Click locations
    const clickLocations = (visitsRes.data || [])
      .filter((v: any) => v.latitude && v.longitude)
      .map((v: any) => ({
        source: v.source,
        latitude: v.latitude,
        longitude: v.longitude,
        created_at: v.created_at,
      }));

    return new Response(
      JSON.stringify({
        valid: true,
        stats: {
          totalClicks: (visitsRes.data || []).length,
          clicksBySource: visitsBySource,
          totalSubmissions: (submissionsRes.data || []).length,
          submissions: submissionsRes.data || [],
          submissionsBySource,
          totalSenatorEmails: dedupedEmails.length,
          senatorEmails: dedupedEmails,
          channelsTracked: allChannels.size,
          clickLocations,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
