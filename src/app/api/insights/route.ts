import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { getBusinessDataForAI } from "@/lib/data/insights";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopId = (session.user as Record<string, unknown>).shopId as string;
    if (!shopId) {
      return NextResponse.json({ error: "No shop found" }, { status: 400 });
    }

    const businessData = await getBusinessDataForAI(shopId);

    const prompt = `You are an AI business analyst for a liquor retail shop in India. Analyze the following real business data and provide actionable insights for the shop owner.

Business Data:
${JSON.stringify(businessData, null, 2)}

Provide exactly 5 insights as JSON. Be specific with numbers from the data. Cover: sales performance, inventory management, revenue trends, and business recommendations.

Rules:
- Use actual numbers from the data (revenue amounts, product names, quantities)
- If data is sparse (new shop), note what to track going forward
- Keep language simple and direct for a shop owner
- Action items must be practical and specific

Respond with ONLY this exact JSON (no markdown, no extra text):
{
  "summary": "2-sentence summary of overall business health with key numbers",
  "insights": [
    {
      "type": "sales",
      "title": "Short title",
      "insight": "Specific observation with numbers from the data (2-3 sentences)",
      "action": "One specific actionable step to take today or this week"
    },
    {
      "type": "inventory",
      "title": "Short title",
      "insight": "...",
      "action": "..."
    },
    {
      "type": "revenue",
      "title": "Short title",
      "insight": "...",
      "action": "..."
    },
    {
      "type": "recommendation",
      "title": "Short title",
      "insight": "...",
      "action": "..."
    },
    {
      "type": "recommendation",
      "title": "Short title",
      "insight": "...",
      "action": "..."
    }
  ]
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "{}";

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights. Please try again." },
      { status: 500 }
    );
  }
}
