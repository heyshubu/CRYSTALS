import { NextRequest, NextResponse } from "next/server";
import pool from "@/backend/db";

/** PATCH /api/responder/shelter */
export async function PATCH(req: NextRequest) {
  try {
    const { shelterId, current_occupancy } = await req.json();
    if (!shelterId || current_occupancy == null || typeof current_occupancy !== "number") {
      return NextResponse.json({ error: "shelterId and numeric occupancy required." }, { status: 400 });
    }

    const shelter = await pool.query(`SELECT id, capacity FROM shelters WHERE id = $1`, [shelterId]);
    if (shelter.rows.length === 0) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (current_occupancy > shelter.rows[0].capacity) {
      return NextResponse.json({ error: "Exceeds capacity." }, { status: 400 });
    }

    await pool.query(`UPDATE shelters SET current_occupancy = $1 WHERE id = $2`, [current_occupancy, shelterId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("shelter error:", err);
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}
