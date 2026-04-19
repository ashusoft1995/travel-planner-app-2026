-- EthioTravel Complete Supabase Schema
-- Run this in Supabase SQL Editor

-- 1. USERS Table
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TRIPS Table
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  owner_email TEXT REFERENCES users(email) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  budget NUMERIC DEFAULT 0,
  activities TEXT[] DEFAULT '{}',
  accommodation TEXT DEFAULT 'Not specified',
  notes TEXT,
  image TEXT,
  approval_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DESTINATIONS Table
CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  location TEXT,
  price_range TEXT,
  travel_volume_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRAVEL_REQUESTS Table
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

-- 5. CONTACT_MESSAGES Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  admin_target TEXT, -- which admin it's directed to
  status TEXT DEFAULT 'open', -- 'open', 'read', 'replied', 'closed'
  reply_text TEXT,
  replied_by TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_email TEXT, -- NULL for all or specific audience
  audience TEXT DEFAULT 'user', -- 'user', 'agent', 'admin', 'all'
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ANNOUNCEMENTS Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACTIVITY_LOGS Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_email TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_trips_updated_at ON trips;
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
