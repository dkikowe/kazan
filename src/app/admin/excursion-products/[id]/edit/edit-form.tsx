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

const productSchema = z.object({
  tickets: z.array(
    z.object({
      type: z.enum(["adult", "child", "additional"]),
      name: z.string().min(1, "Название билета обязательно"),
      price: z.number().min(0, "Цена должна быть положительной"),
      isDefaultPrice: z.boolean().optional(),
    })
  ),
  dateRanges: z.array(
    z.object({
      start: z.date(),
      end: z.date(),
      excludedDates: z.array(z.date()).optional(),
    })
  ),
  startTimes: z.array(z.string().min(1, "Время начала обязательно")),
  meetingPoints: z.array(
    z.object({
      name: z.string().min(1, "Название места встречи обязательно"),
      address: z.string().min(1, "Адрес места встречи обязателен"),
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
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
      time: z.string().min(1, "Время группы обязательно"),
      meetingPoint: z.string().min(1, "Место встречи группы обязательно"),
      maxSize: z.number().min(1, "Максимальный размер группы обязателен"),
      autoStop: z.boolean(),
    })
  ),
  isPublished: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ExcursionProduct {
  _id: string;
  excursionCard: {
    _id: string;
    title: string;
  };
  tickets: Array<{
    type: "adult" | "child" | "additional";
    name: string;
    price: number;
    isDefaultPrice?: boolean;
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
    type: "full" | "prepayment" | "onsite";
    prepaymentPercent?: number;
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
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/excursion-products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update product");

      toast.success("Товар успешно обновлен");
      if (excursionId) {
        router.push(`/admin/excursions/${excursionId}/products`);
      } else {
        router.push(`/admin/excursion-products/${id}`);
      }
    } catch (error) {
      toast.error("Ошибка при обновлении товара");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Редактирование товара</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Билеты */}
          <Card>
            <CardHeader>
              <CardTitle>Билеты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("tickets").map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип билета</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип" />
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
                      <FormItem>
                        <FormLabel>Название</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`tickets.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Цена</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`tickets.${index}.isDefaultPrice`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Цена от</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const currentTickets = form.getValues("tickets");
                      form.setValue(
                        "tickets",
                        currentTickets.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Удалить билет
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentTickets = form.getValues("tickets");
                  form.setValue("tickets", [
                    ...currentTickets,
                    {
                      type: "adult",
                      name: "",
                      price: 0,
                      isDefaultPrice: false,
                    },
                  ]);
                }}
              >
                Добавить билет
              </Button>
            </CardContent>
          </Card>

          {/* Время начала */}
          <Card>
            <CardHeader>
              <CardTitle>Время начала</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form.watch("startTimes").map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`startTimes.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Время начала (например, 10:00)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentTimes = form.getValues("startTimes");
                        form.setValue("startTimes", [
                          ...currentTimes.slice(0, index),
                          ...currentTimes.slice(index + 1),
                        ]);
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentTimes = form.getValues("startTimes");
                    form.setValue("startTimes", [...currentTimes, ""]);
                  }}
                >
                  Добавить время начала
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Варианты оплаты */}
          <Card>
            <CardHeader>
              <CardTitle>Варианты оплаты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("paymentOptions").map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`paymentOptions.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип оплаты</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип оплаты" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full">Полная оплата</SelectItem>
                            <SelectItem value="prepayment">
                              Предоплата
                            </SelectItem>
                            <SelectItem value="onsite">
                              Оплата на месте
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`paymentOptions.${index}.prepaymentPercent`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Процент предоплаты</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`paymentOptions.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Описание варианта оплаты"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const currentOptions = form.getValues("paymentOptions");
                      form.setValue(
                        "paymentOptions",
                        currentOptions.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Удалить вариант оплаты
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentOptions = form.getValues("paymentOptions");
                  form.setValue("paymentOptions", [
                    ...currentOptions,
                    { type: "full", prepaymentPercent: 0, description: "" },
                  ]);
                }}
              >
                Добавить вариант оплаты
              </Button>
            </CardContent>
          </Card>

          {/* Дополнительные услуги */}
          <Card>
            <CardHeader>
              <CardTitle>Дополнительные услуги</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("additionalServices").map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`additionalServices.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название услуги</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Название услуги" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`additionalServices.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Цена</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`additionalServices.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Описание услуги" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const currentServices =
                        form.getValues("additionalServices");
                      form.setValue(
                        "additionalServices",
                        currentServices.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Удалить услугу
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentServices = form.getValues("additionalServices");
                  form.setValue("additionalServices", [
                    ...currentServices,
                    { name: "", price: 0, description: "" },
                  ]);
                }}
              >
                Добавить услугу
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
