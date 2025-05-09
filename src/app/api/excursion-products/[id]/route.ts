import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ExcursionProduct from "@/models/ExcursionProduct";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Запрос информации о товаре с ID: ${params.id}`);
    await connectToDatabase();
    const product = await ExcursionProduct.findById(params.id);
    
    if (!product) {
      console.error(`Товар с ID ${params.id} не найден`);
      return NextResponse.json(
        { error: `Товар с ID ${params.id} не найден` },
        { status: 404 }
      );
    }

    console.log(`Информация о товаре ${params.id} успешно получена`);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Ошибка при получении информации о товаре:", error);
    return NextResponse.json(
      { error: "Не удалось получить информацию о товаре" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Запрос на обновление товара с ID: ${params.id}`);
    await connectToDatabase();
    const data = await request.json();
    console.log(`Получены данные для обновления товара: ${params.id}`, data);

    // Проверяем существование товара
    const existingProduct = await ExcursionProduct.findById(params.id);
    if (!existingProduct) {
      console.error(`Товар с ID ${params.id} не найден`);
      return NextResponse.json(
        { error: `Товар с ID ${params.id} не найден` },
        { status: 404 }
      );
    }

    // Проверяем обязательные поля
    if (!data.excursionCard) {
      console.error("Отсутствует ID экскурсии");
      return NextResponse.json(
        { error: "ID экскурсии обязателен" },
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

    // Проверяем существование экскурсии
    try {
      const db = mongoose.connection.db;
      if (!db) {
        console.error("Не удалось получить объект базы данных");
        return NextResponse.json(
          { error: "Ошибка подключения к базе данных" },
          { status: 500 }
        );
      }
      
      const excursion = await db.collection("excursioncards").findOne({
        _id: new mongoose.Types.ObjectId(data.excursionCard)
      });

      if (!excursion) {
        console.error(`Экскурсия с ID ${data.excursionCard} не найдена`);
        return NextResponse.json(
          { error: `Экскурсия с ID ${data.excursionCard} не найдена` },
          { status: 404 }
        );
      }
      console.log(`Экскурсия с ID ${data.excursionCard} найдена: ${excursion.title}`);
    } catch (err) {
      console.error("Ошибка при проверке существования экскурсии:", err);
      return NextResponse.json(
        { error: "Ошибка при проверке существования экскурсии" },
        { status: 500 }
      );
    }

    // Обновляем товар
    const product = await ExcursionProduct.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );

    if (!product) {
      console.error(`Не удалось обновить товар с ID ${params.id}`);
      return NextResponse.json(
        { error: "Не удалось обновить товар" },
        { status: 500 }
      );
    }

    console.log(`Товар с ID ${params.id} успешно обновлен`);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Ошибка при обновлении товара:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при обновлении товара" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Запрос на удаление товара с ID: ${params.id}`);
    await connectToDatabase();
    
    // Проверяем существование товара перед удалением
    const existingProduct = await ExcursionProduct.findById(params.id);
    if (!existingProduct) {
      console.error(`Товар с ID ${params.id} не найден`);
      return NextResponse.json(
        { error: `Товар с ID ${params.id} не найден` },
        { status: 404 }
      );
    }
    
    console.log(`Найден товар для удаления: ${existingProduct._id} - экскурсия: ${existingProduct.excursionCard}`);

    // Проверяем, есть ли связанные сущности
    try {
      // Здесь можно добавить проверку на связанные бронирования и т.д.
      // Например: const bookings = await Booking.find({ product: params.id });
      // if (bookings.length > 0) { throw new Error('Невозможно удалить товар с бронированиями'); }
    } catch (err) {
      console.error("Ошибка при проверке связанных сущностей:", err);
      return NextResponse.json(
        { error: "Ошибка при проверке связанных с товаром данных" },
        { status: 500 }
      );
    }

    const product = await ExcursionProduct.findByIdAndDelete(params.id);
    
    if (!product) {
      console.error(`Не удалось удалить товар с ID ${params.id}`);
      return NextResponse.json(
        { error: "Не удалось удалить товар" },
        { status: 500 }
      );
    }

    console.log(`Товар с ID ${params.id} успешно удален`);
    return NextResponse.json({ 
      message: "Товар успешно удален",
      deletedProduct: product 
    });
  } catch (error: any) {
    console.error("Ошибка при удалении товара:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при удалении товара" },
      { status: 500 }
    );
  }
} 