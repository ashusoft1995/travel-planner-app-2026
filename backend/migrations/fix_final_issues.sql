-- Fix for missing receiver_id in internal_messages
ALTER TABLE internal_messages ADD COLUMN IF NOT EXISTS receiver_id TEXT;
ALTER TABLE internal_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Ensure trips has a valid ID default (Handling both UUID and TEXT types)
ALTER TABLE trips ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE trips ALTER COLUMN id SET NOT NULL;

-- Ensure internal_messages has a valid ID default
ALTER TABLE internal_messages ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE internal_messages ALTER COLUMN id SET NOT NULL;

-- Fix for announcements (title/body vs title/content)
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'info';
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify receiver_id foreign key if it's missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'internal_messages_receiver_id_fkey') THEN
        ALTER TABLE internal_messages ADD CONSTRAINT internal_messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES users(id);
    END IF;
END $$;
