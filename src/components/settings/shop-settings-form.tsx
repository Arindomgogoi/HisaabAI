"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Store, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateShop } from "@/app/(app)/settings/actions";

interface Shop {
  id: string;
  name: string;
  ownerName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string;
  licenseNumber: string | null;
}

export function ShopSettingsForm({ shop }: { shop: Shop }) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateShop(formData);
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Settings saved");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your shop profile and business details
        </p>
      </div>

      {/* Shop Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="w-4 h-4 text-muted-foreground" />
            Shop Information
          </CardTitle>
          <CardDescription className="text-xs">
            Appears on invoices and receipts
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Shop Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={shop.name}
              placeholder="e.g. Raj Wine Shop"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              name="ownerName"
              defaultValue={shop.ownerName ?? ""}
              placeholder="e.g. Rajesh Kumar"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={shop.phone ?? ""}
              placeholder="e.g. 98765 43210"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue={shop.city ?? ""}
              placeholder="e.g. Pune"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={shop.address ?? ""}
              placeholder="e.g. Shop No. 5, Market Road"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              defaultValue={shop.state}
              placeholder="e.g. Maharashtra"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax & Legal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Tax &amp; Legal
          </CardTitle>
          <CardDescription className="text-xs">
            Required for excise compliance and liquor licensing
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="licenseNumber">Liquor License Number</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              defaultValue={shop.licenseNumber ?? ""}
              placeholder="e.g. MH/LIC/2024/12345"
            />
          </div>

        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 text-white min-w-[120px]"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
