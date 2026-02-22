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

    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = (image.type || "image/jpeg") as
      | "image/jpeg"
      | "image/png"
      | "image/gif"
      | "image/webp";

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `This is a delivery challan or stock receipt from a liquor/beverage shop. Extract all product names and case quantities received.

Return ONLY a JSON array, no markdown, no extra text:
[{"productName": "product name as written", "cases": number}, ...]

Rules:
- Only include products with a clear case count (integer)
- "productName" should be the brand + product name as written (e.g. "Royal Stag", "Kingfisher Strong")
- If quantity is in bottles not cases, skip it
- If you cannot find any products, return []`,
            },
          ],
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text.trim() : "[]";

    // Strip markdown code fences if present
    const clean = text.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();

    const items = JSON.parse(clean);
    return NextResponse.json(Array.isArray(items) ? items : []);
  } catch (error) {
    console.error("Stock OCR error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
