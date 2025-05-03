import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  excursion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Excursion',
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  tourists: [{
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending',
  },
  transport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferenceData',
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferenceData',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  notes: String,
}, {
  timestamps: true,
});

export default mongoose.models.Application || mongoose.model('Application', applicationSchema); 