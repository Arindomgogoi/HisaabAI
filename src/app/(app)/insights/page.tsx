"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Package,
  IndianRupee,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

type InsightType = "sales" | "inventory" | "revenue" | "recommendation";

interface Insight {
  type: InsightType;
  title: string;
  insight: string;
  action: string;
}

interface InsightsData {
  summary: string;
  insights: Insight[];
}

const typeConfig: Record<
  InsightType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    badge: string;
  }
> = {
  sales: {
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
    badge: "Sales",
  },
  inventory: {
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    badge: "Inventory",
  },
  revenue: {
    icon: IndianRupee,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    badge: "Revenue",
  },
  recommendation: {
    icon: Lightbulb,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    badge: "Tip",
  },
};

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function generateInsights() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/insights", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to generate insights");
      }
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not generate insights. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-amber-500" />
            AI Insights
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Claude-powered analysis of your business data
          </p>
        </div>
        <Button
          onClick={generateInsights}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {data ? "Refresh Analysis" : "Generate Insights"}
            </>
          )}
        </Button>
      </div>

      {/* Empty state */}
      {!data && !loading && !error && (
        <Card className="border-dashed">
          <CardContent className="py-20 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
              <Brain className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">
              Ready to Analyze Your Business
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Get AI-powered insights on your sales performance, inventory
              health, revenue trends, and actionable recommendations —
              powered by Claude.
            </p>
            <Button
              onClick={generateInsights}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-950/10">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 animate-pulse" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-40" />
                  <div className="h-3 bg-muted rounded animate-pulse w-72" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                    <div className="w-16 h-5 rounded-full bg-muted animate-pulse" />
                  </div>
                  <div className="h-5 bg-muted rounded animate-pulse w-36 mt-2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-3.5 bg-muted rounded animate-pulse" />
                  <div className="h-3.5 bg-muted rounded animate-pulse w-5/6" />
                  <div className="h-3.5 bg-muted rounded animate-pulse w-4/6" />
                  <div className="h-10 rounded-lg bg-muted/50 animate-pulse mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={generateInsights}
              className="mt-3"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-4">
          {/* Summary banner */}
          <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="py-4 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Business Health Summary</p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  {data.summary}
                </p>
              </div>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground shrink-0 mt-0.5">
                  {lastUpdated.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Insight cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.insights.map((insight, i) => {
              const config =
                typeConfig[insight.type] ?? typeConfig.recommendation;
              const Icon = config.icon;
              return (
                <Card key={i} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={cn("p-1.5 rounded-lg", config.bg)}>
                        <Icon className={cn("w-4 h-4", config.color)} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {config.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2">
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {insight.insight}
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs leading-relaxed">{insight.action}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center pb-2">
            Analysis based on your last 30 days of sales data &middot; Powered
            by Claude (Anthropic)
          </p>
        </div>
      )}
    </div>
  );
}
