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

const DISTRICT_ID_FRAGMENT = "state:ca/sldu:38";

const fetchDivisionIdsByAddress = async (
  address: string,
  apiKey: string,
): Promise<string[]> => {
  const url = new URL("https://www.googleapis.com/civicinfo/v2/divisionsByAddress");
  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    console.error("Google Civic API error:", JSON.stringify(data));
    throw new Error("Google Civic API request failed");
  }

  const divisions = data?.divisions ?? {};
  return Object.keys(divisions);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_CIVIC_API_KEY");
    if (!apiKey) {
      throw new Error("GOOGLE_CIVIC_API_KEY is not configured");
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid address input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { address } = parsed.data;
    const divisionIds = await fetchDivisionIdsByAddress(address, apiKey);

    const inDistrict = divisionIds.some((id) =>
      id.toLowerCase().includes(DISTRICT_ID_FRAGMENT),
    );

    return new Response(JSON.stringify({ inDistrict }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("District validation error:", error);
    return new Response(
      JSON.stringify({ error: "Could not verify address", inDistrict: false }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});