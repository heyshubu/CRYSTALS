# Project State

## Current session
- Date: 2026-08-31
- Status: COMPLETE — all built, tested, migrated, pushed to git.

## Active work
- Building Disaster Relief Coordination App — Nepal
- Stack: Next.js + Tailwind + Leaflet + Supabase (Postgres) + lucide-react + pg driver
- Database: Supabase Postgres via pooler at aws-0-ap-southeast-2.pooler.supabase.com
- All features built and tested. DB migrated with seed data. Pushed to git.

## Recent decisions
- Created full SQL migration: 6 tables, 3 public views, 20+ RLS policies, 2 functions
- Tables: check_ins, needs, responders, shelters, shelter_inventory, admin_config
- Location fuzzing done via SQL function `fuzz_location_simple()` — ~300m random offset
- Public reads ONLY through restricted views (no anon access to base tables except SELECT on shelters)
- All mutating operations go through service-role backend; anon can INSERT only for check_ins and needs
- AI suggestion fields (ai_suggested_category, ai_suggested_urgency) stored on needs table for audit
- Demo seed data: 1 superadmin passcode, 2 responders, 1 shelter

## Known issues
- AI suggestion uses keyword placeholder until real AI provider is connected.
- Map polling every 10s as fallback (Supabase Realtime requires API keys we don't have).
- Session management uses localStorage — fine for demo, not production.

## Deep history index
- Migration file → supabase/migrations/001_initial_schema.sql
- 2026-08-31: All steps 1–7 complete → memory/2026-08-31.md
