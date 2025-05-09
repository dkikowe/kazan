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
  ShoppingCart,
  MapPin,
  Clock,
  Users,
  Tag,
  Calendar,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Excursion {
  _id: string;
  title: string;
  seoTitle?: string;
  description: string;
  whatYouWillSee?: {
    title: string;
    items: string[];
  };
  commercialSlug?: string;
  tags: Array<string | { _id: string; name: string }>;
  filterItems?: Array<string | { _id: string; name: string }>;
  isPublished: boolean;
  createdAt: string;
  excursionProduct?: {
    _id: string;
    title: string;
  };
}

interface ExcursionProduct {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
}

export default function ExcursionsPage() {
  const router = useRouter();
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [excursionProducts, setExcursionProducts] = useState<
    ExcursionProduct[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("excursions");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Начинаем загрузку данных экскурсий...");

      const excursionsRes = await fetch("/api/excursions");
      if (!excursionsRes.ok) {
        throw new Error(
          `Ошибка загрузки экскурсий: ${excursionsRes.status} ${excursionsRes.statusText}`
        );
      }

      const productsRes = await fetch("/api/excursion-products");
      if (!productsRes.ok) {
        throw new Error(
          `Ошибка загрузки товаров: ${productsRes.status} ${productsRes.statusText}`
        );
      }

      const excursionsData = await excursionsRes.json();
      const productsData = await productsRes.json();

      console.log("Полученные данные экскурсий:", excursionsData);
      console.log("Тип данных:", typeof excursionsData);
      console.log("Является массивом:", Array.isArray(excursionsData));

      if (Array.isArray(excursionsData)) {
        console.log(`Загружено ${excursionsData.length} экскурсий`);
        if (excursionsData.length > 0) {
          console.log(
            "Пример первой экскурсии:",
            JSON.stringify(excursionsData[0], null, 2)
          );
        }
      }

      // Проверяем, что данные - это массив
      setExcursions(Array.isArray(excursionsData) ? excursionsData : []);
      setExcursionProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      toast.error("Ошибка при загрузке данных");
      setExcursions([]);
      setExcursionProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExcursion = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту экскурсию?")) {
      return;
    }

    try {
      const response = await fetch(`/api/excursions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Ошибка при удалении: ${response.status} ${response.statusText}`
        );
      }

      toast.success("Экскурсия успешно удалена");
      fetchData(); // Обновляем список после удаления
    } catch (error) {
      console.error("Ошибка при удалении экскурсии:", error);
      toast.error("Ошибка при удалении экскурсии");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) {
      return;
    }

    try {
      const response = await fetch(`/api/excursion-products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Ошибка при удалении: ${response.status} ${response.statusText}`
        );
      }

      toast.success("Товар успешно удален");
      fetchData(); // Обновляем список после удаления
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
      toast.error("Ошибка при удалении товара");
    }
  };

  const filteredExcursions = Array.isArray(excursions)
    ? excursions.filter((excursion) => {
        const title = excursion?.title || "";
        const description = excursion?.description || "";
        const seoTitle = excursion?.seoTitle || "";
        const commercialSlug = excursion?.commercialSlug || "";

        const searchTerm = searchQuery.toLowerCase();

        return (
          title.toLowerCase().includes(searchTerm) ||
          description.toLowerCase().includes(searchTerm) ||
          seoTitle.toLowerCase().includes(searchTerm) ||
          commercialSlug.toLowerCase().includes(searchTerm)
        );
      })
    : [];

  const filteredProducts = Array.isArray(excursionProducts)
    ? excursionProducts.filter((product) => {
        const title = product?.title || "";
        const description = product?.description || "";

        const searchTerm = searchQuery.toLowerCase();

        return (
          title.toLowerCase().includes(searchTerm) ||
          description.toLowerCase().includes(searchTerm)
        );
      })
    : [];

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление экскурсиями</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {activeTab === "excursions" ? (
            <Button
              onClick={() => {
                console.log("Нажата кнопка 'Новая экскурсия'");
                router.push("/admin/excursions/new");
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Новая экскурсия
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/admin/excursion-products/new")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Новый товар
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="excursions">Экскурсии</TabsTrigger>
          <TabsTrigger value="products">Товары экскурсий</TabsTrigger>
        </TabsList>

        <TabsContent value="excursions">
          <div className="grid gap-4">
            {filteredExcursions.map((excursion) => (
              <Card
                key={excursion._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {excursion.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {excursion.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {excursion.isPublished ? (
                        <span className="text-sm text-green-600">
                          Опубликовано
                        </span>
                      ) : (
                        <span className="text-sm text-yellow-600">
                          Черновик
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {excursion.whatYouWillSee && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{excursion.whatYouWillSee.title}</span>
                      </div>
                    )}
                    {excursion.commercialSlug && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{excursion.commercialSlug}</span>
                      </div>
                    )}
                    {excursion.excursionProduct && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShoppingCart className="h-4 w-4" />
                        <span>{excursion.excursionProduct.title}</span>
                      </div>
                    )}
                  </div>

                  {excursion.tags && excursion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {excursion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                        >
                          <Tag className="h-3 w-3" />
                          {typeof tag === "string" ? tag : tag?.name || ""}
                        </span>
                      ))}
                    </div>
                  )}

                  {excursion.filterItems &&
                    excursion.filterItems.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {excursion.filterItems.map((filterItem, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-xs bg-blue-100 px-2 py-1 rounded"
                          >
                            <Tag className="h-3 w-3 text-blue-500" />
                            {typeof filterItem === "string"
                              ? filterItem
                              : filterItem?.name || ""}
                          </span>
                        ))}
                      </div>
                    )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Создано:{" "}
                        {new Date(excursion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/excursions/${excursion._id}`);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExcursion(excursion._id);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredExcursions.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">Экскурсии не найдены</h3>
                <p className="text-muted-foreground mt-2">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.isPublished ? (
                        <span className="text-sm text-green-600">
                          Опубликовано
                        </span>
                      ) : (
                        <span className="text-sm text-yellow-600">
                          Черновик
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Создано:{" "}
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/admin/excursion-products/${product._id}/edit`
                          );
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product._id);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">Товары не найдены</h3>
                <p className="text-muted-foreground mt-2">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
