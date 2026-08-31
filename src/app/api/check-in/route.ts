import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/db";
import { fuzzLocation } from "@/lib/fuzz-location";

/**
 * POST /api/check-in
 * Public endpoint — anyone can submit a safety check-in.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, status, lat, lng } = body;

    if (!status || !["safe", "need_help"].includes(status)) {
      return NextResponse.json({ error: "Status must be 'safe' or 'need_help'." }, { status: 400 });
    }
    if (lat == null || lng == null || typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "Valid lat and lng coordinates are required." }, { status: 400 });
    }

    const loc = fuzzLocation(lat, lng);

    const { rows, error } = await safeQuery(
      `INSERT INTO check_ins (name, phone, status, exact_lat, exact_lng, approx_lat, approx_lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [name || null, phone || null, status, loc.exact_lat, loc.exact_lng, loc.approx_lat, loc.approx_lng]
    );

    if (error || rows.length === 0) {
      return NextResponse.json({ error: "Failed to save check-in." }, { status: 500 });
    }
    return NextResponse.json({ success: true, id: rows[0].id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save check-in." }, { status: 500 });
  }
}
