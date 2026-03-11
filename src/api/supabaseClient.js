import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rvupoatggzbctiiagzaz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2dXBvYXRnZ3piY3RpaWFnemF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDQzMjUsImV4cCI6MjA4ODgyMDMyNX0.g9tHH2KLWGqFIoSDtksALhPygO-egUlgJiPQif6yyto';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
