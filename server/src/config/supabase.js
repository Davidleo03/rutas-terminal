import { createClient } from '@supabase/supabase-js';

import configuraction from './env.config.js';

const supabaseUrl = configuraction.db.supabaseUrl;
const supabaseKey = configuraction.db.supabaseKey;

function getSupabaseClient() {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL or Key is not defined in environment variables');
    }
    
    console.log('Supabase URL and Key loaded successfully');

    return createClient(supabaseUrl, supabaseKey);
}

const supabase = getSupabaseClient();

export default supabase;