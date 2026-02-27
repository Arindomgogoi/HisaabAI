# HisaabAI — AI-Powered ERP & POS for Indian Liquor Retail

HisaabAI is a complete business management system built for Indian liquor shops. It combines a fast Point-of-Sale interface with AI-powered insights, GST compliance, inventory management, and a credit ledger (Khata) — all in one web app that works offline on mobile.

---

## Features

### Point of Sale
- Touch-friendly POS with product search and voice-to-order (AI-powered)
- Cart with quantity, discount, and payment mode selection (Cash / UPI / Credit)
- Invoice generation with GST breakup
- Thermal receipt printing support
- Credit sales linked to Khata customers

### Inventory Management
- Track warehouse stock (cases) and shop floor stock (bottles) separately
- Low stock alerts and reorder-level configuration
- Physical stock counting with anomaly detection
- Warehouse-to-shop transfer management

### GST Compliance
- Per-product GST rates (CGST + SGST split)
- GSTR-1 and GSTR-3B summary reports
- HSN code tracking (2208, 2204, 2203)

### AI Features (powered by Claude)
- **Business Insights** — daily AI analysis of sales patterns and anomalies
- **Voice-to-Order** — speak your order, AI parses it into products
- **Invoice OCR** — photograph a supplier invoice, AI extracts the data
- **Stock OCR** — photograph stock to update counts automatically

### Supplier & Purchase Management
- Record purchases from suppliers with invoice numbers
- Track payment status (paid / pending)
- Case-based ordering with cost-per-case tracking

### Khata (Credit Ledger)
- Credit limits per customer
- Running balance tracking
- Full credit transaction history

### Reports
- Daily, weekly, monthly revenue breakdowns
- Top products by quantity and revenue
- Payment mode split (Cash / UPI / Credit)
- CSV export for accountants

### Multi-Role Access
- **Owner** — full access including settings and reports
- **Manager** — sales, inventory, purchases
- **Staff** — POS only

### Mobile & Offline
- PWA: installable on Android and iOS
- Works offline (service worker cache)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | PostgreSQL (Neon serverless in prod, Docker locally) |
| ORM | Prisma 7 |
| Auth | NextAuth v5 (JWT sessions) |
| AI | Anthropic Claude API (Sonnet 4.6 + Haiku 4.5) |
| Deployment | Vercel (frontend) + Neon (database) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- Docker (for local PostgreSQL) or a Neon account
- An Anthropic API key

### 1. Clone and install

```bash
git clone <repo-url>
cd HisaabAI
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# PostgreSQL — use your Neon URL for prod, or the Docker URL for local dev
DATABASE_URL="postgresql://hisaab:hisaab_dev_2024@localhost:5433/hisaab_ai"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-random-32-char-secret"
AUTH_SECRET="your-random-32-char-secret"

NEXTAUTH_URL="http://localhost:3000"

# Get from https://console.anthropic.com
ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

### 3. Start the database (local dev)

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5433.

### 4. Set up the database

```bash
# Apply schema
npx prisma db push

# (Optional) Seed with 90 days of sample data
npx prisma db seed
```

Demo login after seeding: `admin@hisaab.ai` / `password123`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel + Neon)

1. Create a [Neon](https://neon.tech) database and copy the connection string
2. Push to GitHub and import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel → Project → Settings → Environment Variables:
   - `DATABASE_URL` — your Neon connection string
   - `NEXTAUTH_SECRET` — random 32-char string
   - `AUTH_SECRET` — same or different random string
   - `NEXTAUTH_URL` — your Vercel deployment URL (e.g. `https://hisaab-ai.vercel.app`)
   - `ANTHROPIC_API_KEY` — your Claude API key
4. Deploy — Vercel runs `prisma generate && next build` automatically

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | JWT signing secret (32+ chars) |
| `AUTH_SECRET` | Yes | NextAuth auth secret |
| `NEXTAUTH_URL` | Yes | Full URL of the app |
| `ANTHROPIC_API_KEY` | Yes | Claude API key for AI features |

---

## Project Structure

```
src/
├── app/
│   ├── (app)/           # Protected routes (dashboard, POS, inventory, etc.)
│   ├── (marketing)/     # Public pages (landing, login, register)
│   └── api/             # API routes (auth, AI endpoints)
├── components/          # React components by feature
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # DB client
│   ├── validators.ts    # Zod schemas
│   └── data/            # Server-side data fetching helpers
└── types/               # TypeScript types
prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Demo data seeder
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma db push` | Apply schema changes |
| `npx prisma db seed` | Seed demo data |
| `npx prisma studio` | Open Prisma Studio (DB browser) |

---

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run build` to verify
4. Open a pull request with a clear description

---

## License

Private — all rights reserved.
