import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HisaabAI - Business Management",
    short_name: "HisaabAI",
    description:
      "AI-powered inventory, billing, and GST management for Indian shops",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#f59e0b",
    categories: ["business", "productivity", "finance"],
    lang: "en-IN",
    dir: "ltr",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/dashboard.png",
        sizes: "390x844",
        type: "image/png",
        // @ts-expect-error - form_factor is valid but not in Next.js types yet
        form_factor: "narrow",
        label: "Dashboard overview",
      },
    ],
    shortcuts: [
      {
        name: "New Sale",
        url: "/sales/pos",
        description: "Open Point of Sale",
      },
      {
        name: "Inventory",
        url: "/inventory",
        description: "View inventory",
      },
    ],
  };
}
