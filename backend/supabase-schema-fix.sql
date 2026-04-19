-- ============================================
-- EthioTravel Supabase Schema Fix
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

-- ============================================
-- 0. USER ID SEQUENCE & CUSTOM FORMAT
-- ============================================

-- ============================================
-- 0. USER ID SEQUENCE & TRIGGER (Numeric IDs)
-- ============================================

-- Create a sequence for user IDs starting at 1201
CREATE SEQUENCE IF NOT EXISTS user_id_seq START 1201;

-- Create a function to automatically assign the next ID if null
CREATE OR REPLACE FUNCTION set_user_id() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('user_id_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_set_user_id ON users;
CREATE TRIGGER trigger_set_user_id
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_user_id();

-- Manually set the Admin ID to 1200
UPDATE users SET id = '1200' WHERE username = 'ashu' OR email = 'ashenafiabebe@gmail.com';

-- ============================================
-- 1. USERS TABLE - Add missing columns
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS legal_paper_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_cv TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_image TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS national_id_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 2. CONTACT_MESSAGES TABLE - Add missing columns
-- ============================================

ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS admin_target TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS reply_text TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS replied_by TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 3. TRIPS TABLE - Make sure all columns exist
-- ============================================

ALTER TABLE trips ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE trips ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- 4. ACTIVITY LOGS TABLE - Create if missing
-- ============================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_email TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. Fix Admin user password hash
-- (Sets ashu password to: Ashu19951?)
-- ============================================

UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE username = 'ashu' OR email = 'ashenafiabebe@gmail.com';

-- ============================================
-- 6. Ensure admin role is set correctly
-- ============================================

UPDATE users 
SET role = 'admin', status = 'active'
WHERE username = 'ashu' OR email = 'ashenafiabebe@gmail.com';

-- ============================================
-- 7. INTERNAL_MESSAGES TABLE - Create if missing
-- ============================================

CREATE TABLE IF NOT EXISTS internal_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  sender_id TEXT REFERENCES users(id),
  receiver_id TEXT REFERENCES users(id),
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. NOTIFICATIONS TABLE - Add missing columns
-- ============================================

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_id TEXT;

-- ============================================
-- 9. SECURITY - Fix RLS Policies
-- ============================================

-- Disable RLS to allow the backend server to manage data without policy conflicts
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE destinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE travel_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE internal_messages DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 10. STORAGE - Create required buckets
-- ============================================

-- Create the assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('ethio-travel-assets', 'ethio-travel-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to the bucket (Drop first to avoid duplication errors)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'ethio-travel-assets');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ethio-travel-assets');

-- ============================================
-- Done! All fixes applied successfully.
-- ============================================
