import { NextRequest, NextResponse } from "next/server";
import pool, { safeQuery } from "@/lib/db";

/** POST /api/admin/match — suggest best responder for a need */
export async function POST(req: NextRequest) {
  try {
    const { needId } = await req.json();
    if (!needId) return NextResponse.json({ error: "needId required." }, { status: 400 });

    const needResult = await pool.query(
      `SELECT id, category, status, assigned_responder_id FROM needs WHERE id = $1`, [needId]
    );
    if (needResult.rows.length === 0) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const need = needResult.rows[0];
    if (need.assigned_responder_id) return NextResponse.json({ error: "Already assigned." }, { status: 409 });

    const { rows: responders } = await pool.query(
      `SELECT id, name, skill, coverage, phone, availability FROM responders WHERE availability = 'available'`
    );
    if (responders.length === 0) return NextResponse.json({ suggestedResponder: null });

    // Score: skill match +10, available (already filtered), +5 base
    const scored = responders.map((r) => ({
      ...r,
      score: (r.skill === need.category ? 10 : 0) + 5,
    }));
    scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    return NextResponse.json({ suggestedResponder: scored[0] || null });
  } catch (err) {
    console.error("match error:", err);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}

/** PUT /api/admin/match — assign responder */
export async function PUT(req: NextRequest) {
  try {
    const { needId, responderId } = await req.json();
    if (!needId || !responderId) return NextResponse.json({ error: "Both required." }, { status: 400 });

    const resp = await pool.query(`SELECT id, availability FROM responders WHERE id = $1`, [responderId]);
    if (resp.rows.length === 0) return NextResponse.json({ error: "Responder not found." }, { status: 404 });
    if (resp.rows[0].availability !== "available") {
      return NextResponse.json({ error: "Responder not available." }, { status: 409 });
    }

    const existing = await pool.query(
      `SELECT id FROM needs WHERE assigned_responder_id = $1 AND status IN ('open','in_progress') LIMIT 1`, [responderId]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Responder already has a task." }, { status: 409 });
    }

    await pool.query(
      `UPDATE needs SET assigned_responder_id = $1, status = 'in_progress', updated_at = NOW() WHERE id = $2`,
      [responderId, needId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("assign error:", err);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
