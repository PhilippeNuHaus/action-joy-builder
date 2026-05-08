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
    const body = await req.json();
    const { password, action } = body;
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

    // Costs actions
    if (action === "get_costs") {
      const [costsRes, clicksRes, lettersRes] = await Promise.all([
        supabase.from("channel_costs").select("channel, amount_spent, amount_sent, sent_at"),
        supabase.rpc("get_clicks_by_source"),
        supabase.rpc("get_letters_by_source"),
      ]);
      const clicksMap = new Map<string, number>();
      for (const r of (clicksRes.data || []) as any[]) clicksMap.set(r.channel, Number(r.count));
      const lettersMap = new Map<string, number>();
      for (const r of (lettersRes.data || []) as any[]) lettersMap.set(r.channel, Number(r.count));
      const channels = new Set<string>();
      for (const r of (costsRes.data || []) as any[]) channels.add(r.channel);
      for (const k of clicksMap.keys()) channels.add(k);
      for (const k of lettersMap.keys()) channels.add(k);
      const costMap = new Map<string, any>();
      for (const r of (costsRes.data || []) as any[]) costMap.set(r.channel, r);
      const rows = Array.from(channels).map((channel) => {
        const c = costMap.get(channel);
        return {
          channel,
          amount_spent: c ? Number(c.amount_spent) : 0,
          amount_sent: c ? Number(c.amount_sent) : 0,
          sent_at: c?.sent_at ?? null,
          clicks: clicksMap.get(channel) || 0,
          letters: lettersMap.get(channel) || 0,
        };
      });
      return new Response(JSON.stringify({ valid: true, rows }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "upsert_cost") {
      const channel = String(body.channel || "").trim().toLowerCase();
      const amount_spent = Number(body.amount_spent);
      const amount_sent = parseInt(String(body.amount_sent), 10);
      if (!channel || !/^[a-z0-9-]+$/.test(channel) || !Number.isFinite(amount_spent) || amount_spent < 0 || !Number.isFinite(amount_sent) || amount_sent < 0) {
        return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const sent_at = body.sent_at ?? undefined;
      const upsertPayload: Record<string, unknown> = { channel, amount_spent, amount_sent, updated_at: new Date().toISOString() };
      if (sent_at !== undefined) upsertPayload.sent_at = sent_at || null;
      const { error } = await supabase.from("channel_costs").upsert(upsertPayload, { onConflict: "channel" });
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ valid: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete_cost") {
      const channel = String(body.channel || "").trim().toLowerCase();
      if (!channel) {
        return new Response(JSON.stringify({ error: "channel required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { error } = await supabase.from("channel_costs").delete().eq("channel", channel);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ valid: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

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
