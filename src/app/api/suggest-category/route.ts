import { NextRequest, NextResponse } from "next/server";
import type { NeedCategory, NeedUrgency } from "@/shared/types";

/**
 * POST /api/suggest-category
 *
 * Called from the Report Need page after a debounce pause.
 * Returns AI-suggested category and urgency from a description.
 * MUST fail silently — frontend handles empty/error gracefully.
 *
 * Body: { description: string }
 * Response: { category: NeedCategory, urgency: NeedUrgency } | { suggestion: null }
 *
 * This route NEVER exposes any API key to the browser.
 * In production, add your AI provider key to env vars (e.g. OPENAI_API_KEY)
 * and call the provider here. For now, uses a simple rule-based fallback.
 */
export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json({ suggestion: null });
    }

    // ──────────────────────────────────────────────────────
    // AI INTEGRATION POINT
    //
    // Replace the block below with your AI provider call.
    // Example for OpenAI:
    //
    //   const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    //     },
    //     body: JSON.stringify({
    //       model: "gpt-4o-mini",
    //       messages: [
    //         {
    //           role: "system",
    //           content: `You classify disaster relief needs. Return JSON with "category" (food/water/medical/shelter/transport) and "urgency" (low/medium/high). Description:`,
    //         },
    //         { role: "user", content: description },
    //       ],
    //       response_format: { type: "json_object" },
    //     }),
    //   });
    //   const data = await response.json();
    //   const parsed = JSON.parse(data.choices[0].message.content);
    //   return NextResponse.json({ suggestion: parsed });
    //
    // ──────────────────────────────────────────────────────

    // PLACEHOLDER: simple keyword-based rule until AI is connected
    const text = description.toLowerCase();
    let category: NeedCategory = "food";
    let urgency: NeedUrgency = "medium";

    // Category matching
    if (text.includes("medic") || text.includes("injur") || text.includes("bleed") || text.includes("sick") || text.includes("hospital")) {
      category = "medical";
    } else if (text.includes("water") || text.includes("drink") || text.includes("thirst")) {
      category = "water";
    } else if (text.includes("food") || text.includes("eat") || text.includes("hungry") || text.includes("meal")) {
      category = "food";
    } else if (text.includes("shelter") || text.includes("roof") || text.includes("house") || text.includes("sleep") || text.includes("homeless")) {
      category = "shelter";
    } else if (text.includes("transport") || text.includes("vehicle") || text.includes("car") || text.includes("carry") || text.includes("move")) {
      category = "transport";
    }

    // Urgency matching
    if (text.includes("urgent") || text.includes("critical") || text.includes("emergency") || text.includes("dying") || text.includes("bleeding")) {
      urgency = "high";
    } else if (text.includes("soon") || text.includes("quickly") || text.includes("running out")) {
      urgency = "high";
    } else if (text.includes("no rush") || text.includes("whenever") || text.includes("low priority")) {
      urgency = "low";
    }

    return NextResponse.json({ suggestion: { category, urgency } });
  } catch (err) {
    // FAIL SILENTLY — return null so the frontend just doesn't pre-fill
    console.error("suggest-category error:", err);
    return NextResponse.json({ suggestion: null });
  }
}
