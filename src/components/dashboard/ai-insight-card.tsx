"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";

interface Insight {
  type: string;
  title: string;
  description: string;
}

export function AIInsightCard() {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  async function fetchInsight() {
    setLoading(true);
    setUnavailable(false);
    try {
      const res = await fetch("/api/insights", { method: "POST" });
      if (res.status === 503) {
        setUnavailable(true);
        return;
      }
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      const first: Insight | undefined = data?.insights?.[0];
      if (first) setInsight(first);
      else setUnavailable(true);
    } catch {
      setUnavailable(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInsight();
  }, []);

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
      <CardContent className="flex items-start justify-between gap-4">
        {loading ? (
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ) : unavailable || !insight ? (
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            Get Claude-powered analysis of your sales, inventory, and revenue
            trends — tailored to your shop&apos;s real data.
          </p>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
              {insight.title}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.description}
            </p>
          </div>
        )}
        <div className="flex items-center gap-1.5 shrink-0">
          {!loading && !unavailable && insight && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
              onClick={fetchInsight}
              title="Refresh insight"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          )}
          <Link href="/insights">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
              {unavailable ? "Set Up AI" : "See All"}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
