import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { fuzzLocation } from "@/lib/fuzz-location";

const VALID_CATEGORIES = ["food", "water", "medical", "shelter", "transport"];
const VALID_URGENCIES = ["low", "medium", "high"];

/**
 * POST /api/needs
 * Public endpoint — anyone can report a need.
 * Body: { name?, phone?, category, urgency, description, lat, lng, ai_suggested_category?, ai_suggested_urgency? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, category, urgency, description, lat, lng, ai_suggested_category, ai_suggested_urgency } = body;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `Category must be one of: ${VALID_CATEGORIES.join(", ")}` }, { status: 400 });
    }
    if (!urgency || !VALID_URGENCIES.includes(urgency)) {
      return NextResponse.json({ error: `Urgency must be one of: ${VALID_URGENCIES.join(", ")}` }, { status: 400 });
    }
    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }
    if (lat == null || lng == null || typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "Valid lat and lng coordinates are required." }, { status: 400 });
    }

    const loc = fuzzLocation(lat, lng);

    const { rows } = await pool.query(
      `INSERT INTO needs (name, phone, category, urgency, description, exact_lat, exact_lng, approx_lat, approx_lng, ai_suggested_category, ai_suggested_urgency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, created_at`,
      [name || null, phone || null, category, urgency, description.trim(), loc.exact_lat, loc.exact_lng, loc.approx_lat, loc.approx_lng, ai_suggested_category || null, ai_suggested_urgency || null]
    );

    return NextResponse.json({ success: true, id: rows[0].id }, { status: 201 });
  } catch (err) {
    console.error("needs error:", err);
    return NextResponse.json({ error: "Failed to save need report." }, { status: 500 });
  }
}
