"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import EditForm from "@/app/admin/excursion-products/[id]/edit/edit-form";
import { ProductFormData } from "@/app/admin/excursion-products/[id]/edit/edit-form";

interface PageProps {
  params: Promise<{ id: string; productId: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [productId, setProductId] = useState<string>("");
  const [excursionId, setExcursionId] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const { id, productId } = await params;
      setExcursionId(id);
      setProductId(productId);
      await fetchProduct(productId);
    };
    init();
  }, [params]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/excursion-products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();

      // Преобразуем данные в формат формы
      const formData: ProductFormData = {
        ...data,
        dateRanges: data.dateRanges.map((range: any) => ({
          start: new Date(range.start),
          end: new Date(range.end),
          excludedDates:
            range.excludedDates?.map((date: string) => new Date(date)) || [],
        })),
        startTimes: data.startTimes || [],
        meetingPoints: data.meetingPoints || [],
        paymentOptions: data.paymentOptions || [],
        additionalServices: data.additionalServices || [],
        groups: data.groups.map((group: any) => ({
          ...group,
          date: new Date(group.date),
          autoStop: group.autoStop ?? false,
        })),
        isPublished: data.isPublished ?? false,
      };

      setProduct(formData);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Ошибка при загрузке товара");
    } finally {
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Редактирование товара</h1>
      </div>
      <EditForm
        id={productId}
        initialData={product}
        excursionId={excursionId}
      />
    </div>
  );
}
