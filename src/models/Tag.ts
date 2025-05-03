import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

const TagSchema: Schema = new Schema({
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
  sortOrder: {
    type: Number,
    required: [true, 'Порядок сортировки обязателен'],
    min: [0, 'Порядок сортировки не может быть отрицательным'],
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Предварительная обработка перед сохранением
TagSchema.pre('save', function(this: ITag, next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema); 