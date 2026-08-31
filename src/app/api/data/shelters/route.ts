import { NextRequest, NextResponse } from "next/server";
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

/**
 * POST /api/data/shelters — Create a new shelter (superadmin only)
 */
export async function POST(req: NextRequest) {
  try {
    const { name, lat, lng, capacity } = await req.json();
    if (!name || lat == null || lng == null || !capacity) {
      return NextResponse.json({ error: "Name, location, and capacity are required." }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO shelters (name, exact_lat, exact_lng, capacity, current_occupancy)
       VALUES ($1, $2, $3, $4, 0)
       RETURNING *`,
      [name.trim(), lat, lng, capacity]
    );
    return NextResponse.json({ shelter: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("shelters POST error:", err);
    return NextResponse.json({ error: "Failed to create shelter." }, { status: 500 });
  }
}

/**
 * PUT /api/data/shelters — Update a shelter (superadmin only)
 */
export async function PUT(req: NextRequest) {
  try {
    const { id, name, lat, lng, capacity } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Shelter ID required." }, { status: 400 });
    }

    const updates: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (name) { updates.push(`name = $${paramIdx++}`); params.push(name.trim()); }
    if (lat != null) { updates.push(`exact_lat = $${paramIdx++}`); params.push(lat); }
    if (lng != null) { updates.push(`exact_lng = $${paramIdx++}`); params.push(lng); }
    if (capacity != null) { updates.push(`capacity = $${paramIdx++}`); params.push(capacity); }

    if (updates.length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    params.push(id);
    const { rows } = await pool.query(
      `UPDATE shelters SET ${updates.join(", ")} WHERE id = $${paramIdx} RETURNING *`,
      params
    );
    return NextResponse.json({ shelter: rows[0] });
  } catch (err) {
    console.error("shelters PUT error:", err);
    return NextResponse.json({ error: "Failed to update shelter." }, { status: 500 });
  }
}
