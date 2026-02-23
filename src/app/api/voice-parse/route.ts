import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 503 });
    }

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transcript, productNames } = await request.json() as {
      transcript: string;
      productNames: string[];
    };

    if (!transcript?.trim()) {
      return NextResponse.json([]);
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `A shopkeeper spoke this order: "${transcript}"

Available products: ${productNames.join(", ")}

Extract what they want to sell. Match each item to the closest product from the list above.

Return ONLY a JSON array, no markdown:
[{"productName": "exact name from the list", "quantity": number}, ...]

Rules:
- quantity defaults to 1 if not specified
- Match brand names even if partially spoken (e.g. "Royal" → "Royal Stag", "Kingfisher" → "Kingfisher Strong")
- If nothing matches, return []`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text.trim() : "[]";
    const clean = text
      .replace(/^```[a-z]*\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    const items = JSON.parse(clean);
    return NextResponse.json(Array.isArray(items) ? items : []);
  } catch (error) {
    console.error("Voice parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse voice input" },
      { status: 500 }
    );
  }
}
