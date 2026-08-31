/**
 * Direct Postgres connection pool — replaces the Supabase JS client.
 * Used by all API routes for database reads and writes.
 *
 * Supabase session mode limits to ~15 total connections.
 * We use max: 2 to stay well under that limit with serverless functions.
 */
import { Pool, type PoolClient } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 2,                    // Keep connections low — Supabase session mode caps at ~15
  idleTimeoutMillis: 10000,  // Release idle connections quickly
  connectionTimeoutMillis: 8000,
  allowExitOnIdle: true,     // Let pool shut down when idle
});

// Log connection errors but don't crash the server
pool.on("error", (err) => {
  console.error("Unexpected pool error:", err.message);
});

/**
 * Safe query helper — retries once on connection failure,
 * always returns { rows: [] } on error instead of crashing.
 */
export async function safeQuery(
  text: string,
  params?: unknown[]
): Promise<{ rows: any[]; error?: string }> {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const result = await client.query(text, params);
    return { rows: result.rows };
  } catch (err: any) {
    const msg = err?.message || "Database error";
    console.error("Query error:", msg);
    return { rows: [], error: msg };
  } finally {
    if (client) {
      try { client.release(); } catch { /* ignore */ }
    }
  }
}

// Test the connection on startup
pool.query("SELECT 1")
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

export default pool;
