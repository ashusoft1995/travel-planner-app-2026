import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kktbfgxsgdzzlnivyumt.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_vrXWMm882EN-qC7sC3lajA_t4dff7op';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
