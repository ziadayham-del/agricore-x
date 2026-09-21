const fs = require('fs');
const path = require('path');

const migrations = {
  'supabase/migrations/001_create_farms.sql': `CREATE TABLE public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,

  'supabase/migrations/002_create_users_and_members.sql': `CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.farm_members (
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (farm_id, user_id)
);`,

  'supabase/migrations/003_create_nodes.sql': `CREATE TYPE node_type AS ENUM ('master', 'agriculture', 'power', 'roof', 'security', 'hmi');
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
);`,

  'supabase/migrations/004_create_sensors.sql': `CREATE TYPE sensor_type AS ENUM ('soil_moisture', 'temperature', 'humidity', 'light', 'tank_level', 'voltage', 'current');

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
CREATE INDEX idx_sensor_readings_node_time ON public.sensor_readings(node_id, recorded_at);`,

  'supabase/migrations/005_create_actuators.sql': `CREATE TYPE actuator_type AS ENUM ('pump', 'solenoid', 'humidifier', 'lighting', 'roof', 'relay');

CREATE TABLE public.actuators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    type actuator_type NOT NULL,
    name TEXT NOT NULL,
    safety_state BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,

  'supabase/migrations/006_create_crops.sql': `CREATE TABLE public.crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    variety TEXT,
    field_name TEXT NOT NULL,
    planted_at TIMESTAMPTZ NOT NULL,
    expected_harvest_at TIMESTAMPTZ NOT NULL,
    current_stage TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.crop_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_at TIMESTAMPTZ NOT NULL,
    priority TEXT NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.crop_health_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    confidence NUMERIC,
    source TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.crop_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    health_score INTEGER,
    ai_analysis_id UUID
);`,

  'supabase/migrations/007_create_events.sql': `CREATE TYPE power_source AS ENUM ('solar', 'battery', 'grid', 'load');
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
);`,

  'supabase/migrations/008_create_rls_policies.sql': `ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actuators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- user_profiles: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);

-- farm_members: Users can read memberships for farms they are a member of
CREATE POLICY "Users can read own memberships" ON public.farm_members FOR SELECT USING (user_id = auth.uid());

-- farms: Users can read farms they are members of
CREATE POLICY "Users can read own farms" ON public.farms FOR SELECT USING (EXISTS (SELECT 1 FROM public.farm_members WHERE farm_id = public.farms.id AND user_id = auth.uid()));

-- nodes: Users can read nodes in their farms
CREATE POLICY "Users can read farm nodes" ON public.nodes FOR SELECT USING (EXISTS (SELECT 1 FROM public.farm_members WHERE farm_id = public.nodes.farm_id AND user_id = auth.uid()));

-- sensors: Users can read sensors of nodes in their farms
CREATE POLICY "Users can read farm sensors" ON public.sensors FOR SELECT USING (EXISTS (SELECT 1 FROM public.nodes n JOIN public.farm_members fm ON n.farm_id = fm.farm_id WHERE n.id = public.sensors.node_id AND fm.user_id = auth.uid()));

-- sensor_readings: Users can read readings in their farms
CREATE POLICY "Users can read farm sensor readings" ON public.sensor_readings FOR SELECT USING (EXISTS (SELECT 1 FROM public.farm_members WHERE farm_id = public.sensor_readings.farm_id AND user_id = auth.uid()));

-- actuators: Users can read actuators of nodes in their farms
CREATE POLICY "Users can read farm actuators" ON public.actuators FOR SELECT USING (EXISTS (SELECT 1 FROM public.nodes n JOIN public.farm_members fm ON n.farm_id = fm.farm_id WHERE n.id = public.actuators.node_id AND fm.user_id = auth.uid()));

-- crops: Users can read crops in their farms
CREATE POLICY "Users can read farm crops" ON public.crops FOR SELECT USING (EXISTS (SELECT 1 FROM public.farm_members WHERE farm_id = public.crops.farm_id AND user_id = auth.uid()));

-- crop_tasks: Users can read tasks of crops in their farms
CREATE POLICY "Users can read farm crop tasks" ON public.crop_tasks FOR SELECT USING (EXISTS (SELECT 1 FROM public.crops c JOIN public.farm_members fm ON c.farm_id = fm.farm_id WHERE c.id = public.crop_tasks.crop_id AND fm.user_id = auth.uid()));

-- crop_health_scores: Users can read health scores of crops in their farms
CREATE POLICY "Users can read farm crop health scores" ON public.crop_health_scores FOR SELECT USING (EXISTS (SELECT 1 FROM public.crops c JOIN public.farm_members fm ON c.farm_id = fm.farm_id WHERE c.id = public.crop_health_scores.crop_id AND fm.user_id = auth.uid()));

-- crop_images: Users can read images of crops in their farms
CREATE POLICY "Users can read farm crop images" ON public.crop_images FOR SELECT USING (EXISTS (SELECT 1 FROM public.crops c JOIN public.farm_members fm ON c.farm_id = fm.farm_id WHERE c.id = public.crop_images.crop_id AND fm.user_id = auth.uid()));

-- power_readings: Users can read power readings in their farms
CREATE POLICY "Users can read farm power readings" ON public.power_readings FOR SELECT USING (EXISTS (SELECT 1 FROM public.farm_members WHERE farm_id = public.power_readings.farm_id AND user_id = auth.uid()));

-- events: Users can read events in their farms
CREATE POLICY "Users can read farm events" ON public.events FOR SELECT USING (EXISTS (SELECT 1 FROM public.farm_members WHERE farm_id = public.events.farm_id AND user_id = auth.uid()));`,

  'supabase/seed.sql': `
-- Note: User auth records must exist in auth.users, which is Supabase managed. 
-- For this seed, we assume anonymous mock inserts or test user IDs if auth is bypassed in dev.
-- Let's create a known test user uuid to link our mock data.
DO $$
DECLARE
  test_farm_id UUID := '00000000-0000-0000-0000-000000000001';
  test_user_id UUID := '00000000-0000-0000-0000-000000000002';
  n1 UUID := '00000000-0000-0000-0000-000000000011';
  n2 UUID := '00000000-0000-0000-0000-000000000012';
  n3 UUID := '00000000-0000-0000-0000-000000000013';
  n4 UUID := '00000000-0000-0000-0000-000000000014';
  n5 UUID := '00000000-0000-0000-0000-000000000015';
BEGIN
  -- We skip auth.users insertion here because seed.sql runs under postgres role, 
  -- but usually we should use supabase auth API to create users. We'll insert into user_profiles directly for structural mapping (this will fail foreign key in real Supabase unless auth.users has it, but it's okay for offline mock).
  -- Actually, to not break foreign key in seed, we just insert into auth.users.
  
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token) 
  VALUES (test_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test@agricore.local', '', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '') ON CONFLICT DO NOTHING;

  INSERT INTO public.farms (id, name, location_name) VALUES (test_farm_id, 'Main Farm', 'Greenhouse Valley') ON CONFLICT DO NOTHING;
  
  INSERT INTO public.user_profiles (id, email, full_name) VALUES (test_user_id, 'test@agricore.local', 'Test User') ON CONFLICT DO NOTHING;
  INSERT INTO public.farm_members (farm_id, user_id, role) VALUES (test_farm_id, test_user_id, 'owner') ON CONFLICT DO NOTHING;

  -- Nodes
  INSERT INTO public.nodes (id, farm_id, node_code, type, status, name) VALUES 
  (n1, test_farm_id, 'N01', 'master', 'online', 'Master Node'),
  (n2, test_farm_id, 'N02', 'agriculture', 'online', 'Agri Node'),
  (n3, test_farm_id, 'N03', 'power', 'online', 'Power Node'),
  (n4, test_farm_id, 'N04', 'roof', 'online', 'Roof Node'),
  (n5, test_farm_id, 'N05', 'hmi', 'online', 'HMI Node')
  ON CONFLICT DO NOTHING;

  -- Crops
  INSERT INTO public.crops (id, farm_id, name, variety, field_name, planted_at, expected_harvest_at, current_stage, status) VALUES
  ('00000000-0000-0000-0000-000000000021', test_farm_id, 'Rice', 'Basmati', 'Field A', NOW() - INTERVAL '34 days', NOW() + INTERVAL '56 days', 'Vegetative', 'active'),
  ('00000000-0000-0000-0000-000000000022', test_farm_id, 'Tomato', 'Roma', 'Greenhouse 1', NOW() - INTERVAL '15 days', NOW() + INTERVAL '40 days', 'Flowering', 'active'),
  ('00000000-0000-0000-0000-000000000023', test_farm_id, 'Wheat', 'Winter', 'Field B', NOW() - INTERVAL '60 days', NOW() + INTERVAL '20 days', 'Grain Filling', 'active');
  
END $$;
`
};

for (const [filePath, content] of Object.entries(migrations)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(path.dirname(fullPath))) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created ' + filePath);
}
