import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import ExcursionProduct from "@/models/ExcursionProduct";
import ExcursionCard from "@/models/ExcursionCard";
import mongoose from "mongoose";
// Импортируем все связанные модели для регистрации в Mongoose
import Tag from "@/models/Tag";
import FilterItem from "@/models/FilterItem";
import FilterGroup from "@/models/FilterGroup";
// Регистрируем модель Excursion в mongoose
// @ts-ignore: игнорируем ошибку для этого импорта
import excursionModel from "../../models/Excursion";

// GET /api/excursion-products
export async function GET(request: Request) {
  try {
    await dbConnect();
    console.log("API: Начало обработки запроса на получение товаров экскурсий");
    
    // Регистрируем все необходимые модели
    if (!mongoose.models.ExcursionProduct) {
      mongoose.model('ExcursionProduct', ExcursionProduct.schema);
    }
    if (!mongoose.models.ExcursionCard) {
      mongoose.model('ExcursionCard', ExcursionCard.schema);
    }
    if (!mongoose.models.Tag) {
      mongoose.model('Tag', Tag.schema);
    }
    
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const excursionId = searchParams.get('excursionId');

    console.log(`API: Параметры запроса:`, { excursionId });

    // Формируем условие поиска
    const query = excursionId ? { excursionCard: excursionId } : {};

    console.log("API: Запрос товаров с фильтром:", JSON.stringify(query));

    const products = await ExcursionProduct.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'excursionCard',
        select: 'title',
        model: 'ExcursionCard'
      })
      .lean();

    if (!products) {
      console.log("API: Товары не найдены");
      return NextResponse.json([], { status: 200 });
    }

    console.log(`API: Найдено ${products.length} товаров экскурсий`);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("API: Ошибка при получении товаров экскурсий:", error);
    return NextResponse.json(
      { error: "Ошибка при получении товаров экскурсий", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

// POST /api/excursion-products
export async function POST(request: Request) {
  try {
    console.log("Начало создания товара экскурсии");
    await dbConnect();
    const data = await request.json();
    
    console.log("Получены данные для создания товара:", JSON.stringify(data, null, 2));

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

    // Проверяем и обрабатываем изображения
    let images: string[] = [];
    if (data.images && Array.isArray(data.images)) {
      console.log("API: Обработка изображений из поля images");
      // Удаляем дубликаты URL изображений
      const uniqueUrls = Array.from(new Set<string>(data.images));
      // Фильтруем некорректные URL
      images = uniqueUrls.filter(url => {
        try {
          new URL(url);
          return true;
        } catch {
          console.warn("API: Некорректный URL изображения:", url);
          return false;
        }
      });
      console.log("API: Обработано изображений:", images.length);
    } else if (data.gallery && Array.isArray(data.gallery)) {
      // Для обратной совместимости проверяем поле gallery
      console.log("API: Обработка изображений из поля gallery");
      // Удаляем дубликаты URL изображений
      const uniqueUrls = Array.from(new Set<string>(data.gallery));
      // Фильтруем некорректные URL
      images = uniqueUrls.filter(url => {
        try {
          new URL(url);
          return true;
        } catch {
          console.warn("API: Некорректный URL изображения:", url);
          return false;
        }
      });
      console.log("API: Обработано изображений:", images.length);
    }

    // Создаем товар с данными
    const productData = {
      excursionCard: data.excursionCard || null,
      title: data.title,
      images: images, // Используем обработанный массив изображений
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

    console.log("Создание товара с данными:", JSON.stringify(productData, null, 2));

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