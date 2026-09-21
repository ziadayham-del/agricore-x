CREATE TYPE power_source AS ENUM ('solar', 'battery', 'grid', 'load');
CREATE TYPE event_severity AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE public.power_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    source power_source NOT NULL,
    voltage NUMERIC,
    current NUMERIC,
    power NUMERIC NOT NULL,
    energy_wh NUMERIC,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    node_id UUID REFERENCES public.nodes(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    severity event_severity NOT NULL DEFAULT 'low',
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);