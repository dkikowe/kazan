import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

// Создаем схему для экскурсоводов, если модели нет
const guideSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

// Получаем модель Guide
const Guide = mongoose.models.Guide || mongoose.model("Guide", guideSchema);

export async function GET() {
  try {
    await dbConnect();
    const guides = await Guide.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json(guides);
  } catch (error) {
    console.error("Ошибка при получении экскурсоводов:", error);
    return NextResponse.json(
      { error: "Ошибка при получении экскурсоводов" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const guide = await Guide.create(body);
    return NextResponse.json(guide);
  } catch (error) {
    console.error("Ошибка при создании экскурсовода:", error);
    return NextResponse.json(
      { error: "Ошибка при создании экскурсовода" },
      { status: 500 }
    );
  }
} 