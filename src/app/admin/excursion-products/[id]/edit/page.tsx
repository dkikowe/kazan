"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import EditForm from "./edit-form";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/excursion-products/${params.id}`);
        if (!response.ok) {
          throw new Error("Ошибка при загрузке товара");
        }
        const data = await response.json();
        setInitialData(data);
      } catch (error) {
        console.error("Ошибка при загрузке товара:", error);
        toast.error("Не удалось загрузить товар");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/excursion-products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Редактирование товара</h1>
      </div>

      {initialData && <EditForm id={params.id} initialData={initialData} />}
    </div>
  );
}
