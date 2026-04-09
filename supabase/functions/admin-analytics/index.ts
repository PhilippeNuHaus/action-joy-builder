const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROJECT_ID = "a84fb3ac-c314-49f5-91d5-4c2d37d66e59";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { password, startDate, endDate } = await req.json();

    const adminPassword = Deno.env.get("ADMIN_DASHBOARD_PASSWORD");
    if (!adminPassword || password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = `https://api.lovable.dev/v1/projects/${PROJECT_ID}/analytics?startdate=${startDate}&enddate=${endDate}&granularity=daily`;
    console.log("Fetching analytics from:", url);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    console.log("Lovable API Response Status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("API error:", text);
      return new Response(JSON.stringify({ error: `Analytics API error: ${response.status}`, details: text }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const raw = await response.json();
    console.log("Raw API keys:", Object.keys(raw));

    // Flatten the nested Lovable API response into a simple format
    const extractValue = (obj: any) => {
      if (obj && typeof obj === "object" && "value" in obj) return obj.value;
      return obj ?? 0;
    };

    const metrics = raw.metrics ?? raw;
    const breakdowns = raw.breakdowns ?? raw;

    const flattenBreakdown = (category: any) => {
      if (!category) return [];
      // Handle {type: "page", data: [{page: "/", visitors: 10}]}
      if (category.data && Array.isArray(category.data)) return category.data;
      // Handle array directly
      if (Array.isArray(category)) return category;
      return [];
    };

    const result = {
      visitors: extractValue(metrics.visitors),
      pageviews: extractValue(metrics.pageviews),
      views_per_visit: extractValue(metrics.pageviewsPerVisit ?? metrics.views_per_visit),
      visit_duration: extractValue(metrics.sessionDuration ?? metrics.visit_duration ?? metrics.visitDuration),
      bounce_rate: extractValue(metrics.bounceRate ?? metrics.bounce_rate),
      top_pages: flattenBreakdown(breakdowns.page ?? breakdowns.top_pages ?? breakdowns.topPages),
      top_sources: flattenBreakdown(breakdowns.source ?? breakdowns.top_sources ?? breakdowns.topSources),
      top_devices: flattenBreakdown(breakdowns.device ?? breakdowns.top_devices ?? breakdowns.topDevices),
      top_countries: flattenBreakdown(breakdowns.country ?? breakdowns.top_countries ?? breakdowns.topCountries),
    };

    console.log("Flattened result:", JSON.stringify(result).substring(0, 300));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
