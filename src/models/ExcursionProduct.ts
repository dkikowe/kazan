import mongoose, { Schema, Document } from 'mongoose';

export interface IExcursionProduct extends Document {
  excursionCard?: {
    type: mongoose.Schema.Types.ObjectId;
    ref: 'ExcursionCard';
  };
  title?: string;
  services: Array<{
    type: string;
    subtype: string;
    hours: number;
    peopleCount: number;
    price: number;
  }>;
  dateRanges: Array<{
    start: Date;
    end: Date;
    excludedDates?: Date[];
  }>;
  startTimes: string[];
  meetingPoints: Array<{
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  tickets: Array<{
    type: string;
    name: string;
    price: number;
    isDefaultPrice?: boolean;
  }>;
  paymentOptions: Array<{
    type: string;
    prepaymentPercent?: number;
    description?: string;
  }>;
  additionalServices: Array<{
    name: string;
    price: number;
    description?: string;
  }>;
  groups: Array<{
    date: Date;
    time: string;
    meetingPoint: string;
    maxSize: number;
    autoStop: boolean;
    groupSettings: {
      defaultGroupsCount: number;
      seatsPerGroup: number;
      autoStopsCount: number;
    };
  }>;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const excursionProductSchema = new Schema<IExcursionProduct>({
  excursionCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcursionCard',
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  services: [{
    type: {
      type: String,
      enum: ['transport', 'guide', 'ticket', 'lunch', 'audioguide', 'additional'],
      required: true,
    },
    subtype: {
      type: String,
      required: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 0,
    },
    peopleCount: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  dateRanges: [{
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    excludedDates: [{ type: Date }],
  }],
  startTimes: [{ type: String, required: true }],
  meetingPoints: [{
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  }],
  tickets: [{
    type: {
      type: String,
      enum: ['adult', 'child', 'additional'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isDefaultPrice: {
      type: Boolean,
      default: false,
    },
  }],
  paymentOptions: [{
    type: {
      type: String,
      enum: ['full', 'prepayment', 'onsite'],
      required: true,
    },
    prepaymentPercent: {
      type: Number,
      min: 0,
      max: 100,
    },
    description: { type: String },
  }],
  additionalServices: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: { type: String },
  }],
  groups: [{
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    meetingPoint: {
      type: String,
      required: true,
    },
    maxSize: {
      type: Number,
      required: true,
      min: 1,
    },
    autoStop: {
      type: Boolean,
      required: true,
    },
    groupSettings: {
      defaultGroupsCount: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      seatsPerGroup: {
        type: Number,
        required: true,
        min: 1,
        default: 10
      },
      autoStopsCount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      }
    }
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  strict: false
});

if (mongoose.models.ExcursionProduct) {
  delete mongoose.models.ExcursionProduct;
}

const ExcursionProduct = mongoose.model<IExcursionProduct>('ExcursionProduct', excursionProductSchema);

export default ExcursionProduct; 