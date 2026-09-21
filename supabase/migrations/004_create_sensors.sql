CREATE TYPE sensor_type AS ENUM ('soil_moisture', 'temperature', 'humidity', 'light', 'tank_level', 'voltage', 'current');

CREATE TABLE public.sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    type sensor_type NOT NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    sensor_id UUID NOT NULL REFERENCES public.sensors(id) ON DELETE CASCADE,
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT
);
CREATE INDEX idx_sensor_readings_farm_time ON public.sensor_readings(farm_id, recorded_at);
CREATE INDEX idx_sensor_readings_node_time ON public.sensor_readings(node_id, recorded_at);