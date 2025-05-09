"use client";

import { useState } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const productFormSchema = z.object({
  excursionCard: z.string(),
  title: z.string().min(1, "Название товара обязательно"),
  services: z.array(
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
  ),
  dateRanges: z.array(
    z.object({
      start: z.date(),
      end: z.date(),
      excludedDates: z.array(z.date()),
    })
  ),
  startTimes: z.array(z.string().min(1, "Время начала обязательно")),
  meetingPoints: z.array(
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
  ),
  tickets: z.array(
    z.object({
      type: z.enum(["adult", "child", "additional"]),
      name: z.string(),
      price: z.number().min(0),
      isDefaultPrice: z.boolean().optional(),
    })
  ),
  paymentOptions: z.array(
    z.object({
      type: z.enum(["full", "prepayment", "onsite"]),
      prepaymentPercent: z.number().min(0).max(100).optional(),
      description: z.string().optional(),
    })
  ),
  additionalServices: z.array(
    z.object({
      name: z.string().min(1, "Название услуги обязательно"),
      price: z.number().min(0, "Цена должна быть положительной"),
      description: z.string().optional(),
    })
  ),
  groups: z.array(
    z.object({
      date: z.date(),
      time: z.string(),
      meetingPoint: z.string(),
      maxSize: z.number().min(1),
      autoStop: z.boolean(),
    })
  ),
  isPublished: z.boolean(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface EditFormProps {
  id: string;
  initialData: ProductFormData;
  excursionId?: string;
}

export default function EditForm({
  id,
  initialData,
  excursionId,
}: EditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: ProductFormData) => {
    try {
      console.log(`Сохранение товара с ID: ${id}`, values);
      setSaving(true);
      const response = await fetch(
        `/api/excursion-products/${id}?_=${Date.now()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Ошибка API при обновлении товара:", error);
        throw new Error(
          error.error || error.message || "Не удалось обновить товар"
        );
      }

      const updatedProduct = await response.json();
      console.log("Товар успешно обновлен:", updatedProduct);
      toast.success("Товар успешно обновлен");

      setTimeout(() => {
        router.push(`/admin/excursions/${excursionId}/products`);
      }, 1000);
    } catch (error: any) {
      console.error("Ошибка при сохранении товара:", error);
      toast.error(error.message || "Ошибка при обновлении товара");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Опубликовать товар</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Периоды продаж</CardTitle>
          </CardHeader>
          <CardContent>
            {form.watch("dateRanges").map((_, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`dateRanges.${index}.start`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Начало периода</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`dateRanges.${index}.end`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Конец периода</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Время начала</CardTitle>
          </CardHeader>
          <CardContent>
            {form.watch("startTimes").map((_, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`startTimes.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Время</FormLabel>
                      <FormControl>
                        <TimePicker
                          time={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Тип и цена билетов</CardTitle>
          </CardHeader>
          <CardContent>
            {form.watch("tickets").map((_, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`tickets.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Тип билета</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип билета" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="adult">Взрослый</SelectItem>
                          <SelectItem value="child">Детский</SelectItem>
                          <SelectItem value="additional">
                            Дополнительный
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tickets.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input placeholder="Название билета" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tickets.${index}.price`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Цена</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Точки сбора</CardTitle>
          </CardHeader>
          <CardContent>
            {form.watch("meetingPoints").map((_, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`meetingPoints.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input placeholder="Название места" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`meetingPoints.${index}.address`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Адрес</FormLabel>
                      <FormControl>
                        <Input placeholder="Адрес места" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <div className="flex items-center">
                <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Сохранение...
              </div>
            ) : (
              "Сохранить"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
