import { NextRequest, NextResponse } from "next/server";
import pool from "@/backend/db";

function generateCode(skill: string): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `RESP-${skill.toUpperCase().slice(0, 4)}-${suffix}`;
}

/** GET /api/admin/responders */
export async function GET() {
  const { rows } = await pool.query(`SELECT * FROM responders ORDER BY name`);
  return NextResponse.json({ responders: rows });
}

/** POST /api/admin/responders — add responder */
export async function POST(req: NextRequest) {
  try {
    const { name, phone, skill, coverage } = await req.json();
    if (!name?.trim() || !skill || !coverage?.trim()) {
      return NextResponse.json({ error: "Name, skill, and coverage required." }, { status: 400 });
    }

    let code: string;
    for (let i = 0; i < 10; i++) {
      code = generateCode(skill);
      const existing = await pool.query(`SELECT id FROM responders WHERE login_code = $1`, [code]);
      if (existing.rows.length === 0) break;
    }

    const { rows } = await pool.query(
      `INSERT INTO responders (name, phone, skill, coverage, login_code)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name.trim(), phone?.trim() || null, skill, coverage.trim(), code!]
    );
    return NextResponse.json({ responder: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("responders POST error:", err);
    return NextResponse.json({ error: "Failed to add." }, { status: 500 });
  }
}

/** PATCH /api/admin/responders — update */
export async function PATCH(req: NextRequest) {
  try {
    const { id, skill, coverage, phone } = await req.json();
    if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;
    if (skill !== undefined) { updates.push(`skill = $${idx++}`); values.push(skill); }
    if (coverage !== undefined) { updates.push(`coverage = $${idx++}`); values.push(coverage); }
    if (phone !== undefined) { updates.push(`phone = $${idx++}`); values.push(phone || null); }
    values.push(id);

    await pool.query(`UPDATE responders SET ${updates.join(", ")} WHERE id = $${idx}`, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("responders PATCH error:", err);
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}
