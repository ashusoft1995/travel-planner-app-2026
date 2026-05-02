-- ============================================
-- EthioTravel Complete Supabase Database Setup
-- Run this entire script in: Supabase Dashboard > SQL Editor
-- This script is safe to run multiple times (idempotent)
-- ============================================

-- ============================================
-- 1. CREATE ALL TABLES WITH IF NOT EXISTS
-- ============================================

-- USERS Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'user', 'agent', 'admin'
  status TEXT DEFAULT 'active', -- 'active', 'pending', 'suspended'
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
  approval_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
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
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'contacted', 'completed'
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
  status TEXT DEFAULT 'open', -- 'open', 'read', 'replied', 'closed'
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
  audience TEXT DEFAULT 'user', -- 'user', 'agent', 'admin', 'all'
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
  content TEXT, -- for backward compatibility
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
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================

-- Add missing columns to USERS table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS legal_paper_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_cv TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_image TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS national_id_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing columns to CONTACT_MESSAGES table
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS admin_target TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS reply_text TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS replied_by TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing columns to TRIPS table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS cost_breakdown JSONB DEFAULT '{}';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS agent_id TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS agent_commission NUMERIC DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing columns to NOTIFICATIONS table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'info';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS body TEXT;

-- Add missing columns to DESTINATIONS table
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS lat NUMERIC;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS lng NUMERIC;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS "travelVolumeIndex" INTEGER DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS hotels JSONB DEFAULT '{}';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS activities JSONB DEFAULT '{}';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.5;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS price TEXT DEFAULT '20,000 ETB';

-- Add missing columns to ANNOUNCEMENTS table
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'info';
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add missing columns to ACTIVITY_LOGS table
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS actor_id TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS actor_name TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS actor_role TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS target_type TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS timestamp TIMESTAMPTZ DEFAULT NOW();

-- Add missing columns to INTERNAL_MESSAGES table
ALTER TABLE internal_messages ADD COLUMN IF NOT EXISTS receiver_id TEXT;
ALTER TABLE internal_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- ============================================
-- 3. CREATE USER ID SEQUENCE SYSTEM
-- ============================================

-- Create sequence for numeric user IDs starting from 1201
CREATE SEQUENCE IF NOT EXISTS user_id_seq START 1201;

-- Create function to set user ID
CREATE OR REPLACE FUNCTION set_user_id() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id := nextval('user_id_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user ID
DROP TRIGGER IF EXISTS trigger_set_user_id ON users;
CREATE TRIGGER trigger_set_user_id
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_user_id();

-- ============================================
-- 4. FIX DATA TYPES AND CREATE FOREIGN KEY CONSTRAINTS
-- ============================================

-- First, ensure all ID columns are TEXT type consistently
ALTER TABLE users ALTER COLUMN id TYPE TEXT;
ALTER TABLE trips ALTER COLUMN id TYPE TEXT;
ALTER TABLE destinations ALTER COLUMN id TYPE TEXT;
ALTER TABLE travel_requests ALTER COLUMN id TYPE TEXT;
ALTER TABLE contact_messages ALTER COLUMN id TYPE TEXT;
ALTER TABLE notifications ALTER COLUMN id TYPE TEXT;
ALTER TABLE announcements ALTER COLUMN id TYPE TEXT;
ALTER TABLE activity_logs ALTER COLUMN id TYPE TEXT;
ALTER TABLE internal_messages ALTER COLUMN id TYPE TEXT;
ALTER TABLE agent_requests ALTER COLUMN id TYPE TEXT;

-- Ensure foreign key columns are also TEXT type
ALTER TABLE internal_messages ALTER COLUMN sender_id TYPE TEXT;
ALTER TABLE internal_messages ALTER COLUMN receiver_id TYPE TEXT;
ALTER TABLE agent_requests ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE trips ALTER COLUMN agent_id TYPE TEXT;

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    -- trips.owner_email -> users.email
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trips_owner_email_fkey') THEN
        ALTER TABLE trips ADD CONSTRAINT trips_owner_email_fkey FOREIGN KEY (owner_email) REFERENCES users(email) ON DELETE CASCADE;
    END IF;
    
    -- internal_messages.sender_id -> users.id
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'internal_messages_sender_id_fkey') THEN
        ALTER TABLE internal_messages ADD CONSTRAINT internal_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id);
    END IF;
    
    -- internal_messages.receiver_id -> users.id
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'internal_messages_receiver_id_fkey') THEN
        ALTER TABLE internal_messages ADD CONSTRAINT internal_messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES users(id);
    END IF;
    
    -- agent_requests.user_id -> users.id
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agent_requests_user_id_fkey') THEN
        ALTER TABLE agent_requests ADD CONSTRAINT agent_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;
    
    -- trips.agent_id -> users.id
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trips_agent_id_fkey') THEN
        ALTER TABLE trips ADD CONSTRAINT trips_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES users(id);
    END IF;
