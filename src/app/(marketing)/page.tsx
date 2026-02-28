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
  X,
  Smartphone,
  Shield,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description:
      "Real-time sales, inventory, and profit insights at a glance. AI-powered recommendations for your business.",
    badge: "Live",
  },
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Dual warehouse & shop stock tracking with automatic case-to-unit conversion. Never run out of stock.",
    badge: "Live",
  },
  {
    icon: ShoppingCart,
    title: "POS & Billing",
    description:
      "Lightning-fast billing with search, cart, and print-ready invoices. Cash, UPI, and Khata support.",
    badge: "Live",
  },
  {
    icon: Truck,
    title: "Purchase Management",
    description:
      "Track supplier invoices, payments, and purchase history. Know exactly what you bought and for how much.",
    badge: "Live",
  },
  {
    icon: FileText,
    title: "Excise & Compliance Reports",
    description:
      "Track monthly sales and purchases for State Excise compliance. Monthly business summaries for audit records.",
    badge: "Live",
  },
  {
    icon: Brain,
    title: "AI Business Insights",
    description:
      "Claude-powered analysis of your sales and inventory. Get demand forecasts and weekly business summaries.",
    badge: "AI",
  },
  {
    icon: Receipt,
    title: "Reports & Export",
    description:
      "Sales, purchase, stock, and P&L reports. Export to PDF, Excel, or CSV with one click.",
    badge: "Live",
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
      "Excise Compliance Reports",
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

const steps = [
  {
    number: "01",
    title: "Add your products",
    description:
      "Enter your inventory once — products, brands, sizes, prices, and stock levels. HisaabAI handles the rest.",
    icon: Package,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    number: "02",
    title: "Sell & track",
    description:
      "Use the POS to ring up sales in seconds. Every transaction updates your stock automatically.",
    icon: ShoppingCart,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    number: "03",
    title: "Get AI insights",
    description:
      "Claude analyses your data and tells you what's selling, what's not, and what to reorder.",
    icon: Brain,
    color: "text-violet-600",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
];

const faqs = [
  {
    q: "Is HisaabAI really free to start?",
    a: "Yes. The Free plan supports 1 shop, up to 100 products, and full POS & billing — forever. No credit card required. Upgrade to Pro when you need AI insights or unlimited products.",
  },
  {
    q: "Does it work for my type of shop?",
    a: "HisaabAI is built specifically for regulated retail — liquor shops, wine & beer stores, and similar businesses that need multi-size inventory tracking and State Excise compliance. Perfect for shops governed by state excise departments.",
  },
  {
    q: "How does Excise compliance work?",
    a: "Liquor in India is governed by State Excise Duty — not GST. HisaabAI tracks your monthly sales and purchases and generates a compliance summary you can use for excise audit records and annual returns.",
  },
  {
    q: "Is my data safe?",
    a: "All data is stored in an encrypted PostgreSQL database (Neon). Your shop data is isolated — no other user can see your records. We never sell your data.",
  },
  {
    q: "Does it work on mobile phones?",
    a: "Yes. HisaabAI is fully responsive and works on any phone browser — no app download needed. The POS is designed for fast touch-based checkout.",
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
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 relative">
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
              billing, excise compliance, and AI-powered insights — all in one place.
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
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  Try Demo
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Free forever for 1 shop.
            </p>
          </div>

          {/* Dashboard Preview — realistic mockup */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="rounded-xl border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Mock topbar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/60" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/60" />
                  <span className="w-3 h-3 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground font-medium">HisaabAI — Dashboard</span>
                </div>
              </div>
              <div className="flex">
                {/* Mock sidebar */}
                <div className="hidden md:flex flex-col gap-1 w-44 border-r p-3 bg-muted/10">
                  {["Dashboard", "Inventory", "Sales & POS", "Purchases", "Excise & Compliance", "AI Insights", "Reports"].map((item, i) => (
                    <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${i === 0 ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>
                      <span className="w-3 h-3 rounded-sm bg-current opacity-60" />
                      {item}
                    </div>
                  ))}
                </div>
                {/* Mock main content */}
                <div className="flex-1 p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 w-24 bg-foreground/80 rounded font-heading font-bold text-sm" />
                      <div className="h-2.5 w-36 bg-muted rounded mt-1" />
                    </div>
                    <div className="h-8 w-28 rounded-lg bg-amber-500/80" />
                  </div>
                  {/* Metric cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Today's Revenue", value: "₹48,750", change: "+12%", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                      { label: "Items Sold", value: "127", change: "+8%", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
                      { label: "Avg Margin", value: "22.5%", change: "+1.2%", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
                      { label: "Transactions", value: "34", change: "+5%", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
                    ].map((card) => (
                      <div key={card.label} className="rounded-lg border bg-card p-3">
                        <p className="text-[10px] text-muted-foreground">{card.label}</p>
                        <p className="text-lg font-heading font-bold mt-1">{card.value}</p>
                        <p className={`text-[10px] font-medium mt-0.5 ${card.color}`}>{card.change} vs yesterday</p>
                      </div>
                    ))}
                  </div>
                  {/* AI insight strip */}
                  <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 p-3 flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-xs text-muted-foreground flex-1">
                      <span className="font-medium text-amber-700 dark:text-amber-400">AI Insight: </span>
                      Whisky sales are up 18% this week. Royal Stag 750ml is your top seller — consider restocking before the weekend.
                    </p>
                  </div>
                  {/* Chart placeholder */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 rounded-lg border bg-card p-3">
                      <p className="text-[10px] text-muted-foreground mb-2">Sales Trend (7 days)</p>
                      <div className="flex items-end gap-1 h-16">
                        {[40, 65, 50, 80, 55, 90, 75].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t bg-amber-400/70" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <p className="text-[10px] text-muted-foreground mb-2">Low Stock</p>
                      {["Royal Stag 750ml", "Old Monk 180ml", "Kingfisher 650ml"].map((name) => (
                        <div key={name} className="flex items-center gap-1.5 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                          <p className="text-[10px] text-muted-foreground truncate">{name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <div className="border-y bg-muted/30 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Excise Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Works on any phone</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Built for Indian retail</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-600" />
              <span>Powered by Claude AI</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Free to start</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              No training. No complicated setup. Just open the browser and start.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-border" />
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-4">
                <div className={`relative flex items-center justify-center w-20 h-20 rounded-2xl ${step.bg}`}>
                  <step.icon className={`w-9 h-9 ${step.color}`} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border text-xs font-bold flex items-center justify-center">
                    {step.number.slice(-1)}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
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
              From inventory to invoicing, excise compliance to AI insights — manage your
              entire business from one dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    feature.badge === "AI"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}>
                    {feature.badge}
                  </span>
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

      {/* Comparison */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Why HisaabAI?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how we compare to generic business tools.
            </p>
          </div>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="p-4 font-heading font-bold text-amber-600 text-center">HisaabAI</th>
                  <th className="p-4 text-center text-muted-foreground font-medium">KhataBook</th>
                  <th className="p-4 text-center text-muted-foreground font-medium">Vyapar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI business insights", true, false, false],
                  ["Excise compliance reports", true, false, true],
                  ["Multi-size inventory (750ml/375ml/180ml)", true, false, false],
                  ["Invoice OCR (Telegram bot)", true, false, false],
                  ["Liquor retail compliance", true, false, false],
                  ["Free to start", true, true, true],
                ].map(([feature, h, k, v]) => (
                  <tr key={feature as string} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">{feature as string}</td>
                    <td className="p-4 text-center">
                      {h ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                    </td>
                    <td className="p-4 text-center">
                      {k ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                    </td>
                    <td className="p-4 text-center">
                      {v ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30" id="pricing">
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
                className={`rounded-xl border p-8 bg-card ${
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

      {/* FAQ */}
      <section className="py-20" id="faq">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border bg-card overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none select-none hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-sm md:text-base">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </details>
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
          <p className="mt-4 text-lg opacity-80 max-w-xl mx-auto">
            Join Indian shopkeepers already using HisaabAI to track inventory,
            stay excise compliant, and grow their business with AI.
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
      <footer className="border-t py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
                  <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-heading text-lg font-bold">HisaabAI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered business management for Indian retail shops.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link></li>
                <li><Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">App</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/inventory" className="hover:text-foreground transition-colors">Inventory</Link></li>
                <li><Link href="/sales/pos" className="hover:text-foreground transition-colors">POS</Link></li>
                <li><Link href="/gst" className="hover:text-foreground transition-colors">Excise Reports</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">Register</Link></li>
                <li><Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              © 2025 HisaabAI. Made with care for Indian businesses.
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by Claude AI · Built on Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
