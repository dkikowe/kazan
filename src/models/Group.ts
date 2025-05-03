import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
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
  transport: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferenceData',
  }],
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferenceData',
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferenceData',
  }],
  food: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  stopFlag: {
    type: Boolean,
    default: false,
  },
  excursion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Excursion',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Group || mongoose.model('Group', groupSchema); 