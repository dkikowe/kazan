import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './Category';
import { ITag } from './Tag';

export interface IExcursionCard extends Document {
  title: string;
  seoTitle: string;
  description: string;
  images: string[];
  videoUrl?: string;
  whatYouWillSee: {
    title: string;
    items: string[];
  };
  reviews: Array<{
    date: string;
    author: string;
    text: string;
    rating: number;
  }>;
  attractions: string[];
  tags: ITag[];
  categories: ICategory[];
  isPublished: boolean;
  commercialSlug: string;
}

const ExcursionCardSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Название обязательно'],
    trim: true,
  },
  seoTitle: {
    type: String,
    required: [true, 'SEO заголовок обязателен'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Описание обязательно'],
    trim: true,
  },
  images: [{
    type: String,
  }],
  videoUrl: {
    type: String,
  },
  whatYouWillSee: {
    title: {
      type: String,
      required: [true, 'Заголовок блока "Что вы увидите" обязателен'],
    },
    items: [{
      type: String,
      required: [true, 'Пункт "Что вы увидите" обязателен'],
    }],
  },
  reviews: [{
    date: String,
    author: String,
    text: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  }],
  attractions: [{
    type: String,
  }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  commercialSlug: {
    type: String,
    required: [true, 'Slug коммерческой части обязателен'],
    unique: true,
  },
}, {
  timestamps: true,
});

const ExcursionCard = mongoose.models.ExcursionCard || mongoose.model<IExcursionCard>('ExcursionCard', ExcursionCardSchema);
export default ExcursionCard; 