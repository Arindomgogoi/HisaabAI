import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getShop } from "@/lib/data/settings";
import { ShopSettingsForm } from "@/components/settings/shop-settings-form";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const shop = await getShop(shopId);
  if (!shop) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <ShopSettingsForm shop={shop} />
      <div className="rounded-lg border bg-card p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">Staff Management</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add or remove staff accounts
          </p>
        </div>
        <Link href="/settings/staff">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Manage Staff
          </Button>
        </Link>
      </div>
    </div>
  );
}
