import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ExcursionCard from "@/models/ExcursionCard";
import ExcursionProduct from "@/models/ExcursionProduct";
import mongoose from "mongoose";

// Интерфейс для типизации результата запроса экскурсии
interface ExcursionCardInfo {
  _id: mongoose.Types.ObjectId | string;
  title?: string;
  excursionProduct?: {
    _id: string;
    title?: string;
  };
  [key: string]: any;
}

// GET /api/excursions/[id]/times
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;

    // Получаем данные о карточке экскурсии
    const excursionDoc = await ExcursionCard.findById(id).lean();
    
    if (!excursionDoc) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }

    // Приводим результат к известному типу
    const excursion = excursionDoc as unknown as ExcursionCardInfo;

    // Проверяем, есть ли у экскурсии связанный продукт
    let availableTimes: string[] = [];
    
    if (excursion.excursionProduct?._id) {
      try {
        // Получаем продукт экскурсии
        const product = await ExcursionProduct.findById(
          excursion.excursionProduct._id
        ).lean();

        // Извлекаем доступные времена из продукта, если они есть
        if (product?.startTimes && Array.isArray(product.startTimes)) {
          availableTimes = product.startTimes;
        }
      } catch (error) {
        console.error("Ошибка при получении данных продукта:", error);
      }
    }

    // Если не удалось получить времена, устанавливаем стандартные
    if (availableTimes.length === 0) {
      availableTimes = [
        "09:00", "10:00", "11:00", "12:00", "13:00", 
        "14:00", "15:00", "16:00", "17:00", "18:00"
      ];
    }

    return NextResponse.json({ availableTimes });
  } catch (error) {
    console.error("Ошибка при получении времен:", error);
    return NextResponse.json(
      { error: "Ошибка при получении времен", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 