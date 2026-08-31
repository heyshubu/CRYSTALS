import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/db";

/** GET /api/admin/inventory?shelterId=xxx */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shelterId = searchParams.get("shelterId");

  let query = "SELECT * FROM shelter_inventory";
  const params: unknown[] = [];
  if (shelterId) {
    query += " WHERE shelter_id = $1";
    params.push(shelterId);
  }
  query += " ORDER BY item_name";

  const { rows } = await safeQuery(query, params);
  return NextResponse.json({ items: rows });
}

/** POST /api/admin/inventory — upsert item */
export async function POST(req: NextRequest) {
  try {
    const { shelter_id, item_name, quantity, unit } = await req.json();
    if (!shelter_id || !item_name || quantity == null) {
      return NextResponse.json({ error: "All fields required." }, { status: 400 });
    }

    const { rows, error } = await safeQuery(
      `INSERT INTO shelter_inventory (shelter_id, item_name, quantity, unit)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (shelter_id, item_name) DO UPDATE SET quantity = $3, unit = $4
       RETURNING *`,
      [shelter_id, item_name.trim(), quantity, unit?.trim() || "units"]
    );
    if (error) return NextResponse.json({ error: "Failed." }, { status: 500 });
    return NextResponse.json({ item: rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}

/** DELETE /api/admin/inventory */
export async function DELETE(req: NextRequest) {
  try {
    const { itemId } = await req.json();
    if (!itemId) return NextResponse.json({ error: "itemId required." }, { status: 400 });
    await safeQuery(`DELETE FROM shelter_inventory WHERE id = $1`, [itemId]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
