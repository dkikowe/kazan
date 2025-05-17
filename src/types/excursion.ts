import { z } from 'zod';

const reviewSchema = z.object({
  date: z.string(),
  author: z.string(),
  text: z.string(),
  rating: z.number().min(1).max(5),
}).optional();

const durationSchema = z.object({
  hours: z.number().min(0),
  minutes: z.number().min(0).max(59),
});

const priceSchema = z.object({
  type: z.string().min(1, 'Обязательное поле'),
  amount: z.number().min(0, 'Цена должна быть положительной'),
}).optional();

const additionalServiceSchema = z.object({
  name: z.string().min(1, 'Обязательное поле'),
  price: z.number().min(0, 'Цена должна быть положительной'),
}).optional();

const promoCodeSchema = z.object({
  code: z.string().min(1, 'Обязательное поле'),
  discount: z.number().min(0, 'Скидка должна быть положительной'),
}).optional();

export const excursionFormSchema = z.object({
  card: z.object({
    _id: z.string().optional(),
    title: z.string().min(1, "Название экскурсии обязательно"),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    videoUrl: z.string().optional(),
    reviews: z.array(reviewSchema).optional(),
    attractions: z.array(z.any()).optional(),
    tags: z.array(z.string()).optional(),
    filterItems: z.array(z.string()).optional(),
    isPublished: z.boolean().default(false),
    commercialSlug: z.string().optional(),
    excursionProduct: z.object({
      _id: z.string(),
      title: z.string()
    }).nullable().optional(),
    placeMeeting: z.string().min(1, "Место встречи обязательно"),
    addressMeeting: z.string().min(1, "Адрес встречи обязателен"),
    duration: durationSchema,
  }),
  commercial: z.object({
    prices: z.array(priceSchema).optional(),
    additionalServices: z.array(additionalServiceSchema).optional(),
    promoCodes: z.array(promoCodeSchema).optional(),
  }).optional(),
});

export type ExcursionFormData = z.infer<typeof excursionFormSchema>; 