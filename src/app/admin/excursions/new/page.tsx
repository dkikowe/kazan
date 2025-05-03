"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { excursionFormSchema, type ExcursionFormData } from "@/types/excursion";

export default function NewExcursionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm<ExcursionFormData>({
    resolver: zodResolver(excursionFormSchema),
    defaultValues: {
      card: {
        title: "",
        seoTitle: "",
        description: "",
        images: [],
        videoUrl: "",
        whatYouWillSee: {
          title: "",
          items: [],
        },
        reviews: [],
        attractions: [],
        tags: [],
        categories: [],
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

  async function onSubmit(values: ExcursionFormData) {
    try {
      setSaving(true);
      const response = await fetch("/api/excursions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to create excursion");

      toast.success("Экскурсия успешно создана");
      router.push("/admin/excursions");
    } catch (error) {
      toast.error("Ошибка при создании экскурсии");
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
                name="card.whatYouWillSee.items"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пункты "Что вы увидите"</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {field.value.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...field.value];
                                newItems[index] = e.target.value;
                                field.onChange(newItems);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newItems = field.value.filter(
                                  (_, i) => i !== index
                                );
                                field.onChange(newItems);
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            field.onChange([...field.value, ""]);
                          }}
                        >
                          Добавить пункт
                        </Button>
                      </div>
                    </FormControl>
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
                            field.onChange(Number(e.target.value))
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Создание..." : "Создать экскурсию"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
