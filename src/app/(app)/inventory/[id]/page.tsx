import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getProduct } from "@/lib/data/inventory";
import { ProductForm } from "@/components/inventory/product-form";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/(app)/inventory/actions";
import { DeleteProductButton } from "@/components/inventory/delete-product-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const { id } = await params;
  const product = await getProduct(id);

  if (!product || product.shopId !== shopId) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <ProductForm mode="edit" product={product} />
      <div className="flex justify-end">
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
