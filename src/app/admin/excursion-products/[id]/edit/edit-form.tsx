"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
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
import { GalleryUpload } from "@/components/ui/gallery-upload";

const productFormSchema = z.object({
  excursionCard: z.string().optional(),
  title: z.string().min(1, "Название товара обязательно"),
  images: z.array(z.string()).default([]),
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
  startTimes: z.array(z.string()).default([""]),
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

export type ProductFormData = z.infer<typeof productFormSchema>;

interface EditFormProps {
  id: string;
  initialData?: ProductFormData;
  excursionId?: string;
}

export default function EditForm({
  id,
  initialData,
  excursionId,
}: EditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTimes, setStartTimes] = useState<string[]>([""]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      images: initialData?.images || [],
      services: initialData?.services || [],
      dateRanges:
        initialData?.dateRanges?.map((range) => ({
          ...range,
          start: new Date(range.start),
          end: new Date(range.end),
          excludedDates:
            range.excludedDates?.map((date) => new Date(date)) || [],
        })) || [],
      startTimes: initialData?.startTimes || [""],
      meetingPoints: initialData?.meetingPoints || [],
      tickets: initialData?.tickets || [],
      paymentOptions: initialData?.paymentOptions || [],
      additionalServices: initialData?.additionalServices || [],
      groups:
        initialData?.groups?.map((group) => ({
          ...group,
          date: new Date(group.date),
        })) || [],
      isPublished: initialData?.isPublished || false,
    },
  });

  const {
    fields: dateRangeFields,
    append: appendDateRange,
    remove: removeDateRange,
  } = useFieldArray({
    control: form.control,
    name: "dateRanges",
  });

  useEffect(() => {
    if (initialData) {
      setStartTimes(initialData.startTimes || [""]);

      // Обновляем значения формы при получении initialData
      form.reset({
        title: initialData.title || "",
        images: initialData.images || [],
        services: initialData.services || [],
        dateRanges:
          initialData.dateRanges?.map((range) => ({
            ...range,
            start: new Date(range.start),
            end: new Date(range.end),
            excludedDates:
              range.excludedDates?.map((date) => new Date(date)) || [],
          })) || [],
        startTimes: initialData.startTimes || [""],
        meetingPoints: initialData.meetingPoints || [],
        tickets: initialData.tickets || [],
        paymentOptions: initialData.paymentOptions || [],
        additionalServices: initialData.additionalServices || [],
        groups:
          initialData.groups?.map((group) => ({
            ...group,
            date: new Date(group.date),
          })) || [],
        isPublished: initialData.isPublished || false,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: ProductFormData) => {
    try {
      console.log("Начало сохранения товара:", JSON.stringify(values, null, 2));
      setSaving(true);

      // Подготавливаем данные для отправки
      const formData = {
        ...values,
        dateRanges: values.dateRanges.map((range) => ({
          ...range,
          start: range.start.toISOString(),
          end: range.end.toISOString(),
          excludedDates: range.excludedDates.map((date) => date.toISOString()),
        })),
        groups: values.groups.map((group) => ({
          ...group,
          date: group.date.toISOString(),
        })),
      };

      console.log(
        "Подготовленные данные для отправки:",
        JSON.stringify(formData, null, 2)
      );

      const response = await fetch(
        `/api/excursion-products/${id}?_=${Date.now()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Ошибка API:", responseData);
        throw new Error(responseData.message || "Не удалось обновить товар");
      }

      console.log("Товар успешно обновлен:", responseData);
      toast.success("Товар успешно обновлен");

      setTimeout(() => {
        if (excursionId) {
          router.push(`/admin/excursions/${excursionId}/products`);
        } else {
          router.push(`/admin/excursion-products`);
        }
      }, 1000);
    } catch (error: any) {
      console.error("Ошибка при сохранении товара:", error);
      toast.error(error.message || "Ошибка при обновлении товара");
    } finally {
      setSaving(false);
    }
  };

  const handleAddStartTime = () => {
    setStartTimes([...startTimes, ""]);
  };

  const handleRemoveStartTime = (index: number) => {
    setStartTimes(startTimes.filter((_, i) => i !== index));
  };

  const handleStartTimeChange = (index: number, value: string) => {
    const newStartTimes = [...startTimes];
    newStartTimes[index] = value;
    setStartTimes(newStartTimes);
    form.setValue("startTimes", newStartTimes);
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
            onClick={() => router.push("/admin/excursion-products")}
            className="mt-4"
          >
            Вернуться к списку товаров
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container">
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
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Галерея изображений</FormLabel>
                    <FormControl>
                      <GalleryUpload
                        value={field.value || []}
                        onChange={(urls) => field.onChange(urls)}
                      />
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
              {dateRangeFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name={`dateRanges.${index}.start`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата начала</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
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
                      <FormItem>
                        <FormLabel>Дата окончания</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeDateRange(index)}
                    className="mt-8"
                  >
                    Удалить
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendDateRange({
                    start: new Date(),
                    end: new Date(),
                    excludedDates: [],
                  })
                }
              >
                Добавить период
              </Button>
            </CardContent>
          </Card>

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

          <Card>
            <CardHeader>
              <CardTitle>Время начала</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          value={time}
                          onChange={(e) =>
                            handleStartTimeChange(index, e.target.value)
                          }
                          placeholder="Время начала (например, 10:00)"
                        />
                      </FormControl>
                    </FormItem>
                    {startTimes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveStartTime(index)}
                      >
                        Удалить
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddStartTime}
                >
                  Добавить время начала
                </Button>
              </div>
            </CardContent>
          </Card>

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

          <Card>
            <CardHeader>
              <CardTitle>Группы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("groups").map((field, index) => (
                <div
                  key={`group-${index}`}
                  className="space-y-4 border p-4 rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`groups.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Дата</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value instanceof Date
                                  ? field.value.toISOString().split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(new Date(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`groups.${index}.time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Время</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`groups.${index}.meetingPoint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Место встречи</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`groups.${index}.maxSize`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Максимальный размер группы</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`groups.${index}.autoStop`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Автостоп</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const currentGroups = form.getValues("groups");
                      form.setValue(
                        "groups",
                        currentGroups.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Удалить группу
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentGroups = form.getValues("groups");
                  form.setValue("groups", [
                    ...currentGroups,
                    {
                      date: new Date(),
                      time: "",
                      meetingPoint: "",
                      maxSize: 0,
                      autoStop: false,
                    },
                  ]);
                }}
              >
                Добавить группу
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
