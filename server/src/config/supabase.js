import { createClient } from '@supabase/supabase-js';

import configuraction from './env.config.js';

const supabaseUrl = configuraction.db.supabaseUrl;
const supabaseKey = configuraction.db.supabaseKey;
const supabaseServiceRole = configuraction.db.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseClient() {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL or Key is not defined in environment variables');
    }
    
    console.log('Supabase URL and Key loaded successfully');

    return createClient(supabaseUrl, supabaseKey);
}

function getSupabaseAdminClient() {
    if (!supabaseUrl || !supabaseServiceRole) {
        // Don't throw here - some environments (like local dev) may not set a service role key.
        console.warn('Supabase service_role key is not defined. Admin operations will fail if attempted.');
        return null;
    }
    console.log('Supabase admin (service_role) key loaded successfully');
    return createClient(supabaseUrl, supabaseServiceRole);
}

const supabase = getSupabaseClient();
const supabaseAdmin = getSupabaseAdminClient();

export default supabase;
export { supabaseAdmin };