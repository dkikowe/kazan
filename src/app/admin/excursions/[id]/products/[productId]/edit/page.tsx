import EditProductForm from "./edit-product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string; productId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/excursions/${resolvedParams.id}/products`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Редактирование товара</h1>
      </div>
      <EditProductForm
        excursionId={resolvedParams.id}
        productId={resolvedParams.productId}
      />
    </div>
  );
}
