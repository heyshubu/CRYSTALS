import { NextResponse } from "next/server";
import { safeQuery } from "@/lib/db";

/**
 * GET /api/data/check-ins
 * Public view — approximate locations only, no contact details.
 */
export async function GET() {
  const { rows } = await safeQuery(
    `SELECT id, name, status, approx_lat, approx_lng, created_at
     FROM check_ins
     ORDER BY created_at DESC
     LIMIT 200`
  );
  return NextResponse.json(rows);
}
