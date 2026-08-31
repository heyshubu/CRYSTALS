/**
 * Supabase client for Next.js API routes (server-side only).
 * Uses the service-role key — NEVER import this from a client component.
 * Used for: location fuzzing, reading exact locations, responder CRUD,
 * shelter inventory, and admin operations.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
