import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ExcursionProduct from "@/models/ExcursionProduct";
import ExcursionCard from "@/models/ExcursionCard";
import mongoose from "mongoose";
import { nanoid } from 'nanoid';

// GET /api/excursions
export async function GET() {
  try {
    await connectToDatabase();
    console.log("Получение списка экскурсий из БД...");
    
    // Используем модель ExcursionCard вместо прямого обращения к коллекции
    const excursions = await ExcursionCard.find({}).lean();
    
    return NextResponse.json(excursions);
  } catch (error) {
    console.error('Ошибка при получении экскурсий:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/excursions
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    console.log("Создание новой экскурсии...");
    
    const data = await request.json();
    console.log("Получены данные для создания экскурсии");

    if (!data.card || !data.card.title) {
      console.error("Отсутствует название экскурсии");
      return NextResponse.json(
        { error: "Название экскурсии обязательно" },
        { status: 400 }
      );
    }

    try {
      // Генерируем уникальный commercialSlug
      const commercialSlug = `${data.card.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}-${nanoid(6)}`;
      console.log(`Сгенерирован commercialSlug: ${commercialSlug}`);

      // Подготавливаем данные для карточки экскурсии
      const cardData = {
        ...data.card,
        commercialSlug,
      };

      // Обрабатываем товар экскурсии если указан
      if (data.card.excursionProduct) {
        try {
          console.log(`Проверяем товар экскурсии: ${data.card.excursionProduct}`);
          const product = await ExcursionProduct.findById(data.card.excursionProduct).lean();
          
          if (product) {
            cardData.excursionProduct = {
              _id: product._id.toString(),
              title: product.title || 'Без названия',
            };
            console.log(`Прикреплен товар экскурсии: ${product._id}, название: ${product.title || 'Без названия'}`);
          } else {
            console.warn(`Товар экскурсии с ID ${data.card.excursionProduct} не найден`);
            delete cardData.excursionProduct;
          }
        } catch (error) {
          console.error("Ошибка при проверке товара экскурсии:", error);
          delete cardData.excursionProduct;
        }
      }

      console.log("Создаю новую карточку экскурсии...");
      // Создаем экскурсию с помощью модели mongoose
      const createdCard = await ExcursionCard.create(cardData);
      console.log(`Создана новая экскурсия с ID: ${createdCard._id}`);

      // Создаем коммерческие данные если они есть
      if (data.commercial) {
        console.log("Создаю коммерческие данные для экскурсии...");
        const db = mongoose.connection.db;
        if (db) {
          await db.collection('commercialexcursions').insertOne({
            ...data.commercial,
            commercialSlug,
            excursionId: createdCard._id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log("Коммерческие данные созданы");
        }
      }

      return NextResponse.json(createdCard);
    } catch (err) {
      console.error("Ошибка при создании экскурсии:", err);
      return NextResponse.json(
        { error: "Ошибка при создании экскурсии", details: err instanceof Error ? err.message : String(err) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return NextResponse.json(
      { error: "Ошибка при создании экскурсии", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 