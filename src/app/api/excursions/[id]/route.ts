import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExcursionProduct from "@/models/ExcursionProduct";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/excursions/[id]
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Получение данных экскурсии...");
    
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid excursion ID" },
        { status: 400 }
      );
    }
    
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
    
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid excursion ID" },
        { status: 400 }
      );
    }
    
    console.log(`Обновляемый ID: ${id}`);
    
    const data = await request.json();
    console.log("Данные для обновления:", JSON.stringify(data, null, 2));
    
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

    // Проверяем существование товара экскурсии
    if (data.card?.excursionProduct) {
      console.log(`Проверяем товар экскурсии: ${data.card.excursionProduct}`);
      
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
          if (!product) {
            console.error("Товар экскурсии не найден");
            console.log("Пропускаем обработку товара экскурсии и продолжаем обновление");
            // Удаляем ссылку на несуществующий товар
            delete data.card.excursionProduct;
          } else {
            // Добавляем информацию о товаре в карточку экскурсии
            data.card.excursionProduct = {
              _id: String(product._id),
              title: String(product.title || ''),
            };
          }
        }
      } catch (err) {
        console.error("Ошибка при поиске товара экскурсии:", err);
        console.log("Пропускаем обработку товара экскурсии и продолжаем обновление");
        // Удаляем ссылку на проблемный товар
        delete data.card.excursionProduct;
      }
    }
    
    // Подготавливаем данные для обновления
    const updateData = {
      ...data.card,
      updatedAt: new Date()
    };
    
    // Обновляем экскурсию в коллекции
    const result = await db.collection("excursioncards").findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" }
    );
    
    console.log("Результат обновления экскурсии:", result ? "Успешно" : "Не найдена");
    
    if (!result || !result.value) {
      return NextResponse.json(
        { error: "Экскурсия не найдена или не обновлена" },
        { status: 404 }
      );
    }

    // Обновляем коммерческие данные
    if (data.commercial) {
      console.log("Обновляем коммерческие данные...");
      
      const commercialData = {
        ...data.commercial,
        updatedAt: new Date()
      };
      
      const commercialResult = await db.collection("commercialexcursions").findOneAndUpdate(
        { commercialSlug: result.value.commercialSlug },
        { 
          $set: commercialData,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true, returnDocument: "after" }
      );
      
      console.log("Результат обновления коммерческих данных:", commercialResult ? "Успешно" : "Ошибка");
    }

    return NextResponse.json(result.value);
  } catch (error) {
    console.error("Ошибка при обновлении экскурсии:", error);
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
    
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid excursion ID" },
        { status: 400 }
      );
    }
    
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