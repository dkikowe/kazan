import mongoose from "mongoose";

export interface IBooking {
  _id: string;
  fullName: string;
  phone: string;
  ticketType: "adult" | "child" | "pensioner";
  paymentType: "full" | "prepayment" | "onsite";
  status: "new" | "processed" | "archived" | "deleted";
  createdAt: Date;
  updatedAt: Date;
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
    ticketType: {
      type: String,
      enum: ["adult", "child", "pensioner"],
      required: [true, "Тип билета обязателен"],
    },
    paymentType: {
      type: String,
      enum: ["full", "prepayment", "onsite"],
      required: [true, "Тип оплаты обязателен"],
    },
    status: {
      type: String,
      enum: ["new", "processed", "archived", "deleted"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema); 