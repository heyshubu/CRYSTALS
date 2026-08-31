import { NextRequest, NextResponse } from "next/server";
import pool from "@/backend/db";

/** POST /api/responder/pickup — self-assign a need */
export async function POST(req: NextRequest) {
  try {
    const { needId, responderId } = await req.json();
    if (!needId || !responderId) {
      return NextResponse.json({ error: "needId and responderId required." }, { status: 400 });
    }

    // Check responder isn't already assigned
    const existing = await pool.query(
      `SELECT id FROM needs WHERE assigned_responder_id = $1 AND status IN ('open','in_progress') LIMIT 1`,
      [responderId]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "You already have an assigned task." }, { status: 409 });
    }

    // Check need is unassigned and open
    const need = await pool.query(
      `SELECT id, assigned_responder_id, status FROM needs WHERE id = $1`,
      [needId]
    );
    if (need.rows.length === 0) return NextResponse.json({ error: "Need not found." }, { status: 404 });
    if (need.rows[0].assigned_responder_id) {
      return NextResponse.json({ error: "Already assigned." }, { status: 409 });
    }
    if (need.rows[0].status !== "open") {
      return NextResponse.json({ error: "No longer open." }, { status: 409 });
    }

    await pool.query(
      `UPDATE needs SET assigned_responder_id = $1, status = 'in_progress', updated_at = NOW() WHERE id = $2`,
      [responderId, needId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("pickup error:", err);
    return NextResponse.json({ error: "Failed to claim." }, { status: 500 });
  }
}
