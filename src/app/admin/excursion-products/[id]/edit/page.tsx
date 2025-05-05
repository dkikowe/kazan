"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import EditForm from "./edit-form";
import { ProductFormData } from "./edit-form";

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
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductFormData | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
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

  return <EditForm id={id} initialData={product} />;
}
