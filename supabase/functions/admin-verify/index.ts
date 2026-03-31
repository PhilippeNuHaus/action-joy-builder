import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    const expected = Deno.env.get("ADMIN_DASHBOARD_PASSWORD");

    if (!expected || password !== expected) {
      return new Response(JSON.stringify({ valid: false }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Password correct — fetch stats
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const [visitsRes, submissionsRes, emailsRes] = await Promise.all([
      supabase.from("campaign_visits").select("source, created_at"),
      supabase.from("contact_submissions").select("first_name, last_name, email, created_at"),
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

    return new Response(
      JSON.stringify({
        valid: true,
        stats: {
          totalClicks: (visitsRes.data || []).length,
          clicksBySource: visitsBySource,
          totalSubmissions: (submissionsRes.data || []).length,
          submissions: submissionsRes.data || [],
          totalSenatorEmails: dedupedEmails.length,
          senatorEmails: dedupedEmails,
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
