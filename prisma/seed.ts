import { PrismaClient, ProductCategory, SizeUnit, PaymentMode } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Product Data ────────────────────────────────────────

interface ProductSeed {
  name: string;
  brand: string;
  category: ProductCategory;
  sizes: {
    size: SizeUnit;
    mrp: number;
    costPrice: number;
    bpc: number;
    warehouseCases: number;
    shopBottles: number;
  }[];
}

const products: ProductSeed[] = [
  // ── WHISKY ──
  {
    name: "Royal Stag",
    brand: "Pernod Ricard",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 540, costPrice: 420, bpc: 12, warehouseCases: 15, shopBottles: 48 },
      { size: "ML_375", mrp: 280, costPrice: 220, bpc: 24, warehouseCases: 8, shopBottles: 72 },
      { size: "ML_180", mrp: 140, costPrice: 110, bpc: 48, warehouseCases: 5, shopBottles: 96 },
    ],
  },
  {
    name: "Blenders Pride",
    brand: "Pernod Ricard",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 880, costPrice: 700, bpc: 12, warehouseCases: 10, shopBottles: 36 },
      { size: "ML_375", mrp: 450, costPrice: 360, bpc: 24, warehouseCases: 5, shopBottles: 48 },
      { size: "ML_180", mrp: 230, costPrice: 180, bpc: 48, warehouseCases: 3, shopBottles: 48 },
    ],
  },
  {
    name: "Imperial Blue",
    brand: "Pernod Ricard",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 620, costPrice: 490, bpc: 12, warehouseCases: 12, shopBottles: 36 },
      { size: "ML_375", mrp: 320, costPrice: 250, bpc: 24, warehouseCases: 6, shopBottles: 60 },
      { size: "ML_180", mrp: 160, costPrice: 125, bpc: 48, warehouseCases: 4, shopBottles: 72 },
    ],
  },
  {
    name: "Signature",
    brand: "McDowell's",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 960, costPrice: 760, bpc: 12, warehouseCases: 8, shopBottles: 24 },
      { size: "ML_375", mrp: 490, costPrice: 390, bpc: 24, warehouseCases: 4, shopBottles: 24 },
    ],
  },
  {
    name: "McDowell's No.1",
    brand: "United Spirits",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 480, costPrice: 380, bpc: 12, warehouseCases: 18, shopBottles: 60 },
      { size: "ML_375", mrp: 250, costPrice: 195, bpc: 24, warehouseCases: 10, shopBottles: 96 },
      { size: "ML_180", mrp: 125, costPrice: 98, bpc: 48, warehouseCases: 6, shopBottles: 120 },
    ],
  },
  {
    name: "Officers Choice",
    brand: "ABD",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 440, costPrice: 345, bpc: 12, warehouseCases: 20, shopBottles: 72 },
      { size: "ML_375", mrp: 225, costPrice: 175, bpc: 24, warehouseCases: 12, shopBottles: 120 },
      { size: "ML_180", mrp: 115, costPrice: 90, bpc: 48, warehouseCases: 8, shopBottles: 144 },
    ],
  },
  {
    name: "Antiquity Blue",
    brand: "United Spirits",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 780, costPrice: 620, bpc: 12, warehouseCases: 6, shopBottles: 24 },
      { size: "ML_375", mrp: 400, costPrice: 320, bpc: 24, warehouseCases: 3, shopBottles: 24 },
    ],
  },
  {
    name: "Black Dog",
    brand: "United Spirits",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 1480, costPrice: 1180, bpc: 12, warehouseCases: 4, shopBottles: 12 },
    ],
  },
  {
    name: "100 Pipers",
    brand: "Pernod Ricard",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 1350, costPrice: 1080, bpc: 12, warehouseCases: 3, shopBottles: 12 },
    ],
  },
  {
    name: "Johnnie Walker Red Label",
    brand: "Diageo",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 1850, costPrice: 1480, bpc: 12, warehouseCases: 2, shopBottles: 6 },
    ],
  },
  {
    name: "Jack Daniel's",
    brand: "Brown-Forman",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 2950, costPrice: 2360, bpc: 12, warehouseCases: 1, shopBottles: 4 },
    ],
  },
  {
    name: "Mansion House",
    brand: "Tilaknagar",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 380, costPrice: 300, bpc: 12, warehouseCases: 10, shopBottles: 36 },
      { size: "ML_375", mrp: 195, costPrice: 155, bpc: 24, warehouseCases: 6, shopBottles: 48 },
      { size: "ML_180", mrp: 100, costPrice: 80, bpc: 48, warehouseCases: 4, shopBottles: 96 },
    ],
  },
  {
    name: "8 PM",
    brand: "Radico Khaitan",
    category: "WHISKY",
    sizes: [
      { size: "ML_750", mrp: 520, costPrice: 410, bpc: 12, warehouseCases: 8, shopBottles: 24 },
      { size: "ML_375", mrp: 270, costPrice: 215, bpc: 24, warehouseCases: 4, shopBottles: 48 },
    ],
  },
  // ── RUM ──
  {
    name: "Old Monk",
    brand: "Mohan Meakin",
    category: "RUM",
    sizes: [
      { size: "ML_750", mrp: 450, costPrice: 360, bpc: 12, warehouseCases: 12, shopBottles: 48 },
      { size: "ML_375", mrp: 230, costPrice: 185, bpc: 24, warehouseCases: 6, shopBottles: 48 },
      { size: "ML_180", mrp: 120, costPrice: 95, bpc: 48, warehouseCases: 4, shopBottles: 72 },
    ],
  },
  {
    name: "Bacardi White",
    brand: "Bacardi",
    category: "RUM",
    sizes: [
      { size: "ML_750", mrp: 880, costPrice: 700, bpc: 12, warehouseCases: 5, shopBottles: 18 },
    ],
  },
  {
    name: "Captain Morgan",
    brand: "Diageo",
    category: "RUM",
    sizes: [
      { size: "ML_750", mrp: 1100, costPrice: 880, bpc: 12, warehouseCases: 3, shopBottles: 12 },
    ],
  },
  {
    name: "McDowell's No.1 Celebration",
    brand: "United Spirits",
    category: "RUM",
    sizes: [
      { size: "ML_750", mrp: 380, costPrice: 300, bpc: 12, warehouseCases: 10, shopBottles: 36 },
      { size: "ML_375", mrp: 195, costPrice: 155, bpc: 24, warehouseCases: 6, shopBottles: 60 },
      { size: "ML_180", mrp: 100, costPrice: 80, bpc: 48, warehouseCases: 4, shopBottles: 72 },
    ],
  },
  {
    name: "Hercules",
    brand: "United Spirits",
    category: "RUM",
    sizes: [
      { size: "ML_750", mrp: 350, costPrice: 275, bpc: 12, warehouseCases: 8, shopBottles: 24 },
      { size: "ML_180", mrp: 95, costPrice: 75, bpc: 48, warehouseCases: 4, shopBottles: 48 },
    ],
  },
  {
    name: "Magic Moments Remix",
    brand: "Radico Khaitan",
    category: "RUM",
    sizes: [
      { size: "ML_750", mrp: 520, costPrice: 410, bpc: 12, warehouseCases: 5, shopBottles: 18 },
    ],
  },
  // ── VODKA ──
  {
    name: "Magic Moments",
    brand: "Radico Khaitan",
    category: "VODKA",
    sizes: [
      { size: "ML_750", mrp: 620, costPrice: 490, bpc: 12, warehouseCases: 6, shopBottles: 24 },
      { size: "ML_375", mrp: 320, costPrice: 255, bpc: 24, warehouseCases: 3, shopBottles: 24 },
      { size: "ML_180", mrp: 165, costPrice: 130, bpc: 48, warehouseCases: 2, shopBottles: 48 },
    ],
  },
  {
    name: "Smirnoff",
    brand: "Diageo",
    category: "VODKA",
    sizes: [
      { size: "ML_750", mrp: 880, costPrice: 700, bpc: 12, warehouseCases: 4, shopBottles: 12 },
      { size: "ML_375", mrp: 450, costPrice: 360, bpc: 24, warehouseCases: 2, shopBottles: 12 },
    ],
  },
  {
    name: "Absolut",
    brand: "Pernod Ricard",
    category: "VODKA",
    sizes: [
      { size: "ML_750", mrp: 1850, costPrice: 1480, bpc: 12, warehouseCases: 2, shopBottles: 6 },
    ],
  },
  {
    name: "Romanov",
    brand: "United Spirits",
    category: "VODKA",
    sizes: [
      { size: "ML_750", mrp: 440, costPrice: 350, bpc: 12, warehouseCases: 6, shopBottles: 24 },
      { size: "ML_375", mrp: 225, costPrice: 180, bpc: 24, warehouseCases: 3, shopBottles: 36 },
    ],
  },
  {
    name: "White Mischief",
    brand: "United Spirits",
    category: "VODKA",
    sizes: [
      { size: "ML_750", mrp: 480, costPrice: 380, bpc: 12, warehouseCases: 5, shopBottles: 18 },
      { size: "ML_375", mrp: 250, costPrice: 200, bpc: 24, warehouseCases: 3, shopBottles: 24 },
    ],
  },
  // ── GIN ──
  {
    name: "Bombay Sapphire",
    brand: "Bacardi",
    category: "GIN",
    sizes: [
      { size: "ML_750", mrp: 2400, costPrice: 1920, bpc: 12, warehouseCases: 1, shopBottles: 4 },
    ],
  },
  {
    name: "Greater Than",
    brand: "Nao Spirits",
    category: "GIN",
    sizes: [
      { size: "ML_750", mrp: 1450, costPrice: 1160, bpc: 12, warehouseCases: 2, shopBottles: 6 },
    ],
  },
  {
    name: "Gordon's",
    brand: "Diageo",
    category: "GIN",
    sizes: [
      { size: "ML_750", mrp: 950, costPrice: 760, bpc: 12, warehouseCases: 3, shopBottles: 8 },
    ],
  },
  // ── BRANDY ──
  {
    name: "Mansion House Brandy",
    brand: "Tilaknagar",
    category: "BRANDY",
    sizes: [
      { size: "ML_750", mrp: 420, costPrice: 330, bpc: 12, warehouseCases: 6, shopBottles: 24 },
      { size: "ML_375", mrp: 215, costPrice: 170, bpc: 24, warehouseCases: 3, shopBottles: 36 },
      { size: "ML_180", mrp: 110, costPrice: 88, bpc: 48, warehouseCases: 2, shopBottles: 48 },
    ],
  },
  {
    name: "Honey Bee",
    brand: "United Spirits",
    category: "BRANDY",
    sizes: [
      { size: "ML_750", mrp: 380, costPrice: 300, bpc: 12, warehouseCases: 5, shopBottles: 18 },
      { size: "ML_180", mrp: 100, costPrice: 80, bpc: 48, warehouseCases: 3, shopBottles: 48 },
    ],
  },
  {
    name: "Morpheus",
    brand: "Radico Khaitan",
    category: "BRANDY",
    sizes: [
      { size: "ML_750", mrp: 850, costPrice: 680, bpc: 12, warehouseCases: 3, shopBottles: 12 },
    ],
  },
  {
    name: "Paul John",
    brand: "John Distilleries",
    category: "BRANDY",
    sizes: [
      { size: "ML_750", mrp: 1250, costPrice: 1000, bpc: 12, warehouseCases: 2, shopBottles: 6 },
    ],
  },
  // ── WINE ──
  {
    name: "Sula Rasa Shiraz",
    brand: "Sula Vineyards",
    category: "WINE",
    sizes: [
      { size: "ML_750", mrp: 750, costPrice: 600, bpc: 12, warehouseCases: 3, shopBottles: 8 },
    ],
  },
  {
    name: "Sula Dindori Reserve",
    brand: "Sula Vineyards",
    category: "WINE",
    sizes: [
      { size: "ML_750", mrp: 1100, costPrice: 880, bpc: 12, warehouseCases: 2, shopBottles: 4 },
    ],
  },
  {
    name: "Four Seasons",
    brand: "United Spirits",
    category: "WINE",
    sizes: [
      { size: "ML_750", mrp: 550, costPrice: 440, bpc: 12, warehouseCases: 3, shopBottles: 8 },
    ],
  },
  {
    name: "Big Banyan Merlot",
    brand: "Big Banyan",
    category: "WINE",
    sizes: [
      { size: "ML_750", mrp: 680, costPrice: 540, bpc: 12, warehouseCases: 2, shopBottles: 6 },
    ],
  },
  {
    name: "Fratelli Sette",
    brand: "Fratelli Wines",
    category: "WINE",
    sizes: [
      { size: "ML_750", mrp: 850, costPrice: 680, bpc: 12, warehouseCases: 2, shopBottles: 4 },
    ],
  },
  // ── BEER ──
  {
    name: "Kingfisher Strong",
    brand: "United Breweries",
    category: "BEER",
    sizes: [
      { size: "BOTTLE_650", mrp: 210, costPrice: 165, bpc: 12, warehouseCases: 20, shopBottles: 72 },
      { size: "CAN_500", mrp: 180, costPrice: 140, bpc: 24, warehouseCases: 10, shopBottles: 96 },
    ],
  },
  {
    name: "Kingfisher Premium",
    brand: "United Breweries",
    category: "BEER",
    sizes: [
      { size: "BOTTLE_650", mrp: 190, costPrice: 150, bpc: 12, warehouseCases: 15, shopBottles: 48 },
      { size: "CAN_500", mrp: 160, costPrice: 125, bpc: 24, warehouseCases: 8, shopBottles: 72 },
    ],
  },
  {
    name: "Tuborg Green",
    brand: "Carlsberg",
    category: "BEER",
    sizes: [
      { size: "BOTTLE_650", mrp: 180, costPrice: 140, bpc: 12, warehouseCases: 10, shopBottles: 36 },
      { size: "CAN_500", mrp: 150, costPrice: 120, bpc: 24, warehouseCases: 6, shopBottles: 48 },
    ],
  },
  {
    name: "Budweiser",
    brand: "AB InBev",
    category: "BEER",
    sizes: [
      { size: "BOTTLE_650", mrp: 220, costPrice: 175, bpc: 12, warehouseCases: 8, shopBottles: 36 },
      { size: "CAN_500", mrp: 190, costPrice: 150, bpc: 24, warehouseCases: 6, shopBottles: 48 },
    ],
  },
  {
    name: "Heineken",
    brand: "Heineken",
    category: "BEER",
    sizes: [
      { size: "BOTTLE_650", mrp: 230, costPrice: 185, bpc: 12, warehouseCases: 5, shopBottles: 24 },
      { size: "CAN_500", mrp: 200, costPrice: 160, bpc: 24, warehouseCases: 4, shopBottles: 36 },
    ],
  },
  {
    name: "Carlsberg Elephant",
    brand: "Carlsberg",
    category: "BEER",
    sizes: [
      { size: "BOTTLE_650", mrp: 200, costPrice: 160, bpc: 12, warehouseCases: 8, shopBottles: 36 },
      { size: "CAN_500", mrp: 170, costPrice: 135, bpc: 24, warehouseCases: 5, shopBottles: 48 },
    ],
  },
  {
    name: "Corona Extra",
    brand: "AB InBev",
    category: "BEER",
    sizes: [
      { size: "BOTTLE_650", mrp: 280, costPrice: 225, bpc: 12, warehouseCases: 3, shopBottles: 12 },
    ],
  },
  {
    name: "Bira White",
    brand: "B9 Beverages",
    category: "BEER",
    sizes: [
      { size: "CAN_500", mrp: 200, costPrice: 160, bpc: 24, warehouseCases: 4, shopBottles: 24 },
    ],
  },
  {
    name: "Bira Blonde",
    brand: "B9 Beverages",
    category: "BEER",
    sizes: [
      { size: "CAN_500", mrp: 190, costPrice: 150, bpc: 24, warehouseCases: 4, shopBottles: 24 },
    ],
  },
  {
    name: "Simba Stout",
    brand: "Simba",
    category: "BEER",
    sizes: [
      { size: "CAN_500", mrp: 220, costPrice: 175, bpc: 24, warehouseCases: 2, shopBottles: 12 },
    ],
  },
];

