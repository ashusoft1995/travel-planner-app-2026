import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kktbfgxsgdzzlnivyumt.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_vrXWMm882EN-qC7sC3lajA_t4dff7op';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a file to a Supabase bucket and returns the public URL.
 * @param {File} file - The file object to upload.
 * @param {string} bucket - The name of the Supabase bucket.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
export const uploadFile = async (file, bucket = 'ethio-travel-assets') => {
  if (!file) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};
