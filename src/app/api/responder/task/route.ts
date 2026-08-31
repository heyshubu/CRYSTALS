import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/** GET /api/responder/task?responderId=xxx */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const responderId = searchParams.get("responderId");
  if (!responderId) {
    return NextResponse.json({ error: "responderId required." }, { status: 400 });
  }

  const { rows } = await pool.query(
    `SELECT * FROM needs
     WHERE assigned_responder_id = $1 AND status IN ('open','in_progress')
     ORDER BY CASE urgency WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 END
     LIMIT 1`,
    [responderId]
  );

  return NextResponse.json({ task: rows[0] || null });
}

/** PATCH /api/responder/task — mark complete */
export async function PATCH(req: NextRequest) {
  try {
    const { needId } = await req.json();
    if (!needId) return NextResponse.json({ error: "needId required." }, { status: 400 });

    await pool.query(
      `UPDATE needs SET status = 'resolved', assigned_responder_id = NULL, updated_at = NOW() WHERE id = $1`,
      [needId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("task PATCH error:", err);
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}