// ─── Suppliers ───────────────────────────────────────────

const suppliers = [
  { name: "United Spirits Ltd", contactName: "Rajesh Verma", phone: "9876543210", gstNumber: "27AABCU9603E1ZA", address: "Lower Parel, Mumbai" },
  { name: "Pernod Ricard India", contactName: "Ankit Sharma", phone: "9876543211", gstNumber: "27AADCP5678F1ZB", address: "Gurgaon, Haryana" },
  { name: "Allied Blenders & Distillers", contactName: "Suresh Patil", phone: "9876543212", gstNumber: "27AABCA1234G1ZC", address: "Andheri, Mumbai" },
  { name: "Radico Khaitan Ltd", contactName: "Vinod Kumar", phone: "9876543213", gstNumber: "09AABCR9876H1ZD", address: "Rampur, UP" },
  { name: "United Breweries Ltd", contactName: "Pradeep Shetty", phone: "9876543214", gstNumber: "29AABCU5432J1ZE", address: "Bangalore, Karnataka" },
];

// ─── Customers (Khata) ──────────────────────────────────

const customers = [
  { name: "Ramesh Gupta", phone: "9988776601", creditLimit: 10000, creditBalance: 3500 },
  { name: "Sunil Yadav", phone: "9988776602", creditLimit: 5000, creditBalance: 1200 },
  { name: "Vikram Singh", phone: "9988776603", creditLimit: 8000, creditBalance: 5600 },
  { name: "Ajay Tiwari", phone: "9988776604", creditLimit: 3000, creditBalance: 0 },
  { name: "Deepak Sharma", phone: "9988776605", creditLimit: 6000, creditBalance: 2800 },
  { name: "Manoj Pandey", phone: "9988776606", creditLimit: 4000, creditBalance: 850 },
  { name: "Rajendra Patil", phone: "9988776607", creditLimit: 7000, creditBalance: 4200 },
  { name: "Santosh Mane", phone: "9988776608", creditLimit: 5000, creditBalance: 0 },
  { name: "Prakash Joshi", phone: "9988776609", creditLimit: 3000, creditBalance: 1500 },
  { name: "Anil Deshmukh", phone: "9988776610", creditLimit: 10000, creditBalance: 7800 },
];

