import mongoose from "mongoose";

export interface IBooking {
  _id: string;
  fullName: string;
  phone: string;
  tickets?: Array<{
    type: "adult" | "child" | "pensioner";
    count: number;
  }>;
  ticketType?: "adult" | "child" | "pensioner";
  ticketCount?: number;
  paymentType: "full" | "prepayment" | "onsite";
  excursionId?: mongoose.Types.ObjectId | string;
  date?: string;
  time?: string;
  comment?: string;
  status: "new" | "processed" | "archived" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["adult", "child", "pensioner"],
    required: true
  },
  count: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

// Удаляем существующую модель, чтобы избежать проблем с обновлением схемы
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

const BookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "ФИО обязательно"],
    },
    phone: {
      type: String,
      required: [true, "Телефон обязателен"],
    },
    // Поддерживаем обе версии для обратной совместимости
    tickets: {
      type: [TicketSchema],
      required: false,
    },
    ticketType: {
      type: String,
      enum: ["adult", "child", "pensioner"],
      required: false,
    },
    ticketCount: {
      type: Number,
      default: 1,
      min: 1,
      required: false,
    },
    paymentType: {
      type: String,
      enum: ["full", "prepayment", "onsite"],
      required: [true, "Тип оплаты обязателен"],
    },
    excursionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExcursionCard",
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    time: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["new", "processed", "archived", "deleted"],
      default: "new",
    },
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.model("Booking", BookingSchema); 