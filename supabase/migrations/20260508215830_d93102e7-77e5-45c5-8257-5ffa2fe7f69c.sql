CREATE TABLE IF NOT EXISTS public.channel_costs (
  channel TEXT PRIMARY KEY,
  amount_spent NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_sent INTEGER NOT NULL DEFAULT 0,
  sent_at DATE,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.channel_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can read channel costs"
ON public.channel_costs FOR SELECT
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage channel costs"
ON public.channel_costs FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.get_clicks_by_source()
RETURNS TABLE(channel text, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(trim(coalesce(source, 'direct'))) AS channel, count(*)::bigint
  FROM public.campaign_visits
  GROUP BY 1
  ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_letters_by_source()
RETURNS TABLE(channel text, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(trim(coalesce(source, 'direct'))) AS channel, count(*)::bigint
  FROM public.contact_submissions
  GROUP BY 1
  ORDER BY 2 DESC;
$$;