import mongoose from 'mongoose';

const excursionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  gallery: [{
    url: String,
    alt: String,
  }],
  video: {
    url: String,
    thumbnail: String,
  },
  seo: {
    title: String,
    description: String,
    keywords: String,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  relatedExcursions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Excursion',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  commercial: {
    calendar: {
      type: String,
      enum: ['fixed', 'flexible'],
      required: true,
    },
    availabilityDates: [Date],
    priceAdult: {
      type: Number,
      required: true,
    },
    priceChild: {
      type: Number,
      required: true,
    },
    startTimes: [String],
    meetingPoints: [{
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    }],
    paymentOptions: [{
      type: String,
      enum: ['cash', 'card', 'online'],
    }],
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    }],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Excursion || mongoose.model('Excursion', excursionSchema);
