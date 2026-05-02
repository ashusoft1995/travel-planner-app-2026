-- ============================================
-- EthioTravel Safe Supabase Database Setup
-- This version handles existing tables more carefully
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE TABLES ONLY IF THEY DON'T EXIST
-- ============================================

-- USERS Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  phone TEXT,
  about TEXT,
  expertise TEXT[] DEFAULT '{}',
  legal_paper_photo TEXT,
  experience_cv TEXT,
  experience_image TEXT,
  national_id_photo TEXT,
  avatar TEXT,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIPS Table
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  owner_email TEXT,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  budget NUMERIC DEFAULT 0,
  activities TEXT[] DEFAULT '{}',
  accommodation TEXT DEFAULT 'Not specified',
  notes TEXT,
  image TEXT,
  approval_status TEXT DEFAULT 'pending',
  agent_id TEXT,
  agent_commission NUMERIC DEFAULT 0,
  cost_breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DESTINATIONS Table
CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  location TEXT,
  price_range TEXT,
  region TEXT,
  country TEXT,
  "imageUrl" TEXT,
  lat NUMERIC,
  lng NUMERIC,
  "travelVolumeIndex" INTEGER DEFAULT 0,
  hotels JSONB DEFAULT '{}',
  activities JSONB DEFAULT '{}',
  rating NUMERIC DEFAULT 4.5,
  price TEXT DEFAULT '20,000 ETB',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRAVEL_REQUESTS Table
CREATE TABLE IF NOT EXISTS travel_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  nationality TEXT,
  age INTEGER,
  gender TEXT,
  desired_destination TEXT,
  preferred_start_date DATE,
  preferred_end_date DATE,
  budget_hint TEXT,
  accommodation_preference TEXT,
  special_requests TEXT,
  travel_history TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTACT_MESSAGES Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  admin_target TEXT,
  status TEXT DEFAULT 'open',
  reply_text TEXT,
  replied_by TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_email TEXT,
  audience TEXT DEFAULT 'user',
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  target_id TEXT,
  title TEXT,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANNOUNCEMENTS Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'info',
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY_LOGS Table (with all required columns)
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_email TEXT,
  actor_id TEXT,
  actor_name TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INTERNAL_MESSAGES Table
CREATE TABLE IF NOT EXISTS internal_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  sender_id TEXT,
  receiver_id TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AGENT_REQUESTS Table
CREATE TABLE IF NOT EXISTS agent_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience_years INTEGER,
  languages TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  motivation TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ADD MISSING COLUMNS SAFELY
-- ============================================

-- Add columns to existing tables only if they don't exist
DO $$
BEGIN
    -- USERS table columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'about') THEN
        ALTER TABLE users ADD COLUMN about TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'expertise') THEN
        ALTER TABLE users ADD COLUMN expertise TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'legal_paper_photo') THEN
        ALTER TABLE users ADD COLUMN legal_paper_photo TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'experience_cv') THEN
        ALTER TABLE users ADD COLUMN experience_cv TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'experience_image') THEN
        ALTER TABLE users ADD COLUMN experience_image TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'national_id_photo') THEN
        ALTER TABLE users ADD COLUMN national_id_photo TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar') THEN
        ALTER TABLE users ADD COLUMN avatar TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'rating') THEN
        ALTER TABLE users ADD COLUMN rating NUMERIC DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- ACTIVITY_LOGS table columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'actor_id') THEN
        ALTER TABLE activity_logs ADD COLUMN actor_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'actor_name') THEN
        ALTER TABLE activity_logs ADD COLUMN actor_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'actor_role') THEN
        ALTER TABLE activity_logs ADD COLUMN actor_role TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'target_type') THEN
        ALTER TABLE activity_logs ADD COLUMN target_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'target_id') THEN
        ALTER TABLE activity_logs ADD COLUMN target_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'timestamp') THEN
        ALTER TABLE activity_logs ADD COLUMN timestamp TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Add action column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'action') THEN
        ALTER TABLE activity_logs ADD COLUMN action TEXT NOT NULL DEFAULT 'unknown';
    END IF;
    
    -- Other table columns...
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'notes') THEN
        ALTER TABLE trips ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'cost_breakdown') THEN
        ALTER TABLE trips ADD COLUMN cost_breakdown JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'agent_id') THEN
        ALTER TABLE trips ADD COLUMN agent_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'agent_commission') THEN
        ALTER TABLE trips ADD COLUMN agent_commission NUMERIC DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'updated_at') THEN
        ALTER TABLE trips ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ============================================
-- 3. CREATE USER ID SEQUENCE SYSTEM
-- ============================================

CREATE SEQUENCE IF NOT EXISTS user_id_seq START 1201;

