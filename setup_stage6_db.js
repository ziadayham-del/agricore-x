const fs = require('fs');
const path = require('path');

const migration = `-- Migration 010: Stage 6 Optimizations (Indexes, Partitions, pg_cron)

-- 1. Create indexes for high-volume time-series querying
CREATE INDEX IF NOT EXISTS idx_sensor_readings_farm_time ON sensor_readings(farm_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_farm_time ON events(farm_id, created_at DESC);

-- 2. Create Rollup Tables
CREATE TABLE sensor_readings_hourly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    avg_temperature NUMERIC(5,2),
    avg_humidity NUMERIC(5,2),
    avg_soil_moisture NUMERIC(5,2),
    avg_light_intensity NUMERIC(8,2)
);
CREATE INDEX IF NOT EXISTS idx_sensor_hourly_farm_time ON sensor_readings_hourly(farm_id, recorded_at DESC);

CREATE TABLE sensor_readings_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    recorded_date DATE NOT NULL,
    avg_temperature NUMERIC(5,2),
    avg_humidity NUMERIC(5,2),
    avg_soil_moisture NUMERIC(5,2),
    avg_light_intensity NUMERIC(8,2)
);
CREATE INDEX IF NOT EXISTS idx_sensor_daily_farm_time ON sensor_readings_daily(farm_id, recorded_date DESC);

-- 3. Enable pg_cron (if running on a supported tier, otherwise this is a no-op / requires superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 4. Create Rollup Functions
CREATE OR REPLACE FUNCTION rollup_hourly_readings() RETURNS void AS $$
BEGIN
    INSERT INTO sensor_readings_hourly (farm_id, node_id, recorded_at, avg_temperature, avg_humidity, avg_soil_moisture, avg_light_intensity)
    SELECT 
        farm_id,
        node_id,
        date_trunc('hour', recorded_at) AS recorded_at,
        AVG(temperature),
        AVG(humidity),
        AVG(soil_moisture),
        AVG(light_intensity)
    FROM sensor_readings
    WHERE recorded_at >= date_trunc('hour', NOW() - INTERVAL '1 hour')
      AND recorded_at < date_trunc('hour', NOW())
    GROUP BY farm_id, node_id, date_trunc('hour', recorded_at)
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rollup_daily_readings() RETURNS void AS $$
BEGIN
    INSERT INTO sensor_readings_daily (farm_id, node_id, recorded_date, avg_temperature, avg_humidity, avg_soil_moisture, avg_light_intensity)
    SELECT 
        farm_id,
        node_id,
        date_trunc('day', recorded_at)::date AS recorded_date,
        AVG(avg_temperature),
        AVG(avg_humidity),
        AVG(avg_soil_moisture),
        AVG(avg_light_intensity)
    FROM sensor_readings_hourly
    WHERE recorded_at >= date_trunc('day', NOW() - INTERVAL '1 day')
      AND recorded_at < date_trunc('day', NOW())
    GROUP BY farm_id, node_id, date_trunc('day', recorded_at)::date
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 5. Schedule (Requires pg_cron)
-- SELECT cron.schedule('hourly_rollup', '0 * * * *', 'SELECT rollup_hourly_readings()');
-- SELECT cron.schedule('daily_rollup', '0 0 * * *', 'SELECT rollup_daily_readings()');

-- 6. Retention Policy Function (Delete raw data older than 30 days)
CREATE OR REPLACE FUNCTION purge_old_sensor_data() RETURNS void AS $$
BEGIN
    DELETE FROM sensor_readings WHERE recorded_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- SELECT cron.schedule('purge_old_data', '0 1 * * *', 'SELECT purge_old_sensor_data()');
`;

const dest = path.join(process.cwd(), 'supabase', 'migrations', '010_stage6_optimizations.sql');
fs.writeFileSync(dest, migration);
console.log('Created migration');
