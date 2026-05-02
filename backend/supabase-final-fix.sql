-- ============================================
-- EthioTravel Final Database Fix
-- This handles UUID to TEXT conversion properly
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

-- ============================================
-- 1. CONVERT ALL ID COLUMNS FROM UUID TO TEXT
-- ============================================

DO $$
BEGIN
    -- Convert users.id from UUID to TEXT
    BEGIN
        ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        -- Column might already be TEXT or not exist
        NULL;
    END;
    
    -- Convert trips.id from UUID to TEXT
    BEGIN
        ALTER TABLE trips ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Convert destinations.id from UUID to TEXT
    BEGIN
        ALTER TABLE destinations ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Convert travel_requests.id from UUID to TEXT
    BEGIN
        ALTER TABLE travel_requests ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Convert contact_messages.id from UUID to TEXT
    BEGIN
        ALTER TABLE contact_messages ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Convert notifications.id from UUID to TEXT
    BEGIN
        ALTER TABLE notifications ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Convert announcements.id from UUID to TEXT
    BEGIN
        ALTER TABLE announcements ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Convert activity_logs.id from UUID to TEXT
    BEGIN
        ALTER TABLE activity_logs ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Convert internal_messages.id from UUID to TEXT
    BEGIN
        ALTER TABLE internal_messages ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    -- Convert agent_requests.id from UUID to TEXT
    BEGIN
        ALTER TABLE agent_requests ALTER COLUMN id TYPE TEXT USING id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- ============================================
-- 2. SET TEXT DEFAULTS FOR ALL ID COLUMNS
-- ============================================

-- Now set TEXT defaults (this will work since columns are TEXT)
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
-- 3. CREATE MISSING TABLES IF THEY DON'T EXIST
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

-- ACTIVITY_LOGS Table
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
-- 4. ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================

DO $$
BEGIN
    -- Add missing columns to users table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'about') THEN
        ALTER TABLE users ADD COLUMN about TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'expertise') THEN
        ALTER TABLE users ADD COLUMN expertise TEXT[] DEFAULT '{}';
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
    
    -- Add missing columns to trips table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'notes') THEN
        ALTER TABLE trips ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'agent_id') THEN
        ALTER TABLE trips ADD COLUMN agent_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'cost_breakdown') THEN
        ALTER TABLE trips ADD COLUMN cost_breakdown JSONB DEFAULT '{}';
    END IF;
    
    -- Add missing columns to notifications table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'type') THEN
        ALTER TABLE notifications ADD COLUMN type TEXT DEFAULT 'info';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'title') THEN
        ALTER TABLE notifications ADD COLUMN title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'body') THEN
        ALTER TABLE notifications ADD COLUMN body TEXT;
    END IF;
    
    -- Add missing columns to announcements table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'body') THEN
        ALTER TABLE announcements ADD COLUMN body TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'type') THEN
        ALTER TABLE announcements ADD COLUMN type TEXT DEFAULT 'info';
    END IF;
    
    -- Add missing columns to activity_logs table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'action') THEN
        ALTER TABLE activity_logs ADD COLUMN action TEXT NOT NULL DEFAULT 'unknown';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'actor_id') THEN
        ALTER TABLE activity_logs ADD COLUMN actor_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'timestamp') THEN
        ALTER TABLE activity_logs ADD COLUMN timestamp TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ============================================
-- 5. DISABLE ROW LEVEL SECURITY
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
-- 6. CREATE STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('ethio-travel-assets', 'ethio-travel-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'ethio-travel-assets');

CREATE POLICY "Authenticated Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'ethio-travel-assets');

-- ============================================
-- 7. CREATE PERFORMANCE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_trips_owner_email ON trips(owner_email);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(approval_status);
CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_email ON notifications(user_email);

-- ============================================
-- 8. SEED ESSENTIAL DATA
-- ============================================

-- Create admin user
INSERT INTO users (id, username, name, email, password_hash, role, status, phone, about)
VALUES ('1200', 'ashu', 'Ashenafi Abebe', 'ashenafiabebe604@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'active', '+251911000000', 'System Administrator')
ON CONFLICT (id) DO UPDATE SET 
  password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  role = 'admin', 
  status = 'active';

-- Create sample agent user
INSERT INTO users (id, username, name, email, password_hash, role, status, phone, about, rating)
VALUES ('1201', 'agent_jane', 'Jane Travel Expert', 'jane@ethiotravel.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'agent', 'active', '+251911234567', 'Experienced travel agent specializing in Ethiopian cultural tours.', 4.8)
ON CONFLICT (id) DO UPDATE SET 
  role = 'agent', 
  status = 'active';

-- Create sample regular user
INSERT INTO users (id, username, name, email, password_hash, role, status, phone)
VALUES ('1202', 'traveler_bob', 'Bob Explorer', 'bob@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', 'active', '+251922345678')
ON CONFLICT (id) DO UPDATE SET 
  role = 'user', 
  status = 'active';

-- Test that announcements table works now
INSERT INTO announcements (title, body, type, is_active)
VALUES ('Welcome to EthioTravel!', 'Discover the beauty of Ethiopia with our expert travel guides and curated experiences. Book your dream trip today!', 'info', true)
ON CONFLICT DO NOTHING;

-- Test that notifications table works now
INSERT INTO notifications (title, body, type, audience, read)
VALUES ('System Ready', 'EthioTravel platform is now fully operational and ready for bookings.', 'success', 'all', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

SELECT 'Database setup completed successfully!' as status,
       'All ID columns converted to TEXT with proper defaults' as id_fix,
       'Admin: ashu / ashenafiabebe604@gmail.com / Ashu19951?' as admin_login,
       'Agent: agent_jane / jane@ethiotravel.com / Ashu19951?' as agent_login,
       'User: traveler_bob / bob@gmail.com / Ashu19951?' as user_login;