-- ============================================
-- EthioTravel Supabase Schema Fix
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

-- ============================================
-- 0. USER ID SEQUENCE & CUSTOM FORMAT
-- ============================================

-- ============================================
-- 0. USER ID SYSTEM RESET (Numeric IDs 1200+)
-- ============================================

-- 1. Ensure the sequence exists
CREATE SEQUENCE IF NOT EXISTS user_id_seq START 1201;

-- 2. Ensure ID column is TEXT and remove old defaults
ALTER TABLE users ALTER COLUMN id TYPE TEXT;
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;

-- 3. Set the new default to the sequence
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('user_id_seq')::TEXT;

-- 4. Create a backup trigger just in case the default is bypassed
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

-- 5. Manually set the Admin ID to 1200 surgical fix
DO $$
BEGIN
    -- Move anyone who isn't the primary admin but has ID 1200
    UPDATE users 
    SET id = nextval('user_id_seq')::TEXT 
    WHERE id = '1200' 
    AND username != 'ashu' 
    AND email NOT IN ('ashenafiabebe@gmail.com', 'ashenafiabebe604@gmail.com');

    -- Assign 1200 to the primary admin if they don't have it and it's free
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = '1200') THEN
        UPDATE users 
        SET id = '1200' 
        WHERE ctid = (
          SELECT ctid FROM users 
          WHERE (username = 'ashu' OR email = 'ashenafiabebe@gmail.com' OR email = 'ashenafiabebe604@gmail.com')
          ORDER BY created_at ASC 
          LIMIT 1
        );
    END IF;
END $$;

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
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0;
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

ALTER TABLE trips ADD COLUMN IF NOT EXISTS id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE trips ALTER COLUMN id SET NOT NULL;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS cost_breakdown JSONB DEFAULT '{}';

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
WHERE username = 'ashu' OR email = 'ashenafiabebe@gmail.com' OR email = 'ashenafiabebe604@gmail.com';

-- ============================================
-- 6. Ensure admin role is set correctly
-- ============================================

UPDATE users 
SET role = 'admin', status = 'active'
WHERE username = 'ashu' OR email = 'ashenafiabebe@gmail.com' OR email = 'ashenafiabebe604@gmail.com';

-- ============================================
-- 7. INTERNAL_MESSAGES TABLE - Create if missing
-- ============================================

CREATE TABLE IF NOT EXISTS internal_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  sender_id TEXT CONSTRAINT internal_messages_sender_id_fkey REFERENCES users(id),
  receiver_id TEXT CONSTRAINT internal_messages_receiver_id_fkey REFERENCES users(id),
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. ANNOUNCEMENTS TABLE - Create if missing
-- ============================================

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. ACTIVITY_LOGS TABLE - Create if missing
-- ============================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  actor_id TEXT,
  actor_name TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. NOTIFICATIONS TABLE - Add missing columns
-- ============================================

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS body TEXT;

-- ============================================
-- 9. DESTINATIONS TABLE - Add missing columns
-- ============================================

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

-- ============================================
-- 10. SECURITY - Fix RLS Policies
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
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;

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
