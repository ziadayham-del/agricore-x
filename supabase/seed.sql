
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

DO $$
DECLARE
  test_farm_id UUID := '00000000-0000-0000-0000-000000000001';
  n1 UUID := '00000000-0000-0000-0000-000000000011';
  n2 UUID := '00000000-0000-0000-0000-000000000012';
  n3 UUID := '00000000-0000-0000-0000-000000000013';
  c1 UUID := '00000000-0000-0000-0000-000000000021';
  
  s_soil UUID := '00000000-0000-0000-0000-000000000031';
  s_tank UUID := '00000000-0000-0000-0000-000000000032';
  
  hr INT;
BEGIN
  -- Insert Sensors
  INSERT INTO public.sensors (id, node_id, type, name, unit) VALUES
  (s_soil, n2, 'soil_moisture', 'Bed 1 Soil', '%'),
  (s_tank, n2, 'tank_level', 'Main Tank', '%')
  ON CONFLICT DO NOTHING;

  -- Insert 24 hours of sensor readings
  FOR hr IN 0..23 LOOP
    INSERT INTO public.sensor_readings (farm_id, node_id, sensor_id, value, unit, recorded_at) VALUES 
    (test_farm_id, n2, s_soil, 55 + (RANDOM() * 10), '%', NOW() - (hr || ' hours')::interval),
    (test_farm_id, n2, s_tank, 80 + (RANDOM() * 5), '%', NOW() - (hr || ' hours')::interval);
  END LOOP;
  
  -- Power readings
  FOR hr IN 0..23 LOOP
    INSERT INTO public.power_readings (farm_id, source, power, energy_wh, recorded_at) VALUES
    (test_farm_id, 'solar', 5000 + (RANDOM() * 500), 5000, NOW() - (hr || ' hours')::interval),
    (test_farm_id, 'battery', 1000 + (RANDOM() * 100), 1000, NOW() - (hr || ' hours')::interval);
  END LOOP;
  
  -- Events
  INSERT INTO public.events (farm_id, node_id, event_type, severity, message, created_at) VALUES
  (test_farm_id, n2, 'PUMP_ON', 'low', 'Irrigation pump activated', NOW() - interval '2 minutes'),
  (test_farm_id, n1, 'CROP_IMAGE_ANALYZED', 'low', 'Image analysis complete for Tomato', NOW() - interval '4 minutes'),
  (test_farm_id, n1, 'NODE_HEARTBEAT', 'low', 'System heartbeat OK', NOW() - interval '8 minutes');
  
  -- Crop tasks
  INSERT INTO public.crop_tasks (crop_id, title, description, due_at, priority) VALUES
  (c1, 'Apply fertilizer', 'Next: Irrigation', NOW() + interval '1 day', 'high');
  
  -- Crop health
  INSERT INTO public.crop_health_scores (crop_id, score, confidence, source) VALUES
  (c1, 92, 0.85, 'Groq AI');
END $$;
