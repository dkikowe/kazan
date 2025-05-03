import mongoose from 'mongoose';

const excursionCommercialSchema = new mongoose.Schema({
  schedule: [{
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  }],
  meetingPoint: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  duration: {
    hours: {
      type: Number,
      min: 0,
      required: true,
    },
    minutes: {
      type: Number,
      min: 0,
      max: 59,
      required: true,
    },
  },
  prices: [{
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
  }],
  additionalServices: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
  }],
  promoCodes: [{
    code: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const ExcursionCommercial = mongoose.models.ExcursionCommercial || mongoose.model('ExcursionCommercial', excursionCommercialSchema); 