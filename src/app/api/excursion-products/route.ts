import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ExcursionProduct from "@/models/ExcursionProduct";
import mongoose from "mongoose";

// GET /api/excursion-products
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const excursionId = searchParams.get('excursionId');

    console.log(`Запрос товаров экскурсий${excursionId ? ` для экскурсии ${excursionId}` : ''}`);

    // Формируем условие поиска
    const query = excursionId ? { excursionCard: excursionId } : {};

    const products = await ExcursionProduct.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'excursionCard',
        select: 'title',
        model: 'ExcursionCard'
      });

    console.log(`Найдено ${products.length} товаров экскурсий`);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Ошибка при запросе товаров экскурсий:", error);
    return NextResponse.json(
      { error: error.message || "Не удалось получить товары экскурсий" },
      { status: 500 }
    );
  }
}

// POST /api/excursion-products
export async function POST(request: Request) {
  try {
    console.log("Начало создания товара экскурсии");
    await connectToDatabase();
    const data = await request.json();
    
    console.log("Получены данные для создания товара:", data);

    // Проверяем обязательные поля
    if (!data.title) {
      console.error("Отсутствует название товара");
      return NextResponse.json(
        { error: "Название товара обязательно" },
        { status: 400 }
      );
    }

    if (!data.startTimes || data.startTimes.length === 0) {
      console.error("Отсутствуют времена начала");
      return NextResponse.json(
        { error: "Время начала обязательно" },
        { status: 400 }
      );
    }

    if (!data.dateRanges || data.dateRanges.length === 0) {
      console.error("Отсутствуют периоды продаж");
      return NextResponse.json(
        { error: "Периоды продаж обязательны" },
        { status: 400 }
      );
    }

    // Создаем товар с данными
    const productData = {
      excursionCard: data.excursionCard || null, // ID экскурсии может быть null
      title: data.title,
      services: data.services || [],
      dateRanges: data.dateRanges,
      startTimes: data.startTimes,
      meetingPoints: data.meetingPoints || [],
      tickets: data.tickets || [],
      paymentOptions: data.paymentOptions || [],
      additionalServices: data.additionalServices || [],
      groups: data.groups || [],
      isPublished: data.isPublished || false,
    };

    console.log("Создание товара с данными:", productData);

    const product = await ExcursionProduct.create(productData);
    console.log("Товар успешно создан:", product._id);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Ошибка при создании товара экскурсии:", error);
    return NextResponse.json(
      { error: error.message || "Не удалось создать товар экскурсии" },
      { status: 500 }
    );
  }
} 