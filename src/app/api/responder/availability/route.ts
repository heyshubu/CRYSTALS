import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/** PATCH /api/responder/availability */
export async function PATCH(req: NextRequest) {
  try {
    const { responderId, availability } = await req.json();
    if (!responderId || !["available", "busy", "offline"].includes(availability)) {
      return NextResponse.json({ error: "Invalid params." }, { status: 400 });
    }

    await pool.query(`UPDATE responders SET availability = $1 WHERE id = $2`, [availability, responderId]);
    return NextResponse.json({ success: true, availability });
  } catch (err) {
    console.error("availability error:", err);
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}
