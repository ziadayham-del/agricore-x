CREATE TABLE public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);