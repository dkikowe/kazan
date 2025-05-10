"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";

interface EditProductFormProps {
  excursionId: string;
  productId: string;
}

const productFormSchema = z.object({
  excursionCard: z.string().optional(),
  title: z.string().min(1, "Название товара обязательно"),
  services: z
    .array(
      z.object({
        type: z.enum([
          "transport",
          "guide",
          "ticket",
          "lunch",
          "audioguide",
          "additional",
        ]),
        subtype: z.string(),
        hours: z.number().min(0),
        peopleCount: z.number().min(1),
        price: z.number().min(0),
      })
    )
    .default([]),
  dateRanges: z
    .array(
      z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
        excludedDates: z.array(z.coerce.date()).default([]),
      })
    )
    .default([]),
  startTimes: z
    .array(z.string().min(1, "Время начала обязательно"))
    .default([""]),
  meetingPoints: z
    .array(
      z.object({
        name: z.string(),
        address: z.string(),
        coordinates: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional(),
      })
    )
    .default([]),
  tickets: z
    .array(
      z.object({
        type: z.enum(["adult", "child", "additional"]),
        name: z.string(),
        price: z.number().min(0),
        isDefaultPrice: z.boolean().default(false),
      })
    )
    .default([]),
  paymentOptions: z
    .array(
      z.object({
        type: z.enum(["full", "prepayment", "onsite"]),
        prepaymentPercent: z.number().min(0).max(100).optional(),
        description: z.string().optional(),
      })
    )
    .default([]),
  additionalServices: z
    .array(
      z.object({
        name: z.string().min(1, "Название услуги обязательно"),
        price: z.number().min(0, "Цена должна быть положительной"),
        description: z.string().optional(),
      })
    )
    .default([]),
  groups: z
    .array(
      z.object({
        date: z.coerce.date(),
        time: z.string(),
        meetingPoint: z.string(),
        maxSize: z.number().min(1),
        autoStop: z.boolean().default(false),
      })
    )
    .default([]),
  isPublished: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export default function EditProductForm({
  excursionId,
  productId,
}: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      excursionCard: excursionId,
      title: "",
      services: [],
      dateRanges: [],
      startTimes: [""],
      meetingPoints: [],
      tickets: [],
      paymentOptions: [],
      additionalServices: [],
      groups: [],
      isPublished: false,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `/api/excursion-products/${productId}?_=${Date.now()}`
        );

        if (!response.ok) {
          throw new Error("Не удалось загрузить товар");
        }

        const data = await response.json();

        // Преобразуем даты в объекты Date
        if (data.dateRanges) {
          data.dateRanges = data.dateRanges.map((range: any) => ({
            ...range,
            start: new Date(range.start),
            end: new Date(range.end),
            excludedDates: (range.excludedDates || []).map(
              (date: string) => new Date(date)
            ),
          }));
        }

        if (data.groups) {
          data.groups = data.groups.map((group: any) => ({
            ...group,
            date: new Date(group.date),
          }));
        }

        form.reset(data);
      } catch (error) {
        console.error("Ошибка при загрузке товара:", error);
        setError("Не удалось загрузить товар");
        toast.error("Ошибка при загрузке товара");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, form]);

  const onSubmit = async (values: ProductFormData) => {
    try {
      setSaving(true);

      const response = await fetch(
        `/api/excursion-products/${productId}?_=${Date.now()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при сохранении товара");
      }

      toast.success("Товар успешно обновлен");
      setTimeout(() => {
        router.push(`/admin/excursions/${excursionId}/products`);
      }, 1000);
    } catch (error: any) {
      console.error("Ошибка при сохранении товара:", error);
      toast.error(error.message || "Ошибка при сохранении товара");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
          <Button
            onClick={() =>
              router.push(`/admin/excursions/${excursionId}/products`)
            }
            className="mt-4"
          >
            Вернуться к списку товаров
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название товара</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(`/admin/excursions/${excursionId}/products`)
            }
          >
            Отмена
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
