"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import EditForm from "./edit-form";
import { ProductFormData } from "./edit-form";
import { toast } from "sonner";

interface IExcursionProduct {
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
    excludedDates?: string[];
  }>;
  startTimes: string[];
  meetingPoints: Array<{
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  paymentOptions: Array<{
    type: string;
    prepaymentPercent?: number;
    description?: string;
  }>;
  additionalServices: Array<{
    name: string;
    price: number;
    description?: string;
  }>;
  groups: Array<{
    date: string;
    time: string;
    meetingPoint: string;
    maxSize: number;
    autoStop: boolean;
  }>;
  isPublished: boolean;
}

interface PageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [productId, setProductId] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        const id = params.id;
        console.log(
          `Инициализация страницы редактирования для товара с ID: ${id}`
        );
        setProductId(id);
        await fetchProduct(id);
      } catch (err) {
        console.error("Ошибка при инициализации страницы:", err);
        setError("Не удалось загрузить данные товара");
        toast.error("Ошибка при загрузке товара");
        setLoading(false);
      }
    };
    init();
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      console.log(`Загрузка товара с ID: ${id}`);
      const response = await fetch(
        `/api/excursion-products/${id}?_=${Date.now()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка API при загрузке товара:", errorData);
        throw new Error(errorData.error || "Не удалось загрузить товар");
      }

      const data = await response.json();
      console.log("Получены данные товара:", data);

      if (!data || !data._id) {
        console.error("Получены невалидные данные товара:", data);
        throw new Error("Полученные данные товара не валидны");
      }

      // Преобразуем данные в формат формы
      const formData: ProductFormData = {
        excursionCard: data.excursionCard?._id || data.excursionCard || "",
        services: data.services || [],
        dateRanges: (data.dateRanges || []).map((range: any) => ({
          start: new Date(range.start),
          end: new Date(range.end),
          excludedDates:
            range.excludedDates?.map((date: string) => new Date(date)) || [],
        })),
        startTimes: data.startTimes || [],
        meetingPoints: data.meetingPoints || [],
        tickets: data.tickets || [],
        paymentOptions: data.paymentOptions || [],
        additionalServices: data.additionalServices || [],
        groups: (data.groups || []).map((group: any) => ({
          ...group,
          date: new Date(group.date),
          autoStop: group.autoStop ?? false,
        })),
        isPublished: data.isPublished ?? false,
      };

      console.log("Данные формы подготовлены:", formData);
      setProduct(formData);
    } catch (error) {
      console.error("Ошибка при загрузке товара:", error);
      setError(
        `Ошибка при загрузке товара: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      toast.error(
        error instanceof Error ? error.message : "Ошибка при загрузке товара"
      );
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

  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Ошибка</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error || "Товар не найден"}</p>
            <Button
              onClick={() => router.push("/admin/excursion-products")}
              className="mt-4"
            >
              Вернуться к списку товаров
            </Button>
          </CardContent>
        </Card>
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
      <EditForm id={productId} initialData={product} />
    </div>
  );
}
