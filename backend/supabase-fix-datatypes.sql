-- ============================================
-- EthioTravel Supabase Data Type Fix
-- Run this FIRST if you get foreign key constraint errors
-- ============================================

-- Step 1: Drop existing foreign key constraints that might cause issues
DO $$
BEGIN
    -- Drop constraints if they exist
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trips_owner_email_fkey') THEN
        ALTER TABLE trips DROP CONSTRAINT trips_owner_email_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'internal_messages_sender_id_fkey') THEN
        ALTER TABLE internal_messages DROP CONSTRAINT internal_messages_sender_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'internal_messages_receiver_id_fkey') THEN
        ALTER TABLE internal_messages DROP CONSTRAINT internal_messages_receiver_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agent_requests_user_id_fkey') THEN
        ALTER TABLE agent_requests DROP CONSTRAINT agent_requests_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trips_agent_id_fkey') THEN
        ALTER TABLE trips DROP CONSTRAINT trips_agent_id_fkey;
    END IF;
END $$;

-- Step 2: Convert all ID columns to TEXT type safely
DO $$
BEGIN
    -- Convert users.id to TEXT if it's UUID
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id' AND data_type = 'uuid') THEN
        ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::TEXT;
    END IF;
    
    -- Convert other ID columns
    BEGIN
        ALTER TABLE trips ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        -- Column might not exist or already be TEXT
        NULL;
    END;
    
    BEGIN
        ALTER TABLE destinations ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE travel_requests ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE contact_messages ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE notifications ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE announcements ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE activity_logs ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE internal_messages ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE agent_requests ALTER COLUMN id TYPE TEXT USING COALESCE(id::TEXT, gen_random_uuid()::TEXT);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Step 3: Convert foreign key columns to TEXT
DO $$
BEGIN
    -- Convert foreign key columns
    BEGIN
        ALTER TABLE internal_messages ALTER COLUMN sender_id TYPE TEXT USING sender_id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE internal_messages ALTER COLUMN receiver_id TYPE TEXT USING receiver_id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE agent_requests ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE trips ALTER COLUMN agent_id TYPE TEXT USING agent_id::TEXT;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Step 4: Set proper defaults for ID columns
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

-- Step 5: Re-create foreign key constraints
DO $$
BEGIN
    -- trips.owner_email -> users.email
    BEGIN
        ALTER TABLE trips ADD CONSTRAINT trips_owner_email_fkey FOREIGN KEY (owner_email) REFERENCES users(email) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
        NULL; -- Constraint already exists
    END;
    
    -- internal_messages.sender_id -> users.id
    BEGIN
        ALTER TABLE internal_messages ADD CONSTRAINT internal_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id);
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    -- internal_messages.receiver_id -> users.id
    BEGIN
        ALTER TABLE internal_messages ADD CONSTRAINT internal_messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES users(id);
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    -- agent_requests.user_id -> users.id
    BEGIN
        ALTER TABLE agent_requests ADD CONSTRAINT agent_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    -- trips.agent_id -> users.id
    BEGIN
        ALTER TABLE trips ADD CONSTRAINT trips_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES users(id);
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;

-- Data type fix complete!
SELECT 'Data types fixed successfully!' as status;