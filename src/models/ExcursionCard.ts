import mongoose, { Schema, Document } from 'mongoose';
import { ITag } from './Tag';
import { IFilterItem } from './FilterItem';

export interface IExcursionCard extends Document {
  title: string;
  seoTitle?: string;
  description?: string;
  images: string[];
  videoUrl?: string;
  reviews: Array<{
    author: string;
    text: string;
    rating: number;
  }>;
  attractions: string[];
  tags: mongoose.Types.ObjectId[];
  filterItems: mongoose.Types.ObjectId[];
  isPublished: boolean;
  commercialSlug: string;
  excursionProduct?: mongoose.Types.ObjectId;
  placeMeeting: string;
  addressMeeting: string;
  duration: {
    hours: number;
    minutes: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ExcursionCardSchema = new Schema<IExcursionCard>({
  title: {
    type: String,
    required: [true, 'Название обязательно'],
    trim: true,
  },
  seoTitle: {
    type: String,
    required: false,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  images: [{
    type: String,
    required: false,
    validate: {
      validator: function(url: string) {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Некорректный URL изображения'
    }
  }],
  videoUrl: {
    type: String,
  },
  reviews: [{
    author: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
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
  filterItems: [{
    type: Schema.Types.ObjectId,
    ref: 'FilterItem',
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  commercialSlug: {
    type: String,
    required: true,
    unique: true,
  },
  excursionProduct: {
    type: Schema.Types.ObjectId,
    ref: 'ExcursionProduct',
  },
  placeMeeting: {
    type: String,
    required: [true, 'Место встречи обязательно'],
    trim: true,
  },
  addressMeeting: {
    type: String,
    required: [true, 'Адрес встречи обязателен'],
    trim: true,
  },
  duration: {
    type: {
      hours: {
        type: Number,
        required: true,
        min: 0,
      },
      minutes: {
        type: Number,
        required: true,
        min: 0,
        max: 59,
      },
    },
    required: true,
  },
}, {
  timestamps: true,
  strict: true,
});

// Удаляем старую модель, если она существует
if (mongoose.models.ExcursionCard) {
  delete mongoose.models.ExcursionCard;
}

const ExcursionCard = mongoose.model<IExcursionCard>('ExcursionCard', ExcursionCardSchema);
export default ExcursionCard; 