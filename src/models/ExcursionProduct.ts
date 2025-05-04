import mongoose, { Schema, Document } from 'mongoose';

export interface IExcursionProduct extends Document {
  excursionCard: mongoose.Types.ObjectId;
  services: {
    type: 'transport' | 'guide' | 'ticket' | 'lunch' | 'audioguide' | 'additional';
    subtype: string;
    hours: number;
    peopleCount: number;
    price: number;
  }[];
  dateRanges: {
    start: Date;
    end: Date;
    excludedDates: Date[];
  }[];
  startTimes: string[];
  meetingPoints: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }[];
  tickets: {
    type: 'adult' | 'child' | 'additional';
    name: string;
    price: number;
    isDefaultPrice?: boolean;
  }[];
  paymentOptions: {
    type: 'full' | 'prepayment' | 'onsite';
    prepaymentPercent?: number;
  }[];
  groups: {
    date: Date;
    time: string;
    meetingPoint: mongoose.Types.ObjectId;
    maxSize: number;
    autoStop: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ExcursionProductSchema = new Schema<IExcursionProduct>(
  {
    excursionCard: {
      type: Schema.Types.ObjectId,
      ref: 'ExcursionCard',
      required: true,
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
      },
      peopleCount: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
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
      excludedDates: [{
        type: Date,
      }],
    }],
    startTimes: [{
      type: String,
      required: true,
    }],
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
        lat: Number,
        lng: Number,
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
        type: Schema.Types.ObjectId,
        ref: 'MeetingPoint',
        required: true,
      },
      maxSize: {
        type: Number,
        required: true,
      },
      autoStop: {
        type: Boolean,
        default: false,
      },
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ExcursionProduct || mongoose.model<IExcursionProduct>('ExcursionProduct', ExcursionProductSchema); 