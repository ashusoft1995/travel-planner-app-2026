-- ============================================
-- Quick Fix for ID Column Defaults
-- Run this to fix the null ID constraint error
-- ============================================

-- Fix ID column defaults for all tables
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

-- Now you can safely insert data without specifying IDs
-- Test with a sample announcement
INSERT INTO announcements (title, body, type, is_active)
VALUES ('Welcome to EthioTravel!', 'Discover the beauty of Ethiopia with our expert travel guides and curated experiences. Book your dream trip today!', 'info', true);

-- Test with a sample notification  
INSERT INTO notifications (title, body, type, audience, read)
VALUES ('System Ready', 'EthioTravel platform is now fully operational and ready for bookings.', 'success', 'all', false);

SELECT 'ID defaults fixed successfully!' as status;