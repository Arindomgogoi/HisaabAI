import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const MOCK_INSIGHTS = [
  "Royal Stag 750ml is your top seller this week with 45 units. Consider increasing warehouse stock by 2 cases.",
  "Tuesday and Friday evenings show 30% higher sales than other weekdays. Consider extra staffing on these days.",
  "Kingfisher Strong stock will last approximately 3 more days at current sales rate. Time to reorder!",
  "Your average profit margin improved by 1.2% this week. Whisky category is driving the highest margins at 22%.",
  "Credit (Khata) sales make up 15% of your revenue. 3 customers have outstanding balances over 80% of their limit.",
];

export function AIInsightCard() {
  // Pick a random insight based on current hour (changes throughout the day)
  const index = new Date().getHours() % MOCK_INSIGHTS.length;
  const insight = MOCK_INSIGHTS[index];

  return (
    <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          AI Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{insight}</p>
        <p className="text-xs text-muted-foreground mt-3">
          Powered by HisaabAI &middot; Updated hourly
        </p>
      </CardContent>
    </Card>
  );
}
