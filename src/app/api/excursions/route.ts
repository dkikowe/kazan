import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ExcursionProduct from "@/models/ExcursionProduct";
import mongoose from "mongoose";
import { nanoid } from 'nanoid';

// GET /api/excursions
export async function GET() {
  try {
    await connectToDatabase();
    console.log("Получение списка экскурсий из БД...");
    
    const db = mongoose.connection.db;
    if (!db) {
      console.error("Не удалось получить объект базы данных");
      return NextResponse.json([]);
    }
    
    const collection = db.collection('excursioncards');
    const rawExcursions = await collection.find({}).toArray();
    
    return NextResponse.json(rawExcursions);
  } catch (error) {
    console.error('Ошибка при получении экскурсий:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/excursions
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.card || !data.card.title) {
      return NextResponse.json(
        { error: "Название экскурсии обязательно" },
        { status: 400 }
      );
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Не удалось подключиться к базе данных");
    }

    // Генерируем уникальный commercialSlug
    const commercialSlug = `${data.card.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}-${nanoid(6)}`;

    // Подготавливаем данные для карточки экскурсии
    const cardData = {
      ...data.card,
      commercialSlug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Проверяем существование товара экскурсии
    if (data.card.excursionProduct) {
      const product = await ExcursionProduct.findById(data.card.excursionProduct).lean();
      if (product) {
        cardData.excursionProduct = {
          _id: product._id.toString(),
          title: product.title || 'Без названия',
        };
      }
    }

    // Создаем карточку экскурсии
    const collection = db.collection('excursioncards');
    const result = await collection.insertOne(cardData);
    
    if (!result.acknowledged) {
      throw new Error("Не удалось создать экскурсию");
    }

    const createdCard = {
      ...cardData,
      _id: result.insertedId,
    };

    // Создаем коммерческие данные, если они есть
    if (data.commercial) {
      const commercialCollection = db.collection('commercialexcursions');
      await commercialCollection.insertOne({
        ...data.commercial,
        commercialSlug,
        excursionId: result.insertedId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return NextResponse.json(createdCard);
  } catch (error) {
    console.error("Ошибка при создании экскурсии:", error);
    return NextResponse.json(
      { error: "Ошибка при создании экскурсии" },
      { status: 500 }
    );
  }
} 