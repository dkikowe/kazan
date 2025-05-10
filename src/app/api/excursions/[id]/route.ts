import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExcursionProduct from "@/models/ExcursionProduct";
import ExcursionCard from "@/models/ExcursionCard";
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
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Получение данных экскурсии...");
    
    const id = request.nextUrl.pathname.split('/').pop();
    console.log(`Запрашиваемый ID: ${id}`);
    
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
    
    // Получаем экскурсию из коллекции
    const excursionCard = await db.collection("excursioncards").findOne({ _id: objectId });
    console.log("Найдена экскурсия:", excursionCard ? "Да" : "Нет");
    
    if (!excursionCard) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }

    // Получаем коммерческие данные из коллекции
    const commercial = await db.collection("commercialexcursions").findOne({ 
      commercialSlug: excursionCard.commercialSlug 
    });
    console.log("Найдены коммерческие данные:", commercial ? "Да" : "Нет");

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
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Обновление данных экскурсии...");
    
    const id = request.nextUrl.pathname.split('/').pop();
    console.log(`Обновляемый ID: ${id}`);
    
    const data = await request.json();
    console.log("Данные для обновления получены");
    
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
    
    // Подготавливаем данные
    const updateData = {
      ...data.card,
    };
    
    // Обновляем экскурсию используя модель Mongoose
    try {
      // Используем модель ExcursionCard вместо прямого обращения к коллекции
      const updatedExcursion = await ExcursionCard.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: false }
      ).lean();
      
      if (!updatedExcursion) {
        console.error(`Экскурсия с ID ${id} не найдена`);
        return NextResponse.json(
          { error: "Экскурсия не найдена" },
          { status: 404 }
        );
      }
      
      // Обновляем коммерческие данные если есть
      if (data.commercial && updatedExcursion && 'commercialSlug' in updatedExcursion && updatedExcursion.commercialSlug) {
        const db = mongoose.connection.db;
        if (db) {
          const commercialData = {
            ...data.commercial,
            updatedAt: new Date()
          };
          
          await db.collection("commercialexcursions").updateOne(
            { commercialSlug: updatedExcursion.commercialSlug },
            { 
              $set: commercialData,
              $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
          );
        }
      }
      
      console.log(`Экскурсия с ID ${id} успешно обновлена`);
      return NextResponse.json(updatedExcursion);
    } catch (err) {
      console.error("Ошибка при обновлении экскурсии:", err);
      return NextResponse.json(
        { error: "Ошибка при обновлении экскурсии", details: err instanceof Error ? err.message : String(err) },
        { status: 500 }
      );
    }
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