// ─── Helper Functions ────────────────────────────────────

const HSN: Record<string, string> = {
  WHISKY: "2208",
  RUM: "2208",
  VODKA: "2208",
  GIN: "2208",
  BRANDY: "2208",
  WINE: "2204",
  BEER: "2203",
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateInvoiceNumber(date: Date, seq: number): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `INV-${d}-${String(seq).padStart(4, "0")}`;
}

// ─── Main Seed ───────────────────────────────────────────

async function main() {
  console.log("Clearing existing data...");
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.stockTransfer.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shop.deleteMany();

  console.log("Creating shop...");
  const shop = await prisma.shop.create({
    data: {
      name: "Sharma Wine Shop",
      ownerName: "Rahul Sharma",
      licenseNumber: "MH/PNE/FL-3/12345",
      address: "123, MG Road, Camp Area",
      city: "Pune",
      state: "Maharashtra",
      phone: "9876500001",
    },
  });

  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("password123", 12);
  await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "admin@hisaab.ai",
      password: hashedPassword,
      role: "OWNER",
      shopId: shop.id,
    },
  });

  console.log("Creating products...");
  const createdProducts: Array<{
    id: string;
    name: string;
    mrp: number;
    category: ProductCategory;
    size: SizeUnit;
    shopBottles: number;
    costPrice: number;
  }> = [];

  for (const p of products) {
    for (const s of p.sizes) {
      const created = await prisma.product.create({
        data: {
          name: p.name,
          brand: p.brand,
          category: p.category,
          size: s.size,
          hsnCode: HSN[p.category],
          mrp: s.mrp,
          costPrice: s.costPrice,
          bpc: s.bpc,
          warehouseCases: s.warehouseCases,
          warehouseBottles: 0,
          shopBottles: s.shopBottles,
          reorderLevel: s.size === "ML_180" || s.size === "CAN_500" ? 20 : 10,
          shopId: shop.id,
        },
      });
      createdProducts.push({
        id: created.id,
        name: p.name,
        mrp: s.mrp,
        category: p.category,
        size: s.size,
        shopBottles: s.shopBottles,
        costPrice: Number(created.costPrice),
      });
    }
  }
  console.log(`  Created ${createdProducts.length} product variants`);

  console.log("Creating suppliers...");
  for (const s of suppliers) {
    await prisma.supplier.create({
      data: { ...s, shopId: shop.id },
    });
  }

  console.log("Creating customers...");
  const createdCustomers: string[] = [];
  for (const c of customers) {
    const created = await prisma.customer.create({
      data: { ...c, shopId: shop.id },
    });
    createdCustomers.push(created.id);
  }

  // ── Generate 30 days of sales history ──
  console.log("Generating 30 days of sales history...");
  const now = new Date();
  let totalSales = 0;

  // Pick popular products (higher weight for common items)
  const popularProducts = createdProducts.filter(
    (p) =>
      ["WHISKY", "BEER", "RUM"].includes(p.category) &&
      ["ML_750", "ML_375", "BOTTLE_650", "CAN_500"].includes(p.size)
  );
  const allSaleableProducts = createdProducts.filter((p) => p.shopBottles > 0);

  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const saleDate = new Date(now);
    saleDate.setDate(saleDate.getDate() - daysAgo);
    saleDate.setHours(10, 0, 0, 0);

    // Weekend days have higher sales
    const dayOfWeek = saleDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFriday = dayOfWeek === 5;
    const baseSales = isWeekend ? randomInt(18, 28) : isFriday ? randomInt(15, 22) : randomInt(10, 18);

    let dailyInvoiceSeq = 1;

    for (let s = 0; s < baseSales; s++) {
      // Random time between 10 AM and 10 PM
      const saleTime = new Date(saleDate);
      saleTime.setHours(randomInt(10, 22), randomInt(0, 59), randomInt(0, 59));

      // 1-4 items per sale
      const itemCount = randomInt(1, 4);
      const usedProductIds = new Set<string>();
      const saleItems: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }> = [];

      for (let i = 0; i < itemCount; i++) {
        // 70% chance of popular product
        const pool = Math.random() < 0.7 ? popularProducts : allSaleableProducts;
        let product = randomChoice(pool);

        // Avoid duplicates
        let attempts = 0;
        while (usedProductIds.has(product.id) && attempts < 10) {
          product = randomChoice(pool);
          attempts++;
        }
        if (usedProductIds.has(product.id)) continue;
        usedProductIds.add(product.id);

        const quantity = randomInt(1, 4);
        saleItems.push({
          productId: product.id,
          quantity,
          unitPrice: product.mrp,
          totalPrice: product.mrp * quantity,
        });
      }

      if (saleItems.length === 0) continue;

      const subtotal = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
      // Small random discount occasionally
      const discount = Math.random() < 0.1 ? randomInt(10, 50) : 0;
      const totalAmount = subtotal - discount;

      // Payment mode: 60% cash, 25% UPI, 15% credit
      const paymentRoll = Math.random();
      let paymentMode: PaymentMode;
      let customerId: string | null = null;

      if (paymentRoll < 0.6) {
        paymentMode = "CASH";
      } else if (paymentRoll < 0.85) {
        paymentMode = "UPI";
      } else {
        paymentMode = "CREDIT";
        customerId = randomChoice(createdCustomers);
      }

      await prisma.sale.create({
        data: {
          invoiceNumber: generateInvoiceNumber(saleTime, dailyInvoiceSeq++),
          saleDate: saleTime,
          subtotal,
          discount,
          totalAmount,
          paymentMode,
          customerId,
          shopId: shop.id,
          items: {
            create: saleItems,
          },
        },
      });

      totalSales++;
    }
  }

  console.log(`  Created ${totalSales} sales across 30 days`);
  console.log("\nSeed completed successfully!");
  console.log("Login: admin@hisaab.ai / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
