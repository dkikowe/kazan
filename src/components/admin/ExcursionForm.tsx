"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { excursionFormSchema, type ExcursionFormData } from "@/types/excursion";
import { ITag } from "@/models/Tag";
import { IFilterItem } from "@/models/FilterItem";
import { Types } from "mongoose";

interface ExcursionFormProps {
  excursion: ExcursionFormData;
}

export function ExcursionForm({ excursion }: ExcursionFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<(ITag & { _id: Types.ObjectId })[]>([]);
  const [filterItems, setFilterItems] = useState<
    (IFilterItem & { _id: Types.ObjectId })[]
  >([]);

  const form = useForm<ExcursionFormData>({
    resolver: zodResolver(excursionFormSchema),
    defaultValues: {
      card: excursion.card || {
        title: "",
        seoTitle: "",
        description: "",
        whatYouWillSee: {
          title: "",
          items: [],
        },
        images: [],
        reviews: [],
        attractions: [],
        tags: [],
        filterItems: [],
        isPublished: false,
        commercialSlug: "",
      },
      commercial: excursion.commercial || {
        schedule: [],
        prices: [],
        additionalServices: [],
        promoCodes: [],
      },
    },
  });

  useEffect(() => {
    if (excursion) {
      form.reset({
        card: excursion.card || {
          title: "",
          seoTitle: "",
          description: "",
          whatYouWillSee: {
            title: "",
            items: [],
          },
          images: [],
          reviews: [],
          attractions: [],
          tags: [],
          filterItems: [],
          isPublished: false,
          commercialSlug: "",
        },
        commercial: excursion.commercial || {
          schedule: [],
          prices: [],
          additionalServices: [],
          promoCodes: [],
        },
      });
    }
  }, [excursion, form]);

  useEffect(() => {
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

    fetchTagsAndFilterItems();
  }, []);

  const onSubmit = async (values: ExcursionFormData) => {
    try {
      setSaving(true);
      if (!values.card?._id) {
        throw new Error("Отсутствует ID экскурсии");
      }

      const response = await fetch(`/api/excursions/${values.card._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card: {
            ...values.card,
            whatYouWillSee: {
              ...values.card.whatYouWillSee,
              items: values.card.whatYouWillSee.items.filter(Boolean),
            },
          },
          commercial: values.commercial,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при обновлении экскурсии");
      }

      toast.success("Экскурсия успешно обновлена");
      router.push("/admin/excursions");
    } catch (error) {
      console.error("Error updating excursion:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Ошибка при обновлении экскурсии"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Контентная часть</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="card.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название экскурсии</FormLabel>
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
              name="card.whatYouWillSee.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок блока "Что вы увидите"</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                      const tag = tags.find((t) => t._id.toString() === tagId);
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
                                field.value?.filter((id) => id !== filterItemId)
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
              name="card.isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Опубликовать</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Коммерческая часть</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="card.commercialSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Коммерческий slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
