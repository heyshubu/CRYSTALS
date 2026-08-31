import { NextRequest, NextResponse } from "next/server";
import pool from "@/backend/db";

/**
 * POST /api/auth/login
 * Validates a login code. Returns role + session info.
 * Body: { code: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required." }, { status: 400 });
    }

    const trimmedCode = code.trim();

    // Check superadmin
    const adminResult = await pool.query(
      "SELECT passcode FROM admin_config WHERE passcode = $1",
      [trimmedCode]
    );
    if (adminResult.rows.length > 0) {
      return NextResponse.json({ role: "superadmin" });
    }

    // Check responder
    const respResult = await pool.query(
      `SELECT id, name, phone, skill, coverage, availability
       FROM responders WHERE login_code = $1`,
      [trimmedCode]
    );
    if (respResult.rows.length === 0) {
      return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 401 });
    }

    return NextResponse.json({ role: "responder", responder: respResult.rows[0] });
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
