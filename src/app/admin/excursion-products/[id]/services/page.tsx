"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const serviceSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  price: z.number().min(0, "Цена должна быть положительной"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
}

interface IExcursionProduct {
  _id: string;
  title: string;
  services: Service[];
}

interface PageProps {
  params: { id: string };
}

export default function ServicesPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<IExcursionProduct | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const { register, handleSubmit, reset } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/excursion-products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      setProduct(data);
      setServices(data.services || []);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Ошибка при загрузке товара");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    if (!product) return;
    try {
      setSaving(true);
      const response = await fetch(`/api/excursion-products/${id}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add service");

      const newService = await response.json();
      setServices([...services, newService]);
      reset();
      toast.success("Услуга успешно добавлена");
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Ошибка при добавлении услуги");
    } finally {
      setSaving(false);
    }
  };

  const removeService = async (service: Service) => {
    if (!product) return;
    try {
      setSaving(true);
      const response = await fetch(
        `/api/excursion-products/${id}/services/${service._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove service");

      setServices(services.filter((s) => s._id !== service._id));
      toast.success("Услуга успешно удалена");
    } catch (error) {
      console.error("Error removing service:", error);
      toast.error("Ошибка при удалении услуги");
    } finally {
      setSaving(false);
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
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Управление услугами</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Добавить услугу</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название</label>
                <Input {...register("title")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Описание</label>
                <Textarea {...register("description")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Цена</label>
                <Input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              <Button type="submit" disabled={saving}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить услугу
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Список услуг</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between p-4 border rounded"
                >
                  <div>
                    <h3 className="font-medium">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                    <p className="text-sm font-medium">{service.price} ₽</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeService(service)}
                    disabled={saving}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-center text-gray-500">
                  Нет добавленных услуг
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
