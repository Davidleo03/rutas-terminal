import { config } from 'dotenv';

config();

const configuraction = {
    port: process.env.PORT || 3000,
    db : {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY,
        // Optional: service role key used for admin actions (keep secret)
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    }
}

export default configuraction;  