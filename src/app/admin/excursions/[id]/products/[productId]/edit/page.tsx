"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FieldValues,
  FormProvider,
  Resolver,
} from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { z } from "zod";

const serviceTypes = [
  { value: "transport", label: "Транспорт" },
  { value: "guide", label: "Гид" },
  { value: "ticket", label: "Билет" },
  { value: "lunch", label: "Обед" },
  { value: "audioguide", label: "Радиогид" },
  { value: "additional", label: "Дополнительная услуга" },
] as const;

const transportSubtypes = [
  { value: "bus", label: "Автобус" },
  { value: "ship", label: "Теплоход" },
  { value: "train", label: "Поезд" },
] as const;

const productFormSchema = z.object({
  excursionCard: z.string().optional(),
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
  isPublished: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productFormSchema>;

type FormValues = {
  excursionCard?: string;
  title: string;
  services: Array<{
    type:
      | "transport"
      | "guide"
      | "ticket"
      | "lunch"
      | "audioguide"
      | "additional";
    subtype: string;
    hours: number;
    peopleCount: number;
    price: number;
  }>;
  dateRanges: Array<{
    start: Date;
    end: Date;
    excludedDates: Date[];
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
  tickets: Array<{
    type: "adult" | "child" | "additional";
    name: string;
    price: number;
    isDefaultPrice?: boolean;
  }>;
  paymentOptions: Array<{
    type: "full" | "prepayment" | "onsite";
    prepaymentPercent?: number;
    description?: string;
  }>;
  additionalServices: Array<{
    name: string;
    price: number;
    description?: string;
  }>;
  groups: Array<{
    date: Date;
    time: string;
    meetingPoint: string;
    maxSize: number;
    autoStop: boolean;
  }>;
  isPublished: boolean;
};

type FieldArrayNames =
  | "services"
  | "dateRanges"
  | "meetingPoints"
  | "tickets"
  | "paymentOptions"
  | "additionalServices"
  | "groups";

interface PageProps {
  params: { id: string; productId: string };
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(productFormSchema) as Resolver<FormValues>,
    defaultValues: {
      excursionCard: params.id,
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

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const {
    fields: dateRangeFields,
    append: appendDateRange,
    remove: removeDateRange,
  } = useFieldArray({
    control: form.control,
    name: "dateRanges",
  });

  const {
    fields: meetingPointFields,
    append: appendMeetingPoint,
    remove: removeMeetingPoint,
  } = useFieldArray({
    control: form.control,
    name: "meetingPoints",
  });

  const {
    fields: ticketFields,
    append: appendTicket,
    remove: removeTicket,
  } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  const {
    fields: paymentOptionFields,
    append: appendPaymentOption,
    remove: removePaymentOption,
  } = useFieldArray({
    control: form.control,
    name: "paymentOptions",
  });

  const {
    fields: additionalServiceFields,
    append: appendAdditionalService,
    remove: removeAdditionalService,
  } = useFieldArray({
    control: form.control,
    name: "additionalServices",
  });

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  // Функция для добавления поля массива
  const handleAddField = (name: FieldArrayNames) => {
    switch (name) {
      case "services":
        appendService({
          type: "transport",
          subtype: "",
          hours: 0,
          peopleCount: 1,
          price: 0,
        });
        break;
      case "dateRanges":
        appendDateRange({
          start: new Date(),
          end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          excludedDates: [],
        });
        break;
      case "meetingPoints":
        appendMeetingPoint({
          name: "",
          address: "",
        });
        break;
      case "tickets":
        appendTicket({
          type: "adult",
          name: "Взрослый",
          price: 0,
          isDefaultPrice: false,
        });
        break;
      case "paymentOptions":
        appendPaymentOption({
          type: "full",
          description: "",
        });
        break;
      case "additionalServices":
        appendAdditionalService({
          name: "",
          price: 0,
          description: "",
        });
        break;
      case "groups":
        appendGroup({
          date: new Date(),
          time: "12:00",
          meetingPoint: "",
          maxSize: 20,
          autoStop: false,
        });
        break;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        console.log(
          `Загрузка товара с ID: ${params.productId} для экскурсии ${params.id}`
        );
        await fetchProduct();
      } catch (err) {
        console.error("Ошибка при инициализации страницы:", err);
        setError("Не удалось загрузить данные товара");
        toast.error("Ошибка при загрузке товара");
        setLoading(false);
      }
    };
    init();
  }, [params.id, params.productId]);

  const fetchProduct = async () => {
    try {
      // Добавляем параметр для предотвращения кэширования
      const response = await fetch(
        `/api/excursion-products/${params.productId}?_=${Date.now()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка API при загрузке товара:", errorData);
        throw new Error(errorData.error || "Не удалось загрузить товар");
      }

      const data = await response.json();
      console.log("Получены данные товара:", data);

      if (!data || !data._id) {
        console.error("Получены невалидные данные товара:", data);
        throw new Error("Полученные данные товара не валидны");
      }

      // Преобразуем данные в формат формы
      const formData = {
        excursionCard: data.excursionCard?._id || data.excursionCard || "",
        title: data.title || "",
        services: data.services || [],
        dateRanges: (data.dateRanges || []).map((range: any) => ({
          start: new Date(range.start),
          end: new Date(range.end),
          excludedDates:
            range.excludedDates?.map((date: string) => new Date(date)) || [],
        })),
        startTimes: data.startTimes || [],
        meetingPoints: data.meetingPoints || [],
        tickets: data.tickets || [],
        paymentOptions: data.paymentOptions || [],
        additionalServices: data.additionalServices || [],
        groups: (data.groups || []).map((group: any) => ({
          ...group,
          date: new Date(group.date),
          autoStop: group.autoStop ?? false,
        })),
        isPublished: data.isPublished ?? false,
      };

      console.log("Данные формы подготовлены:", formData);
      form.reset(formData);
    } catch (error) {
      console.error("Ошибка при загрузке товара:", error);
      setError(
        `Ошибка при загрузке товара: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      toast.error(
        error instanceof Error ? error.message : "Ошибка при загрузке товара"
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (values) => {
    try {
      console.log(`Обновление товара с ID: ${params.productId}`, values);
      setSaving(true);
      const response = await fetch(
        `/api/excursion-products/${params.productId}?_=${Date.now()}`,
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
        router.push(`/admin/excursions/${params.id}/products`);
      }, 1000);
    } catch (error: any) {
      console.error("Ошибка при обновлении товара:", error);
      toast.error(error.message || "Ошибка при обновлении товара");
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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Ошибка</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
            <Button
              onClick={() =>
                router.push(`/admin/excursions/${params.id}/products`)
              }
              className="mt-4"
            >
              Вернуться к списку товаров
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Редактирование товара экскурсии</h1>
      </div>

      <FormProvider {...form}>
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
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Периоды продаж</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddField("dateRanges")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить период
              </Button>
            </CardHeader>
            <CardContent>
              {dateRangeFields.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Нет периодов продаж. Добавьте период для активации товара.
                </div>
              ) : (
                dateRangeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 p-4 border rounded-md mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        Период {index + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDateRange(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`dateRanges.${index}.start`}
                        render={({ field }) => (
                          <FormItem>
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
                          <FormItem>
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
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Время начала</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  form.setValue("startTimes", [
                    ...form.getValues("startTimes"),
                    "",
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить время
              </Button>
            </CardHeader>
            <CardContent>
              {form.watch("startTimes").length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Нет времени начала. Добавьте хотя бы одно время.
                </div>
              ) : (
                form.watch("startTimes").map((_, index) => (
                  <div key={index} className="flex gap-4 mb-4 items-end">
                    <FormField
                      control={form.control}
                      name={`startTimes.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Время начала {index + 1}</FormLabel>
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
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const times = form.getValues("startTimes");
                          form.setValue(
                            "startTimes",
                            times.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Типы билетов</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddField("tickets")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить тип билета
              </Button>
            </CardHeader>
            <CardContent>
              {ticketFields.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Нет типов билетов. Добавьте хотя бы один тип.
                </div>
              ) : (
                ticketFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 p-4 border rounded-md mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Билет {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTicket(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`tickets.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Тип билета</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
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
                          <FormItem>
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
                          <FormItem>
                            <FormLabel>Цена</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                value={field.value}
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
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Точки сбора</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddField("meetingPoints")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить точку сбора
              </Button>
            </CardHeader>
            <CardContent>
              {meetingPointFields.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Нет точек сбора. Добавьте хотя бы одну точку.
                </div>
              ) : (
                meetingPointFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 p-4 border rounded-md mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        Точка сбора {index + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMeetingPoint(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`meetingPoints.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
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
                          <FormItem>
                            <FormLabel>Адрес</FormLabel>
                            <FormControl>
                              <Input placeholder="Адрес места" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Отмена
            </Button>
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
      </FormProvider>
    </div>
  );
}
