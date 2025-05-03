import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  seoMeta: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  filterGroup: string;
  tagLine: string;
  tagSort: number;
  showInTags: boolean;
}

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Название обязательно'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug обязателен'],
    trim: true,
    unique: true,
    lowercase: true,
  },
  seoMeta: {
    title: String,
    description: String,
    keywords: String,
  },
  filterGroup: {
    type: String,
    required: [true, 'Группа фильтров обязательна'],
  },
  tagLine: {
    type: String,
    required: [true, 'Теговая линия обязательна'],
  },
  tagSort: {
    type: Number,
    default: 0,
  },
  showInTags: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Предварительная обработка перед сохранением
CategorySchema.pre('save', function(this: ICategory, next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category; 