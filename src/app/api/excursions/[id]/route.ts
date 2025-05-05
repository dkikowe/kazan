import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ExcursionCard } from "@/models/excursion-card";
import CommercialExcursion from '@/models/CommercialExcursion';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

// GET /api/excursions/[id]
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const excursionCard = await ExcursionCard.findById(context.params.id).populate("tags categories");

    if (!excursionCard) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }

    const commercial = await CommercialExcursion.findOne({
      commercialSlug: excursionCard.commercialSlug,
    });

    return NextResponse.json({
      card: excursionCard,
      commercial: commercial || null,
    });
  } catch (error) {
    console.error("Ошибка при получении экскурсии:", error);
    return NextResponse.json(
      { error: "Ошибка при получении экскурсии" },
      { status: 500 }
    );
  }
}

// PUT /api/excursions/[id]
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const excursionCard = await ExcursionCard.findByIdAndUpdate(
      context.params.id,
      data,
      { new: true }
    ).populate("tags categories");

    if (!excursionCard) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }

    // Обновляем коммерческие данные
    if (data.commercial) {
      await CommercialExcursion.findOneAndUpdate(
        { commercialSlug: excursionCard.commercialSlug },
        data.commercial,
        { new: true, upsert: true }
      );
    }

    return NextResponse.json(excursionCard);
  } catch (error) {
    console.error("Ошибка при обновлении экскурсии:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении экскурсии" },
      { status: 500 }
    );
  }
}

// DELETE /api/excursions/[id]
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const excursionCard = await ExcursionCard.findByIdAndDelete(context.params.id);

    if (!excursionCard) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }

    // Удаляем коммерческие данные
    await CommercialExcursion.findOneAndDelete({
      commercialSlug: excursionCard.commercialSlug,
    });

    return NextResponse.json({ message: "Экскурсия успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении экскурсии:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении экскурсии" },
      { status: 500 }
    );
  }
} 