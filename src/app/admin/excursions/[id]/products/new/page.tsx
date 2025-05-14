"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { SubmitHandler } from "react-hook-form";

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function NewProductPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Создание нового товара</h1>
      </div>
      <NewProductForm excursionId={params.id} />
    </div>
  );
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

interface NewProductFormProps {
  excursionId: string;
}

function NewProductForm({ excursionId }: NewProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setLoading(false);
  }, []);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      console.log("Создание нового товара экскурсии:", data);
      setSaving(true);

      const formData = {
        ...data,
        excursionCard: excursionId,
      };

      const response = await fetch("/api/excursion-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании товара");
      }

      toast.success("Товар успешно создан");
      setTimeout(() => {
        router.push(`/admin/excursions/${excursionId}/products`);
      }, 1000);
    } catch (error: any) {
      console.error("Ошибка при создании товара:", error);
      toast.error(error.message || "Ошибка при создании товара");
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
                    <Input placeholder="Введите название товара" {...field} />
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
