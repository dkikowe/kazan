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
import { Search, Plus, Calendar, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/excursion-products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Ошибка при загрузке товаров");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.excursionCard.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
            <Plus className="h-4 w-4" />
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
            <Card
              key={product._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                router.push(`/admin/excursion-products/${product._id}`)
              }
            >
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {product.excursionCard.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.excursionCard.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(
                        product.dateRanges[0]?.start
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        product.dateRanges[0]?.end
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{product.dateRanges.length} периодов</span>
                  </div>
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
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
