import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sffkdcyqsxuapuzuycma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZmtkY3lxc3h1YXB1enV5Y21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTc5MTksImV4cCI6MjA4ODEzMzkxOX0.n71rj-O9Q-7OTv5iPqBX9Q94XRQJtTfckEuBDsdZ8BM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
