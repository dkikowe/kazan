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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  excursionCard: z.string(),
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
});

type ProductFormData = z.infer<typeof productFormSchema>;

type FieldArrayNames =
  | "services"
  | "dateRanges"
  | "meetingPoints"
  | "tickets"
  | "paymentOptions"
  | "additionalServices"
  | "groups";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [excursions, setExcursions] = useState([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      services: [],
      dateRanges: [],
      startTimes: [""],
      meetingPoints: [],
      tickets: [],
      paymentOptions: [],
      additionalServices: [],
      groups: [],
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

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        const response = await fetch("/api/excursions");
        const data = await response.json();
        setExcursions(data);
      } catch (error) {
        toast.error("Ошибка при загрузке экскурсий");
      } finally {
        setLoading(false);
      }
    };

    fetchExcursions();
  }, []);

  const onSubmit = async (values: ProductFormData) => {
    try {
      setSaving(true);
      const response = await fetch("/api/excursion-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to create product");

      toast.success("Товар успешно создан");
      router.push("/admin/excursions");
    } catch (error) {
      toast.error("Ошибка при создании товара");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Создание товара экскурсии</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="excursionCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Экскурсия</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите экскурсию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {excursions.map((excursion: any) => (
                          <SelectItem key={excursion._id} value={excursion._id}>
                            {excursion.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Услуги</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-2 gap-4 p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`services.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип услуги</FormLabel>
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
                            {serviceTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`services.${index}.subtype`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтип</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`services.${index}.hours`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Количество часов</FormLabel>
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
                    name={`services.${index}.peopleCount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Количество человек</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
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
                    name={`services.${index}.price`}
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

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeService(index)}
                  >
                    Удалить услугу
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendService({
                    type: "transport",
                    subtype: "",
                    hours: 0,
                    peopleCount: 1,
                    price: 0,
                  })
                }
              >
                Добавить услугу
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Даты и время</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dateRangeFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-2 gap-4 p-4 border rounded-lg"
                >
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

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeDateRange(index)}
                  >
                    Удалить период
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
              <CardTitle>Места сбора</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meetingPointFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-2 gap-4 p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`meetingPoints.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название места</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeMeetingPoint(index)}
                  >
                    Удалить место
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendMeetingPoint({
                    name: "",
                    address: "",
                  })
                }
              >
                Добавить место
              </Button>
            </CardContent>
          </Card>

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

          <Card>
            <CardHeader>
              <CardTitle>Варианты оплаты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentOptionFields.map((field, index) => (
                <div
                  key={field.id}
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
                    onClick={() => removePaymentOption(index)}
                  >
                    Удалить вариант оплаты
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendPaymentOption({
                    type: "full",
                    prepaymentPercent: 0,
                    description: "",
                  })
                }
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
              {additionalServiceFields.map((field, index) => (
                <div
                  key={field.id}
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
                    onClick={() => removeAdditionalService(index)}
                  >
                    Удалить услугу
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendAdditionalService({
                    name: "",
                    price: 0,
                    description: "",
                  })
                }
              >
                Добавить услугу
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Билеты и цены</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticketFields.map((field, index) => (
                <div
                  key={field.id}
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
                    onClick={() => removeTicket(index)}
                  >
                    Удалить билет
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendTicket({
                    type: "adult",
                    name: "",
                    price: 0,
                    isDefaultPrice: false,
                  })
                }
              >
                Добавить билет
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
              {saving ? "Сохранение..." : "Создать товар"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
