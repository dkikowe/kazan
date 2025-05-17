"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
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
import { excursionFormSchema, type ExcursionFormData } from "@/types/excursion";
import { ITag } from "@/models/Tag";
import { IFilterItem } from "@/models/FilterItem";
import { Types } from "mongoose";
import { ArrowLeft } from "lucide-react";

interface ExcursionProduct {
  _id: string;
  title: string;
}

export default function NewExcursionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [excursionProducts, setExcursionProducts] = useState<
    ExcursionProduct[]
  >([]);
  const [tags, setTags] = useState<(ITag & { _id: Types.ObjectId })[]>([]);
  const [filterItems, setFilterItems] = useState<
    (IFilterItem & { _id: Types.ObjectId })[]
  >([]);

  const form = useForm<ExcursionFormData>({
    resolver: zodResolver(excursionFormSchema) as Resolver<ExcursionFormData>,
    defaultValues: {
      card: {
        title: "",
        seoTitle: "",
        description: "",
        images: [],
        videoUrl: "",
        reviews: [],
        attractions: [],
        tags: [],
        filterItems: [],
        isPublished: false,
        commercialSlug: "",
        excursionProduct: null,
        placeMeeting: "",
        addressMeeting: "",
        duration: {
          hours: 0,
          minutes: 0,
        },
      },
      commercial: {
        prices: [],
        additionalServices: [],
        promoCodes: [],
      },
    },
    mode: "onChange",
  });

  useEffect(() => {
    fetchExcursionProducts();
    fetchTagsAndFilterItems();
  }, []);

  const fetchTagsAndFilterItems = async () => {
    try {
      const [tagsResponse, filterItemsResponse] = await Promise.all([
        fetch("/api/tags"),
        fetch("/api/filter-items"),
      ]);

      if (!tagsResponse.ok || !filterItemsResponse.ok) {
        throw new Error("Ошибка при загрузке данных");
      }

      const [tagsData, filterItemsData] = await Promise.all([
        tagsResponse.json(),
        filterItemsResponse.json(),
      ]);

      setTags(tagsData);
      setFilterItems(filterItemsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Ошибка при загрузке тегов и элементов фильтров");
    }
  };

  const fetchExcursionProducts = async () => {
    try {
      const response = await fetch("/api/excursion-products");
      const data = await response.json();
      setExcursionProducts(data);
    } catch (error) {
      toast.error("Ошибка при загрузке товаров экскурсий");
    }
  };

  async function onSubmit(values: ExcursionFormData) {
    try {
      setSaving(true);
      console.log("Начало отправки формы:", values);

      if (!values.card.title) {
        throw new Error("Название экскурсии обязательно");
      }
      if (!values.card.placeMeeting) {
        throw new Error("Место встречи обязательно");
      }
      if (!values.card.addressMeeting) {
        throw new Error("Адрес встречи обязателен");
      }

      const formData = {
        card: {
          title: values.card.title,
          seoTitle: values.card.seoTitle || "",
          description: values.card.description || "",
          images: values.card.images || [],
          videoUrl: values.card.videoUrl || "",
          reviews: values.card.reviews || [],
          attractions: values.card.attractions || [],
          tags: values.card.tags || [],
          filterItems: values.card.filterItems || [],
          isPublished: values.card.isPublished || false,
          placeMeeting: values.card.placeMeeting,
          addressMeeting: values.card.addressMeeting,
          duration: {
            hours: Number(values.card.duration?.hours) || 0,
            minutes: Number(values.card.duration?.minutes) || 0,
          },
          excursionProduct: values.card.excursionProduct?._id || null,
        },
        commercial: values.commercial,
      };

      console.log(
        "Подготовленные данные для отправки:",
        JSON.stringify(formData, null, 2)
      );

      const response = await fetch("/api/excursions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Получен ответ от сервера:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка от сервера:", errorData);
        throw new Error(errorData.error || "Ошибка при создании экскурсии");
      }

      const result = await response.json();
      console.log("Успешный ответ от сервера:", result);

      toast.success("Экскурсия успешно создана");
      router.push("/admin/excursions");
    } catch (error) {
      console.error("Ошибка при создании экскурсии:", error);
      toast.error(
        error instanceof Error ? error.message : "Ошибка при создании экскурсии"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/excursions")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">Создание новой экскурсии</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Форма отправлена");
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="card.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название экскурсии *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="card.seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO заголовок</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="card.description"
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

              <FormField
                control={form.control}
                name="card.placeMeeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Место встречи *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="card.addressMeeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес встречи *</FormLabel>
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
                  name="card.duration.hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Часы *</FormLabel>
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
                  name="card.duration.minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Минуты *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={59}
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
              </div>

              <FormField
                control={form.control}
                name="card.tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Теги</FormLabel>
                    <div className="space-y-4">
                      <Select
                        onValueChange={(value: string) => {
                          const currentTags = field.value || [];
                          if (!currentTags.includes(value)) {
                            field.onChange([...currentTags, value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите теги" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tags.map((tag) => (
                            <SelectItem
                              key={tag._id.toString()}
                              value={tag._id.toString()}
                            >
                              {tag.name || ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((tagId) => {
                          const tag = tags.find(
                            (t) => t._id.toString() === tagId
                          );
                          if (!tag) return null;

                          return (
                            <div
                              key={tagId}
                              className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
                            >
                              <span>{tag.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newTags = field.value?.filter(
                                    (id) => id !== tagId
                                  );
                                  field.onChange(newTags);
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="card.filterItems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Элементы фильтров</FormLabel>
                    <Select
                      onValueChange={(value: string) => {
                        const currentFilterItems = field.value || [];
                        if (!currentFilterItems.includes(value)) {
                          field.onChange([...currentFilterItems, value]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите элементы фильтров" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filterItems.map((filterItem) => (
                          <SelectItem
                            key={filterItem._id.toString()}
                            value={filterItem._id.toString()}
                          >
                            {filterItem.name || ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value?.map((filterItemId) => {
                        const filterItem = filterItems.find(
                          (f) => f._id.toString() === filterItemId
                        );
                        return filterItem ? (
                          <div
                            key={filterItem._id.toString()}
                            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                          >
                            <span>{filterItem.name || ""}</span>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter(
                                    (id) => id !== filterItemId
                                  )
                                );
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="card.excursionProduct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Товар экскурсии</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const product = excursionProducts.find(
                          (p) => p._id === value
                        );
                        if (product) {
                          field.onChange({
                            _id: product._id,
                            title: product.title,
                          });
                        } else {
                          field.onChange(null);
                        }
                      }}
                      value={field.value?._id || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите товар экскурсии" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {excursionProducts.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.title}
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
                name="card.isPublished"
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Коммерческая информация</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Здесь будут поля для цен, дополнительных услуг и промокодов */}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/excursions")}
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
