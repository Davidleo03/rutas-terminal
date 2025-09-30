import { config } from 'dotenv';

config();

const configuraction = {
    port: process.env.PORT || 3000,
    db : {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY
    }
}

export default configuraction;  