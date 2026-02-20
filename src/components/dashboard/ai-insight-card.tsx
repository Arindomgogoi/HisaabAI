import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function AIInsightCard() {
  return (
    <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Get Claude-powered analysis of your sales, inventory, and revenue
          trends — tailored to your shop&apos;s real data.
        </p>
        <Link href="/insights" className="shrink-0">
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Analyse
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
