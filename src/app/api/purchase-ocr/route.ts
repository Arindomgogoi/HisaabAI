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
              text: `This is a supplier invoice from a liquor/beverage distributor. Extract the invoice details.

Return ONLY a JSON object, no markdown, no extra text:
{
  "invoiceNumber": "invoice number as printed",
  "date": "YYYY-MM-DD format",
  "items": [
    {"productName": "brand + product name as written", "cases": number, "ratePerCase": number}
  ]
}

Rules:
- invoiceNumber: the bill/invoice number on the document (e.g. "INV-001", "TL-2024-056")
- date: the invoice date in YYYY-MM-DD format; use today's date if not visible
- items: each line item with product name, number of cases, and cost per case in rupees
- ratePerCase: the price per case (not per bottle), as a number without currency symbol
- If a field is not visible, use null
- Return [] for items if no line items found`,
            },
          ],
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text.trim() : "{}";

    const clean = text
      .replace(/^```[a-z]*\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    const result = JSON.parse(clean);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Purchase OCR error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
