import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ExcursionCard from "@/models/ExcursionCard";
import ExcursionProduct from "@/models/ExcursionProduct";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  
  try {
    await dbConnect();
    
    // Получаем данные о карточке экскурсии
    const excursion = await ExcursionCard.findById(params.id);
    
    if (!excursion) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }
    
    // Проверяем наличие связанного продукта
    if (!excursion.excursionProduct?._id) {
      return NextResponse.json(
        { error: "У экскурсии нет связанного продукта" },
        { status: 404 }
      );
    }
    
    // Получаем данные о продукте
    const product = await ExcursionProduct.findById(
      excursion.excursionProduct._id
    );
    
    if (!product) {
      return NextResponse.json(
        { error: "Продукт экскурсии не найден" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      _id: product._id,
      startTimes: product.startTimes,
      meetingPoints: product.meetingPoints,
    });
    
  } catch (error) {
    console.error("Ошибка при получении продукта экскурсии:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных" },
      { status: 500 }
    );
  }
} 