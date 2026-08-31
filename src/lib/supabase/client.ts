/**
 * Supabase client for the browser (React components).
 * Uses the public anon key — safe to expose.
 * For writes that need elevated access, call API routes instead.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
