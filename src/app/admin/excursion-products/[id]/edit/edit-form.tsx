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

const productSchema = z.object({
  tickets: z.array(
    z.object({
      type: z.string().min(1, "Тип билета обязателен"),
      price: z.number().min(0, "Цена должна быть положительной"),
    })
  ),
  dateRanges: z.array(
    z.object({
      start: z.date(),
      end: z.date(),
    })
  ),
  meetingPoints: z.array(
    z.object({
      location: z.string().min(1, "Место встречи обязательно"),
      time: z.string().min(1, "Время встречи обязательно"),
    })
  ),
  paymentOptions: z.array(
    z.object({
      type: z.string().min(1, "Тип оплаты обязателен"),
      description: z.string().min(1, "Описание обязательно"),
    })
  ),
  groups: z.array(
    z.object({
      minSize: z.number().min(1, "Минимальный размер группы обязателен"),
      maxSize: z.number().min(1, "Максимальный размер группы обязателен"),
      price: z.number().min(0, "Цена должна быть положительной"),
    })
  ),
  isPublished: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ExcursionProduct {
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
  }>;
  meetingPoints: Array<{
    location: string;
    time: string;
  }>;
  paymentOptions: Array<{
    type: string;
    description: string;
  }>;
  groups: Array<{
    minSize: number;
    maxSize: number;
    price: number;
  }>;
  isPublished: boolean;
}

interface EditFormProps {
  id: string;
  initialData: ExcursionProduct;
}

export default function EditForm({ id, initialData }: EditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ExcursionProduct | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      tickets: initialData.tickets,
      dateRanges: initialData.dateRanges.map((range) => ({
        start: new Date(range.start),
        end: new Date(range.end),
      })),
      meetingPoints: initialData.meetingPoints,
      paymentOptions: initialData.paymentOptions,
      groups: initialData.groups,
      isPublished: initialData.isPublished,
    },
  });

  const tickets = watch("tickets");
  const dateRanges = watch("dateRanges");
  const meetingPoints = watch("meetingPoints");
  const paymentOptions = watch("paymentOptions");
  const groups = watch("groups");
  const isPublished = watch("isPublished");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/excursion-products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error("Ошибка при загрузке товара");
    } finally {
      setLoading(false);
    }
  };

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
      router.push(`/admin/excursion-products/${id}`);
    } catch (error) {
      toast.error("Ошибка при обновлении товара");
    } finally {
      setSaving(false);
    }
  };

  const addTicket = () => {
    setValue("tickets", [...tickets, { type: "", price: 0 }]);
  };

  const removeTicket = (index: number) => {
    setValue(
      "tickets",
      tickets.filter((_, i) => i !== index)
    );
  };

  const addDateRange = () => {
    setValue("dateRanges", [
      ...dateRanges,
      { start: new Date(), end: new Date() },
    ]);
  };

  const removeDateRange = (index: number) => {
    setValue(
      "dateRanges",
      dateRanges.filter((_, i) => i !== index)
    );
  };

  const addMeetingPoint = () => {
    setValue("meetingPoints", [...meetingPoints, { location: "", time: "" }]);
  };

  const removeMeetingPoint = (index: number) => {
    setValue(
      "meetingPoints",
      meetingPoints.filter((_, i) => i !== index)
    );
  };

  const addPaymentOption = () => {
    setValue("paymentOptions", [
      ...paymentOptions,
      { type: "", description: "" },
    ]);
  };

  const removePaymentOption = (index: number) => {
    setValue(
      "paymentOptions",
      paymentOptions.filter((_, i) => i !== index)
    );
  };

  const addGroup = () => {
    setValue("groups", [...groups, { minSize: 1, maxSize: 1, price: 0 }]);
  };

  const removeGroup = (index: number) => {
    setValue(
      "groups",
      groups.filter((_, i) => i !== index)
    );
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
          Редактирование товара: {product?.excursionCard.title}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Билеты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      {...register(`tickets.${index}.type`)}
                      placeholder="Тип билета"
                      disabled={saving}
                    />
                    {errors.tickets?.[index]?.type && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.tickets[index]?.type === "object" &&
                        "message" in errors.tickets[index]?.type
                          ? errors.tickets[index]?.type.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      {...register(`tickets.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Цена"
                      disabled={saving}
                    />
                    {errors.tickets?.[index]?.price && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.tickets[index]?.price === "object" &&
                        "message" in errors.tickets[index]?.price
                          ? errors.tickets[index]?.price.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTicket(index)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addTicket}
                disabled={saving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить билет
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Периоды продаж</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dateRanges.map((range, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <DatePicker
                      date={range.start}
                      onSelect={(date) => {
                        if (date) {
                          setValue(`dateRanges.${index}.start`, date);
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <DatePicker
                      date={range.end}
                      onSelect={(date) => {
                        if (date) {
                          setValue(`dateRanges.${index}.end`, date);
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDateRange(index)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addDateRange}
                disabled={saving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить период
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Места встречи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meetingPoints.map((point, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      {...register(`meetingPoints.${index}.location`)}
                      placeholder="Место встречи"
                      disabled={saving}
                    />
                    {errors.meetingPoints?.[index]?.location && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.meetingPoints[index]?.location ===
                          "object" &&
                        "message" in errors.meetingPoints[index]?.location
                          ? errors.meetingPoints[index]?.location.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <TimePicker
                      time={point.time}
                      onSelect={(time) =>
                        setValue(`meetingPoints.${index}.time`, time)
                      }
                    />
                    {errors.meetingPoints?.[index]?.time && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.meetingPoints[index]?.time ===
                          "object" &&
                        "message" in errors.meetingPoints[index]?.time
                          ? errors.meetingPoints[index]?.time.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMeetingPoint(index)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addMeetingPoint}
                disabled={saving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить место встречи
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Способы оплаты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentOptions.map((option, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      {...register(`paymentOptions.${index}.type`)}
                      placeholder="Тип оплаты"
                      disabled={saving}
                    />
                    {errors.paymentOptions?.[index]?.type && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.paymentOptions[index]?.type ===
                          "object" &&
                        "message" in errors.paymentOptions[index]?.type
                          ? errors.paymentOptions[index]?.type.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Textarea
                      {...register(`paymentOptions.${index}.description`)}
                      placeholder="Описание"
                      disabled={saving}
                    />
                    {errors.paymentOptions?.[index]?.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.paymentOptions[index]?.description ===
                          "object" &&
                        "message" in errors.paymentOptions[index]?.description
                          ? errors.paymentOptions[index]?.description.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePaymentOption(index)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addPaymentOption}
                disabled={saving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить способ оплаты
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Группы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groups.map((group, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      type="number"
                      {...register(`groups.${index}.minSize`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Мин. размер группы"
                      disabled={saving}
                    />
                    {errors.groups?.[index]?.minSize && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.groups[index]?.minSize === "object" &&
                        "message" in errors.groups[index]?.minSize
                          ? errors.groups[index]?.minSize.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      {...register(`groups.${index}.maxSize`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Макс. размер группы"
                      disabled={saving}
                    />
                    {errors.groups?.[index]?.maxSize && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.groups[index]?.maxSize === "object" &&
                        "message" in errors.groups[index]?.maxSize
                          ? errors.groups[index]?.maxSize.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      {...register(`groups.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Цена"
                      disabled={saving}
                    />
                    {errors.groups?.[index]?.price && (
                      <p className="text-sm text-red-500 mt-1">
                        {typeof errors.groups[index]?.price === "object" &&
                        "message" in errors.groups[index]?.price
                          ? errors.groups[index]?.price.message
                          : "Обязательное поле"}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGroup(index)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addGroup}
                disabled={saving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить группу
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Публикация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublished"
                checked={isPublished}
                onCheckedChange={(checked) =>
                  setValue("isPublished", checked as boolean)
                }
                disabled={saving}
              />
              <label
                htmlFor="isPublished"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Опубликовать товар
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </form>
    </div>
  );
}