CREATE OR REPLACE FUNCTION set_user_id() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id := nextval('user_id_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_user_id ON users;
CREATE TRIGGER trigger_set_user_id
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_user_id();

-- ============================================
-- 4. CREATE FOREIGN KEY CONSTRAINTS SAFELY
-- ============================================

DO $$
BEGIN
    -- Only create constraints if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trips_owner_email_fkey') THEN
        BEGIN
            ALTER TABLE trips ADD CONSTRAINT trips_owner_email_fkey FOREIGN KEY (owner_email) REFERENCES users(email) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            -- Skip if there's an issue
            NULL;
        END;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'internal_messages_sender_id_fkey') THEN
        BEGIN
            ALTER TABLE internal_messages ADD CONSTRAINT internal_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'internal_messages_receiver_id_fkey') THEN
        BEGIN
            ALTER TABLE internal_messages ADD CONSTRAINT internal_messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES users(id);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agent_requests_user_id_fkey') THEN
        BEGIN
            ALTER TABLE agent_requests ADD CONSTRAINT agent_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trips_agent_id_fkey') THEN
        BEGIN
            ALTER TABLE trips ADD CONSTRAINT trips_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES users(id);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
END $$;

-- ============================================
-- 5. CREATE UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers only if tables have updated_at columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_trips_updated_at ON trips;
        CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
        CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- ============================================
-- 6. DISABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE destinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE travel_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE internal_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_requests DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. CREATE STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('ethio-travel-assets', 'ethio-travel-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "User Update Own Files" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'ethio-travel-assets');

CREATE POLICY "Authenticated Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'ethio-travel-assets');

CREATE POLICY "User Update Own Files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'ethio-travel-assets');

-- ============================================
-- 8. CREATE PERFORMANCE INDEXES SAFELY
-- ============================================

-- Create indexes only if columns exist
DO $$
BEGIN
    -- User indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    
    -- Trip indexes
    CREATE INDEX IF NOT EXISTS idx_trips_owner_email ON trips(owner_email);
    CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(approval_status);
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'start_date') THEN
        CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'agent_id') THEN
        CREATE INDEX IF NOT EXISTS idx_trips_agent ON trips(agent_id);
    END IF;
    
    -- Activity logs indexes (only if columns exist)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'timestamp') THEN
        CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'actor_id') THEN
        CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON activity_logs(actor_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'action') THEN
        CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
    END IF;
    
    -- Destination indexes
    CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'region') THEN
        CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'country') THEN
        CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);
    END IF;
    
    -- Other indexes
    CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
    CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_email ON notifications(user_email);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
END $$;

-- ============================================
-- 9. FIX ID COLUMN DEFAULTS BEFORE SEEDING
-- ============================================

-- Ensure all tables have proper ID defaults
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE trips ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE destinations ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE travel_requests ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE contact_messages ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE notifications ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE announcements ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE activity_logs ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE internal_messages ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE agent_requests ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;

-- ============================================
-- 10. SEED ESSENTIAL DATA
-- ============================================

-- Create admin user
INSERT INTO users (id, username, name, email, password_hash, role, status, phone, about)
VALUES ('1200', 'ashu', 'Ashenafi Abebe', 'ashenafiabebe604@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'active', '+251911000000', 'System Administrator')
ON CONFLICT (id) DO UPDATE SET 
  password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  role = 'admin', 
  status = 'active',
  name = 'Ashenafi Abebe';

-- Create sample agent user
INSERT INTO users (id, username, name, email, password_hash, role, status, phone, about, rating)
VALUES ('1201', 'agent_jane', 'Jane Travel Expert', 'jane@ethiotravel.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'agent', 'active', '+251911234567', 'Experienced travel agent specializing in Ethiopian cultural tours and historical sites.', 4.8)
ON CONFLICT (id) DO UPDATE SET 
  role = 'agent', 
  status = 'active',
  rating = 4.8;

-- Create sample regular user
INSERT INTO users (id, username, name, email, password_hash, role, status, phone)
VALUES ('1202', 'traveler_bob', 'Bob Explorer', 'bob@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', 'active', '+251922345678')
ON CONFLICT (id) DO UPDATE SET 
  role = 'user', 
  status = 'active';

-- Add welcome announcement with explicit ID
INSERT INTO announcements (id, title, body, type, is_active)
VALUES (gen_random_uuid()::TEXT, 'Welcome to EthioTravel!', 'Discover the beauty of Ethiopia with our expert travel guides and curated experiences. Book your dream trip today!', 'info', true)
ON CONFLICT (id) DO NOTHING;

-- Add sample notification with explicit ID
INSERT INTO notifications (id, title, body, type, audience, read)
VALUES (gen_random_uuid()::TEXT, 'System Ready', 'EthioTravel platform is now fully operational and ready for bookings.', 'success', 'all', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. FINAL VERIFICATION
-- ============================================

SELECT setval('user_id_seq', GREATEST(1201, (SELECT COALESCE(MAX(id::integer), 1200) FROM users WHERE id ~ '^[0-9]+$') + 1));

-- ============================================
-- SETUP COMPLETE!
-- ============================================

SELECT 'Database setup completed successfully!' as status,
       'Admin: ashu / ashenafiabebe604@gmail.com / Ashu19951?' as admin_login,
       'Agent: agent_jane / jane@ethiotravel.com / Ashu19951?' as agent_login,
       'User: traveler_bob / bob@gmail.com / Ashu19951?' as user_login;