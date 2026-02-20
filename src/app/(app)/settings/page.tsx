import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getShop } from "@/lib/data/settings";
import { ShopSettingsForm } from "@/components/settings/shop-settings-form";

export default async function SettingsPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const shop = await getShop(shopId);
  if (!shop) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <ShopSettingsForm shop={shop} />
    </div>
  );
}
