import mongoose from 'mongoose';

const excursionCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  seoTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
      required: true,
    },
    items: [{
      type: String,
      required: true,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  commercialSlug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const ExcursionCard = mongoose.models.ExcursionCard || mongoose.model('ExcursionCard', excursionCardSchema); 