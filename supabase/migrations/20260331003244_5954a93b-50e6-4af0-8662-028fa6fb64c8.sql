
-- Campaign visit tracking table
CREATE TABLE public.campaign_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL,
  referrer text,
  user_agent text,
  device_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (visitors aren't authenticated)
CREATE POLICY "Anyone can log a campaign visit"
ON public.campaign_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow reads for analytics (service role only for security)
CREATE POLICY "Service role can read campaign visits"
ON public.campaign_visits
FOR SELECT
TO public
USING (auth.role() = 'service_role'::text);
