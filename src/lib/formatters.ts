/**
 * Indian number formatting utilities
 * Formats: ₹1,23,456.00 (lakhs/crores), DD/MM/YYYY dates
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const inrCompactFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

/** Format as Indian Rupees: ₹1,23,456.00 */
export function formatINR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0";
  return inrFormatter.format(num);
}

/** Format as Indian Rupees (no decimals): ₹1,23,456 */
export function formatINRCompact(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0";
  return inrCompactFormatter.format(num);
}

/** Format number with Indian grouping: 1,23,456 */
export function formatNumber(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0";
  return numberFormatter.format(n);
}

/** Format as DD/MM/YYYY */
export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

/** Format as DD/MM/YYYY, HH:MM AM/PM */
export function formatDateTime(date: Date | string): string {
  return dateTimeFormatter.format(new Date(date));
}

/** Format as HH:MM AM/PM */
export function formatTime(date: Date | string): string {
  return timeFormatter.format(new Date(date));
}

/** Format percentage with sign: +23.5% or -12.3% */
export function formatPercentChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/** Shorten large numbers: 1.2L, 3.5Cr */
export function formatINRShort(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}
