import { NextResponse } from "next/server";
import ExcursionProduct from "@/models/ExcursionProduct";
import ExcursionCard from "@/models/ExcursionCard";
import Tag, { ITag } from "@/models/Tag";
import FilterItem from "@/models/FilterItem";
import FilterGroup from "@/models/FilterGroup";
import mongoose from "mongoose";
import { nanoid } from 'nanoid';
import dbConnect from "@/lib/dbConnect";

// GET /api/excursions
export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Инициализируем модели перед запросом
    mongoose.model('Tag', Tag.schema);
    
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tag');
    
    // Создаём базовый запрос
    let query: any = { isPublished: true };
    
    // Если указан тег, добавляем его в запрос
    if (tagId) {
      try {
        const tagObjectId = new mongoose.Types.ObjectId(tagId);
        query.tags = tagObjectId;
        console.log(`Фильтрация по тегу ID: ${tagId}`);
      } catch(err) {
        console.error("Некорректный ID тега:", err);
      }
    }
    
    console.log("Запрос экскурсий с фильтром:", JSON.stringify(query));
    
    // Получаем экскурсии с учетом фильтра по тегам
    const excursions = await ExcursionCard.find(query)
      .populate("excursionProduct")
      .populate({
        path: "tags",
        model: mongoose.model('Tag')
      })
      .sort({ title: 1 });
      
    console.log(`Найдено ${excursions.length} экскурсий`);
    
    return NextResponse.json(excursions);
  } catch (error) {
    console.error("Ошибка при получении экскурсий:", error);
    return NextResponse.json(
      { error: "Ошибка при получении экскурсий" },
      { status: 500 }
    );
  }
}

// POST /api/excursions
export async function POST(request: Request) {
  try {
    console.log("Начало создания новой экскурсии...");
    await dbConnect();
    console.log("Подключение к базе данных установлено");
    
    const data = await request.json();
    console.log("Получены данные для создания экскурсии:", JSON.stringify(data, null, 2));

    if (!data.card || !data.card.title) {
      console.error("Отсутствует название экскурсии");
      return NextResponse.json(
        { error: "Название экскурсии обязательно" },
        { status: 400 }
      );
    }

    // Проверяем наличие обязательных полей
    console.log("Проверка полей:", {
      placeMeeting: data.card.placeMeeting,
      addressMeeting: data.card.addressMeeting,
      duration: data.card.duration
    });

    if (!data.card.placeMeeting) {
      console.error("Отсутствует место встречи");
      return NextResponse.json(
        { error: "Место встречи обязательно" },
        { status: 400 }
      );
    }

    if (!data.card.addressMeeting) {
      console.error("Отсутствует адрес встречи");
      return NextResponse.json(
        { error: "Адрес встречи обязателен" },
        { status: 400 }
      );
    }

    if (!data.card.duration || typeof data.card.duration.hours !== 'number' || typeof data.card.duration.minutes !== 'number') {
      console.error("Некорректная продолжительность:", data.card.duration);
      return NextResponse.json(
        { error: "Продолжительность должна быть указана в часах и минутах" },
        { status: 400 }
      );
    }

    // Генерируем уникальный commercialSlug
    const commercialSlug = `${data.card.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}-${nanoid(6)}`;
    console.log(`Сгенерирован commercialSlug: ${commercialSlug}`);

    // Создаем экскурсию напрямую через mongoose
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Нет подключения к базе данных");
    }

    const createdCard = await db.collection('excursioncards').insertOne({
      title: data.card.title,
      seoTitle: data.card.seoTitle || "",
      description: data.card.description || "",
      images: data.card.images || [],
      videoUrl: data.card.videoUrl || "",
      reviews: data.card.reviews || [],
      attractions: data.card.attractions || [],
      tags: data.card.tags || [],
      filterItems: data.card.filterItems || [],
      isPublished: data.card.isPublished || false,
      commercialSlug,
      excursionProduct: data.card.excursionProduct || null,
      placeMeeting: data.card.placeMeeting,
      addressMeeting: data.card.addressMeeting,
      duration: {
        hours: Number(data.card.duration.hours) || 0,
        minutes: Number(data.card.duration.minutes) || 0,
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("Созданная карточка:", JSON.stringify(createdCard, null, 2));

    // Получаем созданную карточку
    const savedCard = await db.collection('excursioncards').findOne({ _id: createdCard.insertedId });
    console.log("Сохраненная карточка:", JSON.stringify(savedCard, null, 2));

    // Создаем коммерческие данные если они есть
    if (data.commercial) {
      console.log("Создаю коммерческие данные для экскурсии...");
      await db.collection('commercialexcursions').insertOne({
        ...data.commercial,
        commercialSlug,
        excursionId: createdCard.insertedId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("Коммерческие данные созданы");
    }

    return NextResponse.json(savedCard);
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return NextResponse.json(
      { error: "Ошибка при создании экскурсии", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 