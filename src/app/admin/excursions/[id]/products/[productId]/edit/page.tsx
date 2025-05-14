import EditProductForm from "./edit-product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string; productId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function EditProductPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/excursions/${params.id}/products`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Редактирование товара</h1>
      </div>
      <EditProductForm excursionId={params.id} productId={params.productId} />
    </div>
  );
}
