
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jaayagiwircvwvhcxivc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYXlhZ2l3aXJjdnd2aGN4aXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjM1NTYsImV4cCI6MjA1NzIzOTU1Nn0.nY8gq2GsSaTfOVWsyYi14PIhm1OENq8Z84J1o6B-fOk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
