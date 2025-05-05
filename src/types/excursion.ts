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
    _id: z.string().optional(),
    title: z.string().min(1, 'Обязательное поле'),
    seoTitle: z.string().min(1, 'Обязательное поле'),
    description: z.string().min(1, 'Обязательное поле'),
    images: z.array(z.string()).optional(),
    videoUrl: z.string().optional(),
    whatYouWillSee: whatYouWillSeeSchema,
    reviews: z.array(reviewSchema).optional(),
    attractions: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    isPublished: z.boolean(),
    commercialSlug: z.string().min(1, 'Обязательное поле'),
  }).optional(),
  commercial: z.object({
    schedule: z.array(z.object({
      date: z.string().min(1, 'Обязательное поле'),
      time: z.string().min(1, 'Обязательное поле'),
    })).optional(),
    meetingPoint: meetingPointSchema,
    duration: durationSchema,
    prices: z.array(priceSchema).optional(),
    additionalServices: z.array(additionalServiceSchema).optional(),
    promoCodes: z.array(promoCodeSchema).optional(),
  }).optional(),
});

export type ExcursionFormData = z.infer<typeof excursionFormSchema>; 