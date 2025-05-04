import mongoose, { Schema, Document } from "mongoose";
import { ExcursionCard } from "./excursion-card";

export interface IExcursionProduct extends Document {
  excursionCard: mongoose.Types.ObjectId | typeof ExcursionCard;
  tickets: Array<{
    type: string;
    price: number;
  }>;
  dateRanges: Array<{
    start: Date;
    end: Date;
  }>;
  meetingPoints: Array<{
    location: string;
    time: string;
  }>;
  paymentOptions: Array<{
    type: string;
    description: string;
  }>;
  groups: Array<{
    minSize: number;
    maxSize: number;
    price: number;
  }>;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExcursionProductSchema = new Schema<IExcursionProduct>(
  {
    excursionCard: {
      type: Schema.Types.ObjectId,
      ref: "ExcursionCard",
      required: true,
    },
    tickets: [
      {
        type: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    dateRanges: [
      {
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: true,
        },
      },
    ],
    meetingPoints: [
      {
        location: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
      },
    ],
    paymentOptions: [
      {
        type: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    groups: [
      {
        minSize: {
          type: Number,
          required: true,
        },
        maxSize: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ExcursionProduct = mongoose.models.ExcursionProduct || mongoose.model<IExcursionProduct>("ExcursionProduct", ExcursionProductSchema); 