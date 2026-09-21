ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Users can read farm events" ON public.events FOR SELECT USING (EXISTS (SELECT 1 FROM public.farm_members WHERE farm_id = public.events.farm_id AND user_id = auth.uid()));