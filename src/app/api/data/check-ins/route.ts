import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/data/check-ins
 * Returns approximate check-ins for the public map.
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, status, approx_lat, approx_lng, created_at
       FROM check_ins
       ORDER BY created_at DESC
       LIMIT 500`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("check-ins GET error:", err);
    return NextResponse.json({ error: "Failed to fetch check-ins." }, { status: 500 });
  }
}
