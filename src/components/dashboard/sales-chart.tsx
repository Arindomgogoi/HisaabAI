"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatINRCompact } from "@/lib/formatters";
import { CATEGORY_LABELS } from "@/lib/constants";

interface SalesTrendPoint {
  date: string;
  revenue: number;
  items: number;
  transactions: number;
}

interface CategorySale {
  category: string;
  revenue: number;
}

interface SalesChartProps {
  trendData: SalesTrendPoint[];
  categoryData: CategorySale[];
}

export function SalesChart({ trendData, categoryData }: SalesChartProps) {
  const categoryWithLabels = categoryData.map((c) => ({
    ...c,
    name: CATEGORY_LABELS[c.category as keyof typeof CATEGORY_LABELS] ?? c.category,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trend" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-[240px]">
            <TabsTrigger value="trend">Revenue Trend</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
          </TabsList>
          <TabsContent value="trend" className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatINRCompact(v)}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [formatINRCompact(value ?? 0), "Revenue"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="category" className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryWithLabels} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatINRCompact(v)}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={70}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [formatINRCompact(value ?? 0), "Revenue"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                  }}
                />
                <Bar dataKey="revenue" fill="#1e1b4b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
