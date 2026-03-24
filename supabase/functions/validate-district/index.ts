import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const requestSchema = z.object({
  address: z.string().min(1).max(500),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_CIVIC_API_KEY");
    if (!apiKey) {
      throw new Error("GOOGLE_CIVIC_API_KEY is not configured");
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid address input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { address } = parsed.data;
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&levels=administrativeArea1&roles=legislatorUpperBody&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Google Civic API error:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Could not verify address", inDistrict: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if any division contains CA state senate district 38
    const divisions = data.divisions || {};
    let inDistrict = false;

    for (const divisionId of Object.keys(divisions)) {
      // Division IDs look like: ocd-division/country:us/state:ca/sldu:38
      if (
        divisionId.includes("state:ca") &&
        divisionId.includes("sldu:38")
      ) {
        inDistrict = true;
        break;
      }
    }

    return new Response(
      JSON.stringify({ inDistrict }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("District validation error:", error);
    return new Response(
      JSON.stringify({ error: "Validation failed", inDistrict: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
