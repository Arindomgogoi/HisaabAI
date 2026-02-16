import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  Brain,
  Receipt,
  Truck,
  ArrowRight,
  Check,
  IndianRupee,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description:
      "Real-time sales, inventory, and profit insights at a glance. AI-powered recommendations for your business.",
  },
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Dual warehouse & shop stock tracking with automatic case-to-unit conversion. Never run out of stock.",
  },
  {
    icon: ShoppingCart,
    title: "POS & Billing",
    description:
      "Lightning-fast billing with search, cart, and print-ready invoices. Cash, UPI, and Khata support.",
  },
  {
    icon: Truck,
    title: "Purchase Management",
    description:
      "Track supplier invoices, payments, and purchase history. AI-powered invoice OCR coming soon.",
  },
  {
    icon: FileText,
    title: "GST & Tax Reports",
    description:
      "Auto-calculate CGST, SGST, and IGST. GSTR-1 and GSTR-3B ready exports for easy filing.",
  },
  {
    icon: Brain,
    title: "AI Business Insights",
    description:
      "Ask questions in plain English or Hindi. Get demand forecasts, profit analysis, and weekly reports.",
  },
  {
    icon: Receipt,
    title: "Reports & Export",
    description:
      "Sales, purchase, stock, and P&L reports. Export to PDF, Excel, or CSV with one click.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "1 Shop",
      "100 Products",
      "Basic POS & Billing",
      "30-day Sales History",
      "Email Support",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "999",
    description: "For growing businesses",
    features: [
      "1 Shop",
      "Unlimited Products",
      "AI Business Insights",
      "GST Reports & Filing",
      "Invoice OCR",
      "Multi-user Access",
      "Priority Support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "2,999",
    description: "For multi-branch operations",
    features: [
      "Up to 10 Branches",
      "Everything in Pro",
      "API Access",
      "Custom Reports",
      "Dedicated Account Manager",
      "White-label Option",
      "24/7 Phone Support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">HisaabAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/5 via-transparent to-amber-500/5" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Business Management
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Run Your Shop{" "}
              <span className="text-amber-500">Smarter</span> with AI
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete business management for Indian retail shops. Inventory,
              billing, GST, and AI-powered insights — all in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 text-base"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 text-base">
                  View Demo
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Free forever for 1 shop.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="rounded-xl border bg-card shadow-2xl shadow-primary/5 overflow-hidden p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Today's Revenue", value: "₹48,750", change: "+12%" },
                  { label: "Items Sold", value: "127", change: "+8%" },
                  { label: "Avg Margin", value: "22.5%", change: "+1.2%" },
                  { label: "Transactions", value: "34", change: "+5%" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-lg bg-muted/50 p-4"
                  >
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className="text-xl md:text-2xl font-bold font-heading mt-1">
                      {card.value}
                    </p>
                    <p className="text-xs text-green-600 mt-1">{card.change}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/30 h-48 flex items-center justify-center text-muted-foreground text-sm">
                  Sales Trend Chart
                </div>
                <div className="rounded-lg bg-muted/30 h-48 flex items-center justify-center text-muted-foreground text-sm">
                  AI Insights Feed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30" id="features">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Everything Your Shop Needs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From inventory to invoicing, GST to AI insights — manage your
              entire business from one dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 text-amber-600 mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20" id="pricing">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free. Upgrade when you grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 ${
                  plan.highlighted
                    ? "border-amber-500 shadow-lg shadow-amber-500/10 relative"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <IndianRupee className="w-5 h-5" />
                  <span className="text-4xl font-heading font-extrabold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block mt-8">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-4 text-lg opacity-80">
            Join thousands of Indian shopkeepers already using HisaabAI to grow
            their business.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="mt-8 bg-amber-500 hover:bg-amber-600 text-white px-8 text-base"
            >
              Start Free — No Credit Card Needed
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-primary">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold">HisaabAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with care for Indian businesses
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
