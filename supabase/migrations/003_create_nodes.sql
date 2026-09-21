CREATE TYPE node_type AS ENUM ('master', 'agriculture', 'power', 'roof', 'security', 'hmi');
CREATE TYPE node_status AS ENUM ('online', 'offline', 'warning');

CREATE TABLE public.nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    node_code TEXT NOT NULL,
    name TEXT NOT NULL,
    type node_type NOT NULL,
    firmware_version TEXT,
    status node_status NOT NULL DEFAULT 'offline',
    ip_address TEXT,
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);