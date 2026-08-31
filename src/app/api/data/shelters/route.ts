import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/data/shelters
 * Returns all shelters with exact locations (shelters are always public).
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, exact_lat, exact_lng, capacity, current_occupancy, created_at
       FROM shelters
       ORDER BY name`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("shelters GET error:", err);
    return NextResponse.json({ error: "Failed to fetch shelters." }, { status: 500 });
  }
}
