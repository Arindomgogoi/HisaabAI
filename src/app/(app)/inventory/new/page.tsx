import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/inventory/product-form";

export default async function NewProductPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <ProductForm mode="create" />
    </div>
  );
}
