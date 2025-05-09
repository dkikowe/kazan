import { z } from 'zod';

const whatYouWillSeeSchema = z.object({
  title: z.string().min(1, 'Обязательное поле'),
  items: z.array(z.string()).min(1, 'Добавьте хотя бы один пункт'),
});

const reviewSchema = z.object({
  date: z.string(),
  author: z.string(),
  text: z.string(),
  rating: z.number().min(1).max(5),
}).optional();

const meetingPointSchema = z.object({
  name: z.string().min(1, 'Обязательное поле'),
  address: z.string().min(1, 'Обязательное поле'),
}).optional();

const durationSchema = z.object({
  hours: z.number().min(0),
  minutes: z.number().min(0).max(59),
}).optional();

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
    title: z.string().min(1, "Название экскурсии обязательно"),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    videoUrl: z.string().optional(),
    whatYouWillSee: z.object({
      title: z.string().optional(),
      items: z.array(z.string()).optional(),
    }).optional(),
    reviews: z.array(z.any()).optional(),
    attractions: z.array(z.any()).optional(),
    tags: z.array(z.string()).optional(),
    filterItems: z.array(z.string()).optional(),
    isPublished: z.boolean(),
    commercialSlug: z.string().optional(),
    excursionProduct: z.string().optional(),
  }),
  commercial: z.object({
    schedule: z.array(z.any()).optional(),
    meetingPoint: z.object({
      name: z.string().optional(),
      address: z.string().optional(),
    }).optional(),
    duration: z.object({
      hours: z.number().optional(),
      minutes: z.number().optional(),
    }).optional(),
    prices: z.array(z.any()).optional(),
    additionalServices: z.array(z.any()).optional(),
    promoCodes: z.array(z.any()).optional(),
  }).optional(),
});

export type ExcursionFormData = z.infer<typeof excursionFormSchema>; 