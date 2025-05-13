"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import EditForm from "./edit-form";
import Link from "next/link";
import { GalleryUpload } from "@/components/ui/gallery-upload";
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
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState<string[]>([]);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/excursion-products/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();

        // Преобразуем даты в формат YYYY-MM-DD
        const formattedData = {
          ...data,
          dateRanges: data.dateRanges?.map((range: any) => ({
            start: new Date(range.start).toISOString().split("T")[0],
            end: new Date(range.end).toISOString().split("T")[0],
          })) || [{ start: "", end: "" }],
          tickets: data.tickets || [{ type: "", name: "", price: 0 }],
          meetingPoints: data.meetingPoints || [{ location: "", time: "" }],
          paymentOptions: data.paymentOptions || [
            { type: "", description: "" },
          ],
          groups: data.groups || [{ minSize: 0, maxSize: 0, price: 0 }],
        };

        setInitialData(formattedData);
        setGallery(data.gallery || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Ошибка при загрузке товара");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
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

      {initialData && (
        <>
          <EditForm id={params.id} initialData={initialData} />
          <div className="mt-6">
            <GalleryUpload value={gallery} onChange={setGallery} />
          </div>
        </>
      )}
    </div>
  );
}
