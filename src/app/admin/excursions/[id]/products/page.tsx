"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface ExcursionProduct {
  _id: string;
  excursionCard: {
    _id: string;
    title: string;
  };
  tickets: Array<{
    type: string;
    price: number;
  }>;
  dateRanges: Array<{
    start: string;
    end: string;
  }>;
  meetingPoints: Array<{
    location: string;
    time: string;
  }>;
  paymentOptions: Array<{
    type: string;
    description: string;
  }>;
  groups: Array<{
    minSize: number;
    maxSize: number;
    price: number;
  }>;
  isPublished: boolean;
}

interface Excursion {
  _id: string;
  title: string;
}

interface PageProps {
  params: { id: string };
}

export default function ExcursionProductsPage({ params }: PageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ExcursionProduct[]>([]);
  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [excursionResponse, productsResponse] = await Promise.all([
        fetch(`/api/excursions/${params.id}`),
        fetch(`/api/excursion-products?excursionId=${params.id}`),
      ]);

      if (!excursionResponse.ok || !productsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const excursionData = await excursionResponse.json();
      const productsData = await productsResponse.json();

      setExcursion(excursionData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const filteredProducts = products.filter((product) =>
    product.dateRanges.some(
      (range) =>
        new Date(range.start).toLocaleDateString().includes(searchQuery) ||
        new Date(range.end).toLocaleDateString().includes(searchQuery)
    )
  );

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/excursion-products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("Товар успешно удален");
      await loadData();
    } catch (error) {
      toast.error("Ошибка при удалении товара");
    } finally {
      setDeleteProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!excursion) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Экскурсия не найдена</h1>
        <Button onClick={() => router.back()}>Назад</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{excursion?.title}</h1>
            <p className="text-muted-foreground">
              Управление товарами экскурсии
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск по датам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href={`/admin/excursions/${params.id}/products/new`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить товар
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Периоды продаж</CardTitle>
                    <CardDescription>
                      {product.dateRanges.length} периодов
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/excursion-products/${product._id}/edit`}
                    >
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteProductId(product._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.dateRanges.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(range.start).toLocaleDateString()} -{" "}
                        {new Date(range.end).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Цены:</span>
                      <div className="flex gap-2">
                        {product.tickets.map((ticket, index) => (
                          <span
                            key={index}
                            className="text-sm bg-muted px-2 py-1 rounded"
                          >
                            {ticket.type === "adult" ? "Взрослый" : "Детский"}:{" "}
                            {ticket.price} ₽
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Товары не найдены</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery
                ? "Попробуйте изменить параметры поиска"
                : "Добавьте первый товар для этой экскурсии"}
            </p>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductId && handleDelete(deleteProductId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
