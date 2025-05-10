"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface ProductsListProps {
  excursionId: string;
}

export function ProductsList({ excursionId }: ProductsListProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ExcursionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `/api/excursion-products?excursionId=${excursionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await response.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [excursionId]);

  const filteredProducts = products.filter((product) =>
    product.dateRanges.some(
      (range) =>
        new Date(range.start).toLocaleDateString().includes(searchQuery) ||
        new Date(range.end).toLocaleDateString().includes(searchQuery)
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative flex-1 max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск по датам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

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
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