END $$;

-- ============================================
-- 5. CREATE UPDATED_AT TRIGGERS
-- ============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_trips_updated_at ON trips;
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

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

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('ethio-travel-assets', 'ethio-travel-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "User Update Own Files" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'ethio-travel-assets');

CREATE POLICY "Authenticated Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'ethio-travel-assets');

CREATE POLICY "User Update Own Files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'ethio-travel-assets');

-- ============================================
-- 8. CREATE PERFORMANCE INDEXES
-- ============================================

-- User lookup indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Trip indexes
CREATE INDEX IF NOT EXISTS idx_trips_owner_email ON trips(owner_email);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(approval_status);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trips_agent ON trips(agent_id);

-- Activity logs indexes (only create if columns exist)
DO $$
BEGIN
    -- Create timestamp index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'timestamp') THEN
        CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
    END IF;
    
    -- Create actor_id index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'actor_id') THEN
        CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON activity_logs(actor_id);
    END IF;
    
    -- Create action index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'action') THEN
        CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
    END IF;
    
    -- Create created_at index as fallback
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
    END IF;
END $$;

-- Destination search indexes
CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);

-- Contact messages indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_email ON notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ============================================
-- 9. SEED ESSENTIAL DATA
-- ============================================

-- Create admin user (ID: 1200)
INSERT INTO users (id, username, name, email, password_hash, role, status, phone, about)
VALUES ('1200', 'ashu', 'Ashenafi Abebe', 'ashenafiabebe604@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'active', '+251911000000', 'System Administrator')
ON CONFLICT (id) DO UPDATE SET 
  password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  role = 'admin', 
  status = 'active',
  name = 'Ashenafi Abebe';

-- Create sample agent user (ID: 1201)
INSERT INTO users (id, username, name, email, password_hash, role, status, phone, about, rating)
VALUES ('1201', 'agent_jane', 'Jane Travel Expert', 'jane@ethiotravel.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'agent', 'active', '+251911234567', 'Experienced travel agent specializing in Ethiopian cultural tours and historical sites.', 4.8)
ON CONFLICT (id) DO UPDATE SET 
  role = 'agent', 
  status = 'active',
  rating = 4.8;

-- Create sample regular user (ID: 1202)
INSERT INTO users (id, username, name, email, password_hash, role, status, phone)
VALUES ('1202', 'traveler_bob', 'Bob Explorer', 'bob@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', 'active', '+251922345678')
ON CONFLICT (id) DO UPDATE SET 
  role = 'user', 
  status = 'active';

-- Add welcome announcement
INSERT INTO announcements (title, body, type, is_active)
VALUES ('Welcome to EthioTravel!', 'Discover the beauty of Ethiopia with our expert travel guides and curated experiences. Book your dream trip today!', 'info', true)
ON CONFLICT DO NOTHING;

-- Add sample notification
INSERT INTO notifications (title, body, type, audience, read)
VALUES ('System Ready', 'EthioTravel platform is now fully operational and ready for bookings.', 'success', 'all', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. FINAL VERIFICATION
-- ============================================

-- Update sequence to ensure it's ahead of existing IDs
SELECT setval('user_id_seq', GREATEST(1201, (SELECT COALESCE(MAX(id::integer), 1200) FROM users WHERE id ~ '^[0-9]+$') + 1));

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Admin Login Credentials:
-- Username: ashu
-- Email: ashenafiabebe604@gmail.com
-- Password: Ashu19951?

-- Agent Login Credentials:
-- Username: agent_jane
-- Email: jane@ethiotravel.com
-- Password: Ashu19951?

-- User Login Credentials:
-- Username: traveler_bob
-- Email: bob@gmail.com
-- Password: Ashu19951?