REVOKE EXECUTE ON FUNCTION public.get_clicks_by_source() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_letters_by_source() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.get_clicks_by_source() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_letters_by_source() TO service_role;