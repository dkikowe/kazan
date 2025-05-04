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

interface ExcursionProduct {
  _id: string;
  excursionCard: {
    _id: string;
    title: string;
  };
  services: Array<{
    _id: string;
    title: string;
    description: string;
    price: number;
  }>;
}

export default function ExcursionProductServicesPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ExcursionProduct | null>(null);
  const [newService, setNewService] = useState<ServiceFormData>({
    title: "",
    description: "",
    price: 0,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: newService,
  });

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/excursion-products/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error("Ошибка при загрузке товара");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/excursion-products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          services: [...(product?.services || []), data],
        }),
      });

      if (!response.ok) throw new Error("Failed to add service");

      toast.success("Услуга успешно добавлена");
      reset();
      fetchProduct();
    } catch (error) {
      toast.error("Ошибка при добавлении услуги");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      setSaving(true);
      const updatedServices = product?.services.filter(
        (service) => service._id !== serviceId
      );

      const response = await fetch(`/api/excursion-products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          services: updatedServices,
        }),
      });

      if (!response.ok) throw new Error("Failed to delete service");

      toast.success("Услуга успешно удалена");
      fetchProduct();
    } catch (error) {
      toast.error("Ошибка при удалении услуги");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          Услуги для {product?.excursionCard.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Добавить услугу</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    {...register("title")}
                    placeholder="Название услуги"
                    disabled={saving}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Textarea
                    {...register("description")}
                    placeholder="Описание услуги"
                    disabled={saving}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="Цена"
                    disabled={saving}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Сохранение..." : "Добавить услугу"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Список услуг</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product?.services.map((service) => (
                  <Card key={service._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{service.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {service.description}
                          </p>
                          <p className="text-sm font-medium mt-2">
                            {service.price} ₽
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(service._id)}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {!product?.services.length && (
                  <p className="text-center text-gray-500">
                    Нет добавленных услуг
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
