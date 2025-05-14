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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { GalleryUpload } from "@/components/ui/gallery-upload";
import { Label } from "@/components/ui/label";

const productFormSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
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
      subtype: z.string().min(1, "Обязательное поле"),
      hours: z.number().min(0),
      peopleCount: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  dateRanges: z.array(
    z.object({
      start: z.date(),
      end: z.date(),
      excludedDates: z.array(z.date()).optional(),
    })
  ),
  startTimes: z.array(z.string()),
  meetingPoints: z.array(
    z.object({
      name: z.string().min(1, "Обязательное поле"),
      address: z.string().min(1, "Обязательное поле"),
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
      name: z.string().min(1, "Обязательное поле"),
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
      name: z.string().min(1, "Обязательное поле"),
      price: z.number().min(0),
      description: z.string().optional(),
    })
  ),
  groups: z.array(
    z.object({
      date: z.date(),
      time: z.string().min(1, "Обязательное поле"),
      meetingPoint: z.string().min(1, "Обязательное поле"),
      maxSize: z.number().min(1),
      autoStop: z.boolean(),
      groupSettings: z.object({
        defaultGroupsCount: z.number().min(1),
        seatsPerGroup: z.number().min(1),
        autoStopsCount: z.number().min(0),
      }),
    })
  ),
  isPublished: z.boolean(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface Group {
  date: Date;
  time: string;
  meetingPoint: string;
  maxSize: number;
  autoStop: boolean;
  groupSettings: {
    defaultGroupsCount: number;
    seatsPerGroup: number;
    autoStopsCount: number;
  };
}

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [excursions, setExcursions] = useState<
    Array<{ _id: string; title: string }>
  >([]);
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      services: [],
      dateRanges: [],
      startTimes: ["09:00"],
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

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        console.log("Загрузка списка экскурсий");
        const response = await fetch("/api/excursions");

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Ошибка API при загрузке экскурсий:", errorData);
          throw new Error(errorData.error || "Не удалось загрузить экскурсии");
        }

        const data = await response.json();
        console.log(`Загружено ${data.length} экскурсий`);
        setExcursions(data);
      } catch (error) {
        console.error("Ошибка при загрузке экскурсий:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Ошибка при загрузке экскурсий"
        );
      }
    };

    fetchExcursions();
  }, []);

  const onSubmit = async (values: ProductFormData) => {
    try {
      console.log("Создание нового товара экскурсии:", values);
      setSaving(true);

      // Преобразуем строковые значения в числовые для полей групп
      const formattedValues = {
        ...values,
        groups: values.groups.map((group) => ({
          ...group,
          maxSize: Number(group.maxSize),
          groupSettings: {
            ...group.groupSettings,
            defaultGroupsCount: Number(group.groupSettings.defaultGroupsCount),
            seatsPerGroup: Number(group.groupSettings.seatsPerGroup),
            autoStopsCount: Number(group.groupSettings.autoStopsCount),
          },
        })),
        images: images,
      };

      const response = await fetch("/api/excursion-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Ошибка API при создании товара:", error);
        throw new Error(
          error.error || error.message || "Не удалось создать товар"
        );
      }

      const createdProduct = await response.json();
      console.log("Товар успешно создан:", createdProduct);
      toast.success("Товар успешно создан");
      router.push("/admin/excursions");
    } catch (error: any) {
      console.error("Ошибка при создании товара:", error);
      toast.error(error.message || "Ошибка при создании товара");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Создание товара экскурсии</h1>
      </div>

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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Время начала</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("startTimes").map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`startTimes.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Время начала экскурсии</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
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
                      form.setValue(
                        "startTimes",
                        currentTimes.filter((_, i) => i !== index)
                      );
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Услуги</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Услуга {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

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
                              <SelectValue placeholder="Выберите тип услуги" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="transport">Транспорт</SelectItem>
                            <SelectItem value="guide">Гид</SelectItem>
                            <SelectItem value="ticket">Билет</SelectItem>
                            <SelectItem value="lunch">Обед</SelectItem>
                            <SelectItem value="audioguide">Аудиогид</SelectItem>
                            <SelectItem value="additional">
                              Дополнительно
                            </SelectItem>
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

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`services.${index}.hours`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Часы</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
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
                                field.onChange(parseInt(e.target.value))
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
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить услугу
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Периоды продаж</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dateRangeFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Период {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDateRange(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`dateRanges.${index}.start`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Начало периода</FormLabel>
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
                      name={`dateRanges.${index}.end`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Конец периода</FormLabel>
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
                  </div>
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить период
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Места встречи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meetingPointFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Место встречи {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMeetingPoint(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`meetingPoints.${index}.name`}
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить место встречи
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Билеты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticketFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Билет {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTicket(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

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
                              field.onChange(parseInt(e.target.value))
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
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Цена по умолчанию</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить билет
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Способы оплаты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentOptionFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Способ оплаты {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePaymentOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

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
                            <SelectItem value="onsite">На месте</SelectItem>
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
                              field.onChange(parseInt(e.target.value))
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
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить способ оплаты
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Дополнительные услуги</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {additionalServiceFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Услуга {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAdditionalService(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`additionalServices.${index}.name`}
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
                              field.onChange(parseInt(e.target.value))
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
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить услугу
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Группы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("groups").map((_, index) => (
                <div key={index} className="space-y-4 border p-4 rounded-lg">
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
                      name={`groups.${index}.groupSettings.defaultGroupsCount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Количество групп по умолчанию</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`groups.${index}.groupSettings.seatsPerGroup`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Мест в одной группе</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`groups.${index}.groupSettings.autoStopsCount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Количество автостопов</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                      groupSettings: {
                        defaultGroupsCount: 1,
                        seatsPerGroup: 10,
                        autoStopsCount: 0,
                      },
                    },
                  ]);
                }}
              >
                Добавить группу
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Галерея изображений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FormLabel>Галерея изображений</FormLabel>
                <GalleryUpload value={images} onChange={setImages} />
              </div>
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Опубликовать</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/excursions")}
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
