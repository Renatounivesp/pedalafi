-- Table for Pilot Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  level TEXT DEFAULT 'Recruta',
  total_km FLOAT DEFAULT 0,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table for Exploration Logs (Telemetry)
CREATE TABLE IF NOT EXISTS exploration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  km FLOAT NOT NULL,
  duration TEXT NOT NULL, -- Format HH:MM:SS
  path JSONB, -- Array of coordinates [[lat, lng], ...]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
