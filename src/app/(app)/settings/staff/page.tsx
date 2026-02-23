import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStaff } from "@/app/(app)/settings/staff/actions";
import { StaffManager } from "@/components/settings/staff-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function StaffPage() {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;
  const shopId = user?.shopId as string | undefined;
  const currentUserId = user?.id as string | undefined;
  const role = user?.role as string | undefined;

  if (!shopId || !currentUserId) redirect("/login");

  const staff = await getStaff(shopId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold">Staff Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage who has access to your shop
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <StaffManager
          staff={staff}
          currentUserId={currentUserId}
          isOwner={role === "OWNER"}
        />
      </div>
    </div>
  );
}
