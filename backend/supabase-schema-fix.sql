-- ============================================
-- EthioTravel Supabase Schema Fix
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

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
-- Done! All columns added successfully.
-- ============================================
