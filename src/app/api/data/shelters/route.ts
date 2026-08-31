import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/db";

/**
 * GET /api/data/shelters
 * Returns all shelters with exact locations (shelters are always public).
 */
export async function GET() {
  const { rows } = await safeQuery(
    `SELECT id, name, exact_lat, exact_lng, capacity, current_occupancy, created_at
     FROM shelters
     ORDER BY name`
  );
  return NextResponse.json(rows);
}

/**
 * POST /api/data/shelters — Create a new shelter
 */
export async function POST(req: NextRequest) {
  try {
    const { name, lat, lng, capacity } = await req.json();
    if (!name || lat == null || lng == null || !capacity) {
      return NextResponse.json({ error: "Name, location, and capacity are required." }, { status: 400 });
    }

    const { rows, error } = await safeQuery(
      `INSERT INTO shelters (name, exact_lat, exact_lng, capacity, current_occupancy)
       VALUES ($1, $2, $3, $4, 0)
       RETURNING *`,
      [name.trim(), lat, lng, capacity]
    );
    if (error) return NextResponse.json({ error: "Failed to create shelter." }, { status: 500 });
    return NextResponse.json({ shelter: rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create shelter." }, { status: 500 });
  }
}

/**
 * PUT /api/data/shelters — Update a shelter
 */
export async function PUT(req: NextRequest) {
  try {
    const { id, name, lat, lng, capacity } = await req.json();
    if (!id) return NextResponse.json({ error: "Shelter ID required." }, { status: 400 });

    const updates: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (name) { updates.push(`name = $${idx++}`); params.push(name.trim()); }
    if (lat != null) { updates.push(`exact_lat = $${idx++}`); params.push(lat); }
    if (lng != null) { updates.push(`exact_lng = $${idx++}`); params.push(lng); }
    if (capacity != null) { updates.push(`capacity = $${idx++}`); params.push(capacity); }

    if (updates.length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

    params.push(id);
    const { rows, error } = await safeQuery(
      `UPDATE shelters SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`,
      params
    );
    if (error) return NextResponse.json({ error: "Failed to update shelter." }, { status: 500 });
    return NextResponse.json({ shelter: rows[0] });
  } catch {
    return NextResponse.json({ error: "Failed to update shelter." }, { status: 500 });
  }
}
