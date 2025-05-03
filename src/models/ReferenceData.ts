import mongoose from 'mongoose';

const referenceDataSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['transport', 'guide', 'ticket', 'food', 'other'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  properties: {
    description: String,
    capacity: Number,
    price: Number,
    availability: Boolean,
    schedule: [{
      day: String,
      time: String,
    }],
    contact: {
      phone: String,
      email: String,
    },
    additionalInfo: mongoose.Schema.Types.Mixed,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.ReferenceData || mongoose.model('ReferenceData', referenceDataSchema); 