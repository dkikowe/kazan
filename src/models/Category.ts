import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  seoMeta: {
    title: String,
    description: String,
    keywords: String,
  },
  filterGroup: {
    type: String,
    required: true,
  },
  tagLine: {
    type: String,
    required: true,
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

export default mongoose.models.Category || mongoose.model('Category', categorySchema); 