# Project State

## Current session
- Date: 2026-08-31
- Status: Steps 1–7 complete. Step 8 (nice-to-haves) available if time permits.

## Active work
- Building Disaster Relief Coordination App — Nepal
- Stack: Next.js + Tailwind + Leaflet + Supabase + lucide-react
- Status: All core features built. Step 8 (offline handling, language toggle) optional.
- To deploy: set up Supabase project, run migration, update .env.local, deploy to Vercel.

## Recent decisions
- Created full SQL migration: 6 tables, 3 public views, 20+ RLS policies, 2 functions
- Tables: check_ins, needs, responders, shelters, shelter_inventory, admin_config
- Location fuzzing done via SQL function `fuzz_location_simple()` — ~300m random offset
- Public reads ONLY through restricted views (no anon access to base tables except SELECT on shelters)
- All mutating operations go through service-role backend; anon can INSERT only for check_ins and needs
- AI suggestion fields (ai_suggested_category, ai_suggested_urgency) stored on needs table for audit
- Demo seed data: 1 superadmin passcode, 2 responders, 1 shelter

## Known issues
- Leaflet requires `react-leaflet` wrapper (not direct import) in Next.js — fixed.
- AI suggestion uses placeholder keyword matching until real AI provider is connected.
- Nepal districts list has minor duplication — functionally fine for dropdown.
- Session management uses localStorage — not secure for production, fine for demo.
- Realtime subscriptions need Supabase Realtime enabled in project settings.
- Need to run migration against Supabase before deployment.

## Deep history index
- Migration file → supabase/migrations/001_initial_schema.sql
- 2026-08-31: All steps 1–7 complete → memory/2026-08-31.md
