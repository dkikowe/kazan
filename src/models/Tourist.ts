import mongoose from 'mongoose';

const TouristSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  tickets: [{
    type: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  }],
  isChild: {
    type: Boolean,
    default: false,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export const Tourist = mongoose.models.Tourist || mongoose.model('Tourist', TouristSchema); 