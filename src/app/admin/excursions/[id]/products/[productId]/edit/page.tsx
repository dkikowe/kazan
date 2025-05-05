"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface ExcursionProduct {
  _id: string;
  excursionCard: string;
  services: {
    type: string;
    subtype: string;
    hours: number;
    peopleCount: number;
    price: number;
  }[];
  dateRanges: {
    start: string;
    end: string;
    excludedDates: string[];
  }[];
  startTimes: string[];
  meetingPoints: {
    name: string;
    address: string;
    time: string;
    location: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }[];
  tickets: {
    type: string;
    name: string;
    price: number;
    isDefaultPrice?: boolean;
  }[];
  paymentOptions: {
    type: string;
    prepaymentPercent?: number;
  }[];
}

interface PageProps {
  params: Promise<{
    id: string;
    productId: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id, productId } = await params;
  const router = useRouter();
  const [product, setProduct] = useState<ExcursionProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/excursion-products/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error("Ошибка при загрузке товара");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const response = await fetch(`/api/excursion-products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      toast.success("Товар успешно обновлен");
      router.push(`/admin/excursions/${id}/products`);
    } catch (error) {
      toast.error("Ошибка при обновлении товара");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
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
            <h1 className="text-2xl font-bold">Редактирование товара</h1>
            <p className="text-muted-foreground">
              Изменение параметров товара экскурсии
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Основная информация</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={product.meetingPoints[0]?.name || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      meetingPoints: [
                        {
                          ...product.meetingPoints[0],
                          name: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Адрес</label>
                <Input
                  value={product.meetingPoints[0]?.address || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      meetingPoints: [
                        {
                          ...product.meetingPoints[0],
                          address: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Время</label>
                <Input
                  value={product.meetingPoints[0]?.time || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      meetingPoints: [
                        {
                          ...product.meetingPoints[0],
                          time: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Место встречи</label>
                <Input
                  value={product.meetingPoints[0]?.location || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      meetingPoints: [
                        {
                          ...product.meetingPoints[0],
                          location: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Отмена
            </Button>
            <Button type="submit">Сохранить изменения</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
