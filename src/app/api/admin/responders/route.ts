import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/db";

/** GET /api/admin/responders */
export async function GET() {
  const { rows } = await safeQuery(`SELECT * FROM responders ORDER BY name`);
  return NextResponse.json({ responders: rows });
}

/** POST /api/admin/responders — create a new responder */
export async function POST(req: NextRequest) {
  try {
    const { name, phone, skill, coverage } = await req.json();
    if (!name || !skill || !coverage) {
      return NextResponse.json({ error: "Name, skill, and coverage are required." }, { status: 400 });
    }

    // Generate unique login code
    const prefix = `RESP-${skill.toUpperCase().slice(0, 4)}`;
    const suffix = String(Math.floor(1000 + Math.random() * 9000));
    const code = `${prefix}-${suffix}`;

    const { rows, error } = await safeQuery(
      `INSERT INTO responders (name, phone, skill, coverage, availability, login_code)
       VALUES ($1, $2, $3, $4, 'available', $5)
       RETURNING *`,
      [name.trim(), phone?.trim() || null, skill, coverage.trim(), code]
    );
    if (error) return NextResponse.json({ error: "Failed to create responder." }, { status: 500 });
    return NextResponse.json({ responder: rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create responder." }, { status: 500 });
  }
}

/** PUT /api/admin/responders — update a responder */
export async function PUT(req: NextRequest) {
  try {
    const { id, name, phone, skill, coverage, availability } = await req.json();
    if (!id) return NextResponse.json({ error: "Responder ID required." }, { status: 400 });

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (name) { updates.push(`name = $${idx++}`); values.push(name.trim()); }
    if (phone !== undefined) { updates.push(`phone = $${idx++}`); values.push(phone || null); }
    if (skill) { updates.push(`skill = $${idx++}`); values.push(skill); }
    if (coverage) { updates.push(`coverage = $${idx++}`); values.push(coverage.trim()); }
    if (availability) { updates.push(`availability = $${idx++}`); values.push(availability); }

    if (updates.length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

    values.push(id);
    const { error } = await safeQuery(
      `UPDATE responders SET ${updates.join(", ")} WHERE id = $${idx}`,
      values
    );
    if (error) return NextResponse.json({ error: "Failed to update." }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update responder." }, { status: 500 });
  }
}
