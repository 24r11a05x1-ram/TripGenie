-- TripGenie Supabase PostgreSQL Schema & Row Level Security (RLS)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  origin TEXT NOT NULL,
  origin_place_id TEXT,
  origin_lat DOUBLE PRECISION,
  origin_lng DOUBLE PRECISION,
  destination TEXT NOT NULL,
  destination_place_id TEXT,
  destination_lat DOUBLE PRECISION,
  destination_lng DOUBLE PRECISION,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers INT DEFAULT 1,
  budget NUMERIC(10, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  travel_style TEXT[],
  food_preference TEXT,
  transportation TEXT,
  special_requirements TEXT,
  estimated_total_cost NUMERIC(10, 2),
  estimated_distance NUMERIC(10, 2),
  estimated_travel_time INT,
  is_public BOOLEAN DEFAULT FALSE,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Itinerary Days Table
CREATE TABLE IF NOT EXISTS itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  date DATE,
  title TEXT,
  weather_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category VARCHAR(50),
  description TEXT,
  place_id TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  start_time VARCHAR(20),
  end_time VARCHAR(20),
  duration_minutes INT DEFAULT 60,
  estimated_cost NUMERIC(10, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'INR',
  sequence_order INT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  place_id TEXT,
  cuisine TEXT,
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  rating NUMERIC(2, 1),
  estimated_price NUMERIC(10, 2) DEFAULT 0,
  food_preferences TEXT,
  sequence_order INT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_id ON trips(share_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON activities(itinerary_day_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_day_id ON restaurants(itinerary_day_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can view their own trips"
  ON trips FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert their own trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON trips FOR DELETE
  USING (auth.uid() = user_id);

-- Itinerary Days policies
CREATE POLICY "Days viewable if trip is viewable"
  ON itinerary_days FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_days.trip_id
      AND (trips.user_id = auth.uid() OR trips.is_public = TRUE)
    )
  );

CREATE POLICY "Days modifiable by trip owner"
  ON itinerary_days FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itinerary_days.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Activities policies
CREATE POLICY "Activities viewable if trip is viewable"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM itinerary_days
      JOIN trips ON trips.id = itinerary_days.trip_id
      WHERE itinerary_days.id = activities.itinerary_day_id
      AND (trips.user_id = auth.uid() OR trips.is_public = TRUE)
    )
  );

CREATE POLICY "Activities modifiable by trip owner"
  ON activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM itinerary_days
      JOIN trips ON trips.id = itinerary_days.trip_id
      WHERE itinerary_days.id = activities.itinerary_day_id
      AND trips.user_id = auth.uid()
    )
  );

-- Restaurants policies
CREATE POLICY "Restaurants viewable if trip is viewable"
  ON restaurants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM itinerary_days
      JOIN trips ON trips.id = itinerary_days.trip_id
      WHERE itinerary_days.id = restaurants.itinerary_day_id
      AND (trips.user_id = auth.uid() OR trips.is_public = TRUE)
    )
  );

CREATE POLICY "Restaurants modifiable by trip owner"
  ON restaurants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM itinerary_days
      JOIN trips ON trips.id = itinerary_days.trip_id
      WHERE itinerary_days.id = restaurants.itinerary_day_id
      AND trips.user_id = auth.uid()
    )
  );
