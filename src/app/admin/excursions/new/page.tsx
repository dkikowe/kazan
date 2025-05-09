"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Resolver } from "react-hook-form";

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
        whatYouWillSee: {
          title: "",
          items: [""],
        },
        reviews: [],
        attractions: [],
        tags: [],
        filterItems: [],
        isPublished: false,
        commercialSlug: "",
      },
      commercial: {
        schedule: [],
        meetingPoint: {
          name: "",
          address: "",
        },
        duration: {
          hours: 0,
          minutes: 0,
        },
        prices: [],
        additionalServices: [],
        promoCodes: [],
      },
    },
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

      // Проверяем обязательные поля
      if (!values.card.title) {
        throw new Error("Название экскурсии обязательно");
      }

      const formData = {
        card: {
          ...values.card,
          whatYouWillSee: values.card.whatYouWillSee || {
            title: "",
            items: [""],
          },
          reviews: values.card.reviews || [],
          attractions: values.card.attractions || [],
          tags: values.card.tags || [],
          filterItems: values.card.filterItems || [],
          isPublished: values.card.isPublished || false,
        },
        commercial: values.commercial || {
          schedule: [],
          meetingPoint: { name: "", address: "" },
          duration: { hours: 0, minutes: 0 },
          prices: [],
          additionalServices: [],
          promoCodes: [],
        },
      };

      const response = await fetch("/api/excursions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при создании экскурсии");
      }

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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Создание новой экскурсии</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                name="card.tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Теги</FormLabel>
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
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value?.map((tagId) => {
                        const tag = tags.find(
                          (t) => t._id.toString() === tagId
                        );
                        return tag ? (
                          <div
                            key={tag._id.toString()}
                            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                          >
                            <span>{tag.name || ""}</span>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter((id) => id !== tagId)
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

              <FormField
                control={form.control}
                name="card.commercialSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Коммерческий идентификатор (необязательно)
                    </FormLabel>
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
              <CardTitle>Коммерческая информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="commercial.meetingPoint.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название места встречи</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commercial.meetingPoint.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес места встречи</FormLabel>
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
                  name="commercial.duration.hours"
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
                  name="commercial.duration.minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Минуты</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={59}
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
              {saving ? "Сохранение..." : "Создать экскурсию"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
