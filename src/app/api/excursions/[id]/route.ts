import { NextRequest } from "next/server";
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
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const excursion = await ExcursionCard.findById(context.params.id)
      .populate('tags')
      .populate('categories');

    if (!excursion) {
      return new Response(JSON.stringify({ error: "Экскурсия не найдена" }), {
        status: 404,
      });
    }

    // Получаем коммерческие данные
    const commercial = await CommercialExcursion.findOne({
      commercialSlug: excursion.commercialSlug,
    });

    return new Response(JSON.stringify({ card: excursion, commercial }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Ошибка при получении экскурсии" }), {
      status: 500,
    });
  }
}

// PUT /api/excursions/[id]
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    
    const excursion = await ExcursionCard.findByIdAndUpdate(
      context.params.id,
      { $set: data },
      { new: true }
    ).populate('tags').populate('categories');

    if (!excursion) {
      return new Response(JSON.stringify({ error: "Экскурсия не найдена" }), {
        status: 404,
      });
    }

    // Обновляем коммерческие данные
    if (data.commercial) {
      await CommercialExcursion.findOneAndUpdate(
        { commercialSlug: excursion.commercialSlug },
        data.commercial,
        { new: true }
      );
    }

    return new Response(JSON.stringify(excursion), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Ошибка при обновлении экскурсии" }), {
      status: 500,
    });
  }
}

// DELETE /api/excursions/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const excursion = await ExcursionCard.findByIdAndDelete(context.params.id);

    if (!excursion) {
      return new Response(JSON.stringify({ error: "Экскурсия не найдена" }), {
        status: 404,
      });
    }

    // Удаляем коммерческие данные
    await CommercialExcursion.findOneAndDelete({
      commercialSlug: excursion.commercialSlug,
    });

    return new Response(JSON.stringify({ message: "Экскурсия успешно удалена" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Ошибка при удалении экскурсии" }), {
      status: 500,
    });
  }
} 