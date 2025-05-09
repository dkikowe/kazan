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
  CirclePlus,
  CalendarDays,
  MapPin,
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

interface ExcursionProduct {
  _id: string;
  excursionCard: {
    title: string;
    description: string;
  };
  tickets: Array<{
    type: string;
    price: number;
  }>;
  dateRanges: Array<{
    start: string;
    end: string;
  }>;
}

export default function ExcursionProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ExcursionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/excursion-products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Загруженные товары:", data);
      if (!Array.isArray(data)) {
        console.error("Полученные данные не являются массивом:", data);
        return;
      }
      setProducts(data);
    } catch (error) {
      console.error("Ошибка при загрузке товаров:", error);
      toast.error("Ошибка при загрузке товаров");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Переход к редактированию товара:", id);
    router.push(`/admin/excursion-products/${id}/edit`);
  };

  const handleEditWithErrorCatching = (id: string) => {
    try {
      handleEdit(id);
    } catch (error) {
      console.error("Ошибка при переходе к редактированию:", error);
      toast.error("Не удалось открыть форму редактирования");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Удаление товара с ID: ${id}`);
      setLoading(true);

      const response = await fetch(`/api/excursion-products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка при удалении товара:", errorData);
        throw new Error(errorData.error || "Не удалось удалить товар");
      }

      console.log("Товар успешно удален");
      setProducts(products.filter((product) => product._id !== id));
      toast.success("Товар успешно удален");
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
      toast.error(
        error instanceof Error ? error.message : "Ошибка при удалении товара"
      );
    } finally {
      setDeleteProductId(null);
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    console.log(`Запрос подтверждения удаления товара с ID: ${id}`);
    setDeleteProductId(id);
  };

  const filteredProducts = products.filter((product) =>
    product.excursionCard?.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Функция для отображения форматированной даты
  const formatDate = (dateString: string) => {
    if (!dateString) return "Нет даты";
    try {
      return new Date(dateString).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return "Некорректная дата";
    }
  };

  // Функция для отображения типа билета
  const getTicketTypeName = (type: string) => {
    switch (type) {
      case "adult":
        return "Взрослый";
      case "child":
        return "Детский";
      case "additional":
        return "Дополнительный";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Товары экскурсий</h1>
            <p className="text-muted-foreground">
              Управление товарами и ценами экскурсий
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/excursion-products/new")}
            className="flex items-center gap-2"
          >
            <CirclePlus className="h-4 w-4" />
            Создать товар
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">
                      {product.excursionCard?.title || "Без названия"}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.excursionCard?.description || "Без описания"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWithErrorCatching(product._id)}
                      className="h-8 px-3 flex items-center"
                      title="Редактировать"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      <span>Ред.</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(product._id)}
                      className="h-8 px-3 flex items-center"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span>Удал.</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {product.dateRanges?.[0]?.start
                        ? formatDate(product.dateRanges[0].start)
                        : "Нет даты"}{" "}
                      -{" "}
                      {product.dateRanges?.[0]?.end
                        ? formatDate(product.dateRanges[0].end)
                        : "Нет даты"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{product.dateRanges?.length || 0} периодов</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Цены:</span>
                      <div className="flex gap-2">
                        {product.tickets?.map((ticket, index) => (
                          <span
                            key={index}
                            className="text-sm bg-muted px-2 py-1 rounded"
                          >
                            {getTicketTypeName(ticket.type)}: {ticket.price} ₽
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

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Товары не найдены</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery
                ? "Попробуйте изменить параметры поиска"
                : "Создайте новый товар экскурсии"}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар экскурсии?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет полностью удален из
              системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductId && handleDelete(deleteProductId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Да, удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
