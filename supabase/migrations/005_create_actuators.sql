CREATE TYPE actuator_type AS ENUM ('pump', 'solenoid', 'humidifier', 'lighting', 'roof', 'relay');

CREATE TABLE public.actuators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    type actuator_type NOT NULL,
    name TEXT NOT NULL,
    safety_state BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);