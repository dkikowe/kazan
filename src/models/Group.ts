import mongoose from 'mongoose';

// Определение схемы для гида
const GuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
});

// Определение схемы для групп
const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    excursion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExcursionCard',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    transport: {
      type: [String],
      default: [],
    },
    guide: {
      type: GuideSchema,
      required: false,
    },
    tickets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReferenceData',
    }],
    food: {
      type: Boolean,
      default: false,
    },
    stopFlag: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Group = mongoose.models.Group || mongoose.model('Group', GroupSchema); 