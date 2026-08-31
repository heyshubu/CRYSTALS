import { NextResponse } from "next/server";
import { safeQuery } from "@/lib/db";

/**
 * GET /api/data/needs
 * Returns approximate needs for the public map (or full needs for responder/admin).
 * Query params: ?full=true (exact locations + contact)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const full = searchParams.get("full") === "true";

  if (full) {
    const { rows } = await safeQuery(
      `SELECT *, assigned_responder_id IS NOT NULL AS is_assigned
       FROM needs
       ORDER BY
         CASE urgency WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 END,
         created_at DESC
       LIMIT 500`
    );
    return NextResponse.json(rows);
  }

  const { rows } = await safeQuery(
    `SELECT id, category, urgency, description, status,
            assigned_responder_id IS NOT NULL AS is_assigned,
            approx_lat, approx_lng, created_at
     FROM needs
     ORDER BY created_at DESC
     LIMIT 500`
  );
  return NextResponse.json(rows);
}
