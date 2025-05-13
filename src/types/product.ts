import { z } from "zod";

export const productFormSchema = z.object({
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
      subtype: z.string().min(1, "Подтип услуги обязателен"),
      hours: z.number().min(0, "Количество часов не может быть отрицательным"),
      peopleCount: z.number().min(1, "Количество человек должно быть не менее 1"),
      price: z.number().min(0, "Цена не может быть отрицательной"),
    })
  ).default([]),
  dateRanges: z.array(
    z.object({
      start: z.date(),
      end: z.date(),
      excludedDates: z.array(z.date()).default([]),
    })
  ).default([]),
  startTimes: z.array(z.string().min(1, "Время начала обязательно")).default([""]),
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
  ).default([]),
  tickets: z.array(
    z.object({
      type: z.enum(["adult", "child", "additional"]),
      name: z.string().min(1, "Название билета обязательно"),
      price: z.number().min(0, "Цена не может быть отрицательной"),
      isDefaultPrice: z.boolean().default(false),
    })
  ).default([]),
  paymentOptions: z.array(
    z.object({
      type: z.enum(["full", "prepayment", "onsite"]),
      prepaymentPercent: z.number().min(0).max(100).optional(),
      description: z.string().optional(),
    })
  ).default([]),
  additionalServices: z.array(
    z.object({
      name: z.string().min(1, "Название услуги обязательно"),
      price: z.number().min(0, "Цена не может быть отрицательной"),
      description: z.string().optional(),
    })
  ).default([]),
  groups: z.array(
    z.object({
      date: z.date(),
      time: z.string().min(1, "Время обязательно"),
      meetingPoint: z.string().min(1, "Место встречи обязательно"),
      maxSize: z.number().min(1, "Максимальный размер группы должен быть не менее 1"),
      autoStop: z.boolean().default(false),
    })
  ).default([]),
  isPublished: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productFormSchema>; 