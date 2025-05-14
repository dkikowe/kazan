import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { ProductsList } from "./products-list";

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ExcursionProductsPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/excursions">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Товары экскурсии</h1>
      </div>
      <div className="flex justify-end mb-6">
        <Link href={`/admin/excursions/${params.id}/products/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Добавить товар
          </Button>
        </Link>
      </div>
      <ProductsList excursionId={params.id} />
    </div>
  );
}
