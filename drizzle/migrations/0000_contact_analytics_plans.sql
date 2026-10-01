CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  company text,
  topic text NOT NULL,
  message text NOT NULL,
  client_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.contact_messages (client_hash, created_at);

CREATE TABLE public.site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL CHECK (event IN ('book_call_click','contact_form_start','contact_form_submit','plan_generated')),
  location text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.site_events TO service_role;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.site_events (event, created_at);

CREATE TABLE public.plan_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.plan_requests TO service_role;
ALTER TABLE public.plan_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.plan_requests (client_hash, created_at);

CREATE VIEW public.inquiry_insights WITH (security_invoker = true) AS
SELECT event, location, count(*) AS total, max(created_at) AS last_seen
FROM public.site_events GROUP BY event, location;
GRANT SELECT ON public.inquiry_insights TO service_role;