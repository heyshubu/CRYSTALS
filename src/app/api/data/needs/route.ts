import { NextResponse } from "next/server";
import pool from "@/backend/db";

/**
 * GET /api/data/needs
 * Returns approximate needs for the public map (or full needs for responder/admin).
 * Query params: ?full=true (exact locations + contact)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const full = searchParams.get("full") === "true";

    if (full) {
      // Full data — for responder/superadmin (called from server-side API routes)
      const { rows } = await pool.query(
        `SELECT *, assigned_responder_id IS NOT NULL AS is_assigned
         FROM needs
         ORDER BY
           CASE urgency WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 END,
           created_at DESC
         LIMIT 500`
      );
      return NextResponse.json(rows);
    }

    // Public view — approximate locations only, no contact
    const { rows } = await pool.query(
      `SELECT id, category, urgency, description, status,
              assigned_responder_id IS NOT NULL AS is_assigned,
              approx_lat, approx_lng, created_at
       FROM needs
       ORDER BY created_at DESC
       LIMIT 500`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("needs GET error:", err);
    return NextResponse.json({ error: "Failed to fetch needs." }, { status: 500 });
  }
}
