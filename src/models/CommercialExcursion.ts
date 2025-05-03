import mongoose, { Schema, Document } from 'mongoose';

export interface ICommercialExcursion extends Document {
  schedule: Array<{
    date: string;
    time: string;
  }>;
  meetingPoint: {
    name: string;
    address: string;
  };
  duration: {
    hours: number;
    minutes: number;
  };
  prices: Array<{
    type: string;
    amount: number;
  }>;
  additionalServices: Array<{
    name: string;
    price: number;
  }>;
  promoCodes: Array<{
    code: string;
    discount: number;
  }>;
  commercialSlug: string;
}

const CommercialExcursionSchema = new Schema({
  schedule: [{
    date: {
      type: String,
      required: [true, 'Дата обязательна'],
    },
    time: {
      type: String,
      required: [true, 'Время обязательно'],
    },
  }],
  meetingPoint: {
    name: {
      type: String,
      required: [true, 'Название места встречи обязательно'],
    },
    address: {
      type: String,
      required: [true, 'Адрес места встречи обязателен'],
    },
  },
  duration: {
    hours: {
      type: Number,
      required: [true, 'Количество часов обязательно'],
      min: [0, 'Количество часов не может быть отрицательным'],
    },
    minutes: {
      type: Number,
      required: [true, 'Количество минут обязательно'],
      min: [0, 'Количество минут не может быть отрицательным'],
      max: [59, 'Количество минут не может быть больше 59'],
    },
  },
  prices: [{
    type: {
      type: String,
      required: [true, 'Тип цены обязателен'],
    },
    amount: {
      type: Number,
      required: [true, 'Сумма обязательна'],
      min: [0, 'Сумма не может быть отрицательной'],
    },
  }],
  additionalServices: [{
    name: {
      type: String,
      required: [true, 'Название услуги обязательно'],
    },
    price: {
      type: Number,
      required: [true, 'Цена обязательна'],
      min: [0, 'Цена не может быть отрицательной'],
    },
  }],
  promoCodes: [{
    code: {
      type: String,
      required: [true, 'Код промокода обязателен'],
    },
    discount: {
      type: Number,
      required: [true, 'Скидка обязательна'],
      min: [0, 'Скидка не может быть отрицательной'],
    },
  }],
  commercialSlug: {
    type: String,
    required: [true, 'Slug коммерческой части обязателен'],
    unique: true,
  },
}, {
  timestamps: true,
});

const CommercialExcursion = mongoose.models.CommercialExcursion || mongoose.model<ICommercialExcursion>('CommercialExcursion', CommercialExcursionSchema);
export default CommercialExcursion; 