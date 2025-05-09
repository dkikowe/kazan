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
  title?: string;
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
  startTimes: string[];
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
  const [excursionId, setExcursionId] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        const id = params.id;
        console.log(`Инициализация страницы товаров для экскурсии с ID: ${id}`);
        setExcursionId(id);
        await loadData(id);
      } catch (err) {
        console.error("Ошибка при инициализации страницы:", err);
        toast.error("Ошибка при загрузке данных");
        setLoading(false);
      }
    };
    init();
  }, [params.id]);

  const loadData = async (id: string) => {
    try {
      const [excursionResponse, productsResponse] = await Promise.all([
        fetch(`/api/excursions/${id}`),
        fetch(`/api/excursion-products?excursionId=${id}`),
      ]);

      if (!excursionResponse.ok || !productsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const excursionData = await excursionResponse.json();
      const productsData = await productsResponse.json();

      console.log("Loaded products:", productsData);

      setExcursion(excursionData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.dateRanges.some(
      (range) =>
        new Date(range.start).toLocaleDateString().includes(searchQuery) ||
        new Date(range.end).toLocaleDateString().includes(searchQuery)
    )
  );

  const handleDelete = async (productId: string) => {
    try {
      console.log(
        `Удаление товара с ID: ${productId} для экскурсии ${excursionId}`
      );
      setLoading(true);

      const response = await fetch(`/api/excursion-products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Ошибка при удалении товара:", error);
        throw new Error(
          error.error || error.message || "Ошибка при удалении товара"
        );
      }

      console.log("Товар успешно удален");
      toast.success("Товар успешно удален");
      await loadData(excursionId);
    } catch (error: any) {
      console.error("Ошибка при удалении товара:", error);
      toast.error(error.message || "Ошибка при удалении товара");
    } finally {
      setDeleteProductId(null);
      setLoading(false);
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
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-blue-700">
              {excursion?.title}
            </h1>
            <p className="text-blue-600">Управление товарами экскурсии</p>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск по датам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href={`/admin/excursions/${excursionId}/products/new`}>
            <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4" />
              Добавить товар
            </Button>
          </Link>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mt-4">
          Товары экскурсии ({filteredProducts.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product._id}
              href={`/admin/excursions/${excursionId}/products/${product._id}/edit`}
              className="cursor-pointer block"
            >
              <Card className="hover:shadow-lg transition-shadow relative border-l-4 border-l-primary hover:border-l-blue-600">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center">
                        {product.title ||
                          (product.excursionCard &&
                          typeof product.excursionCard === "object"
                            ? `Товар для "${product.excursionCard.title}"`
                            : `Товар экскурсии #${product._id.substring(
                                product._id.length - 5
                              )}`)}
                      </CardTitle>
                      <CardDescription>
                        {product.dateRanges.length} периодов продаж •{" "}
                        {product.tickets.length} типов билетов
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="h-9 px-4 flex items-center bg-blue-500 hover:bg-blue-600 text-white relative z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(
                            `/admin/excursions/${excursionId}/products/${product._id}/edit`
                          );
                        }}
                      >
                        <Pencil className="h-5 w-5 mr-1" />
                        <span>Редактировать</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteProductId(product._id);
                        }}
                        className="h-9 px-4 flex items-center bg-red-500 hover:bg-red-600 relative z-10"
                      >
                        <Trash2 className="h-5 w-5 mr-1" />
                        <span>Удалить</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div className="flex flex-col">
                        {product.dateRanges.map((range, idx) => (
                          <span key={idx} className="text-sm">
                            {new Date(range.start).toLocaleDateString()} -{" "}
                            {new Date(range.end).toLocaleDateString()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{product.startTimes.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{product.meetingPoints.length} точек сбора</span>
                    </div>

                    {product.tickets.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">Цены:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.tickets.map((ticket, idx) => (
                              <span
                                key={idx}
                                className="text-sm bg-muted px-2 py-1 rounded-md"
                              >
                                {ticket.type === "adult"
                                  ? "Взрослый"
                                  : ticket.type === "child"
                                  ? "Детский"
                                  : "Дополнительный"}
                                : {ticket.price} ₽
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
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
        onOpenChange={(open) => {
          if (!open) setDeleteProductId(null);
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 text-xl">
              Удалить товар экскурсии?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              Это действие нельзя отменить. Товар будет полностью удален из
              системы вместе со всеми связанными данными.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log(`Подтверждено удаление товара ${deleteProductId}`);
                if (deleteProductId) {
                  handleDelete(deleteProductId);
                }
              }}
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Удаление...</span>
                </div>
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
