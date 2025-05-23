import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ExcursionProduct from "@/models/ExcursionProduct";
import ExcursionCard from "@/models/ExcursionCard";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";
// Импортируем связанные модели для регистрации в Mongoose
import Tag from "@/models/Tag";
import FilterItem from "@/models/FilterItem";
import FilterGroup from "@/models/FilterGroup";
// Регистрируем модель Excursion в mongoose
// @ts-ignore: игнорируем ошибку для этого импорта
import excursionModel from "../../../models/Excursion";

// GET /api/excursions/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log("Начало обработки запроса на получение экскурсии");
  console.log("ID экскурсии:", id);

  try {
    // Проверяем валидность ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Невалидный ID экскурсии");
      return NextResponse.json(
        { error: "Невалидный ID экскурсии" },
        { status: 400 }
      );
    }

    // Подключаемся к базе данных
    await connectToDatabase();
    console.log("Подключение к базе данных успешно");

    // Регистрируем модели, если они еще не зарегистрированы
    if (!mongoose.models.ExcursionCard) {
      console.log("Регистрация модели ExcursionCard");
      mongoose.model("ExcursionCard", ExcursionCard.schema);
    }
    if (!mongoose.models.Tag) {
      console.log("Регистрация модели Tag");
      mongoose.model("Tag", Tag.schema);
    }

    // Получаем экскурсию
    const excursion = await mongoose.models.ExcursionCard.findById(id)
      .populate({
        path: "excursionProduct",
        select: "_id title startTimes tickets addressMeeting",
      })
      .lean();

    console.log("Результат поиска экскурсии:", excursion ? "Экскурсия найдена" : "Экскурсия не найдена");

    if (!excursion) {
      console.log("Экскурсия не найдена");
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }

    // Проверяем статус публикации
    const isPublished = (excursion as any).isPublished;
    if (!isPublished) {
      console.log("Экскурсия не опубликована");
      return NextResponse.json(
        { error: "Экскурсия не опубликована" },
        { status: 403 }
      );
    }

    console.log("Отправляем ответ с данными экскурсии");
    return NextResponse.json(excursion);
  } catch (error) {
    console.error("Ошибка при получении экскурсии:", error);
    return NextResponse.json(
      { error: "Ошибка при получении экскурсии" },
      { status: 500 }
    );
  }
}

// PUT /api/excursions/[id]
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    console.log("Обновление данных экскурсии...");
    
    const id = request.nextUrl.pathname.split('/').pop();
    console.log(`Обновляемый ID: ${id}`);
    
    const data = await request.json();
    console.log("Данные для обновления получены");

    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      console.error("Некорректный ID:", error);
      return NextResponse.json(
        { error: "Некорректный ID экскурсии" },
        { status: 400 }
      );
    }

    // Проверяем и обрабатываем изображения
    if (data.card && Array.isArray(data.card.images)) {
      console.log("Обновление галереи изображений:", data.card.images.length, "изображений");
      
      // Удаляем дубликаты URL-ов изображений
      const uniqueUrls = Array.from(new Set<string>(data.card.images));
      
      // Проверяем валидность URL-ов
      data.card.images = uniqueUrls.filter((url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          console.warn("Некорректный URL изображения:", url);
          return false;
        }
      });
    }
    
    // Проверка товара экскурсии
    if (data.card?.excursionProduct) {
      try {
        const productId = data.card.excursionProduct;
        
        // Если товар уже является объектом с _id и title, используем его как есть
        if (typeof productId === 'object' && productId._id && productId.title) {
          data.card.excursionProduct = {
            _id: String(productId._id),
            title: String(productId.title),
          };
        } else {
          // Иначе ищем товар по ID
          const product = await ExcursionProduct.findById(productId).lean();
          if (product) {
            data.card.excursionProduct = {
              _id: String(product._id),
              title: String(product.title || 'Без названия'),
            };
          } else {
            // Удаляем ссылку на несуществующий товар
            delete data.card.excursionProduct;
          }
        }
      } catch (err) {
        console.error("Ошибка при обработке товара экскурсии:", err);
        // Удаляем ссылку на проблемный товар
        delete data.card.excursionProduct;
      }
    } else if (data.card && 'excursionProduct' in data.card && !data.card.excursionProduct) {
      delete data.card.excursionProduct;
    }
    
    // Подготавливаем данные для обновления
    const updateData = {
      ...data.card,
      images: data.card.images || [],
      meetingPoint: {
        name: data.card.meetingPoint?.name || '',
        address: data.card.meetingPoint?.address || '',
        coordinates: data.card.meetingPoint?.coordinates || undefined
      },
      duration: {
        hours: data.card.duration?.hours || 0,
        minutes: data.card.duration?.minutes || 0
      },
      startTimes: data.card.startTimes || []
    };
    
    // Удаляем _id из объекта обновления, если он там есть
    if (updateData._id) {
      delete updateData._id;
    }
    
    console.log('Данные для обновления:', JSON.stringify(updateData, null, 2));
    
    // Обновляем данные экскурсии используя модель Mongoose
    const updatedExcursion = await ExcursionCard.findByIdAndUpdate(
      objectId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('excursionProduct', '_id title');
    
    if (!updatedExcursion) {
      console.error(`Экскурсия с ID ${id} не найдена`);
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }
    
    console.log('Обновленная экскурсия:', JSON.stringify(updatedExcursion, null, 2));
    
    // Обновляем коммерческие данные если есть
    if (data.commercial && updatedExcursion.commercialSlug) {
      const commercialData = {
        ...data.commercial,
        updatedAt: new Date()
      };
      
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error("Не удалось получить подключение к базе данных");
      }
      
      await db.collection("commercialexcursions").updateOne(
        { commercialSlug: updatedExcursion.commercialSlug },
        { 
          $set: commercialData,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
    }
    
    console.log(`Экскурсия с ID ${id} успешно обновлена`);
    return NextResponse.json(updatedExcursion);
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении экскурсии", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/excursions/[id]
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Удаление экскурсии...");
    
    const id = request.nextUrl.pathname.split('/').pop();
    console.log(`Удаляемый ID: ${id}`);
    
    const db = mongoose.connection.db;
    if (!db) {
      console.error("Не удалось получить объект базы данных");
      return NextResponse.json(
        { error: "Ошибка подключения к базе данных" },
        { status: 500 }
      );
    }
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      console.error("Некорректный ID:", error);
      return NextResponse.json(
        { error: "Некорректный ID экскурсии" },
        { status: 400 }
      );
    }
    
    // Получаем экскурсию перед удалением, чтобы узнать commercialSlug
    const excursion = await db.collection("excursioncards").findOne({ _id: objectId });
    
    if (!excursion) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }
    
    // Удаляем экскурсию из коллекции
    const result = await db.collection("excursioncards").deleteOne({ _id: objectId });
    console.log(`Удалено экскурсий: ${result.deletedCount}`);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Экскурсия не найдена или не удалена" },
        { status: 404 }
      );
    }

    // Удаляем коммерческие данные
    if (excursion.commercialSlug) {
      console.log(`Удаляем коммерческие данные с commercialSlug: ${excursion.commercialSlug}`);
      
      const commercialResult = await db.collection("commercialexcursions").deleteOne({
        commercialSlug: excursion.commercialSlug,
      });
      
      console.log(`Удалено коммерческих данных: ${commercialResult.deletedCount}`);
    }

    return NextResponse.json({ message: "Экскурсия успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении экскурсии:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении экскурсии" },
      { status: 500 }
    );
  }
} 