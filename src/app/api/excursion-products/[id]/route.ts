import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ExcursionProduct from "@/models/ExcursionProduct";
import ExcursionCard from "@/models/ExcursionCard";
import mongoose from "mongoose";
// Импортируем связанные модели для регистрации в Mongoose
import Tag from "@/models/Tag";
import FilterItem from "@/models/FilterItem";
import FilterGroup from "@/models/FilterGroup";
// Регистрируем модель Excursion в mongoose
// @ts-ignore: игнорируем ошибку для этого импорта
import excursionModel from "../../../models/Excursion";
import dbConnect from "@/lib/dbConnect";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  console.log("API: Получен запрос для товара экскурсии с ID:", params.id);

  try {
    await dbConnect();
    console.log("API: Подключение к базе данных успешно");

    const excursionProduct = await ExcursionProduct.findById(params.id)
      .populate('excursionCard', 'title description images')
      .lean();
    
    console.log("API: Поиск товара экскурсии выполнен");
    
    if (!excursionProduct) {
      console.log("API: Товар экскурсии не найден");
      return NextResponse.json(
        { error: "Товар экскурсии не найден" },
        { status: 404 }
      );
    }

    // Преобразуем даты в строки для корректной сериализации
    const formattedProduct = {
      ...excursionProduct,
      dateRanges: excursionProduct.dateRanges?.map(range => ({
        ...range,
        start: range.start?.toISOString(),
        end: range.end?.toISOString(),
        excludedDates: range.excludedDates?.map(date => date.toISOString())
      })),
      groups: excursionProduct.groups?.map(group => ({
        ...group,
        date: group.date?.toISOString()
      }))
    };

    console.log("API: Товар экскурсии найден, отправляем ответ");
    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("API: Ошибка при получении товара экскурсии:", error);
    return NextResponse.json(
      { error: "Ошибка при получении товара экскурсии" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  console.log("API: Получен запрос на обновление товара с ID:", params.id);

  try {
    await dbConnect();
    console.log("API: Подключение к базе данных успешно");

    const data = await request.json();
    console.log("API: Получены данные для обновления:", data);

    // Преобразуем строковые даты в объекты Date
    const formattedData = {
      ...data,
      dateRanges: data.dateRanges?.map((range: any) => ({
        ...range,
        start: new Date(range.start),
        end: new Date(range.end),
        excludedDates: range.excludedDates?.map((date: string) => new Date(date)) || []
      })),
      groups: data.groups?.map((group: any) => ({
        ...group,
        date: new Date(group.date)
      }))
    };

    console.log("API: Подготовленные данные:", formattedData);

    const result = await ExcursionProduct.findByIdAndUpdate(
      params.id,
      { $set: formattedData },
      { new: true }
    );

    if (!result) {
      console.log("API: Товар не найден");
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    console.log("API: Товар успешно обновлен");
    return NextResponse.json(result);
  } catch (error) {
    console.error("API: Ошибка при обновлении товара:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении товара" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    console.log(`Запрос на удаление товара с ID: ${id}`);
    await connectToDatabase();
    
    // Проверяем существование товара перед удалением
    const existingProduct = await ExcursionProduct.findById(id);
    if (!existingProduct) {
      console.error(`Товар с ID ${id} не найден`);
      return NextResponse.json(
        { error: `Товар с ID ${id} не найден` },
        { status: 404 }
      );
    }
    
    console.log(`Найден товар для удаления: ${existingProduct._id} - экскурсия: ${existingProduct.excursionCard}`);

    // Проверяем, есть ли связанные сущности
    try {
      // Здесь можно добавить проверку на связанные бронирования и т.д.
      // Например: const bookings = await Booking.find({ product: id });
      // if (bookings.length > 0) { throw new Error('Невозможно удалить товар с бронированиями'); }
    } catch (err) {
      console.error("Ошибка при проверке связанных сущностей:", err);
      return NextResponse.json(
        { error: "Ошибка при проверке связанных с товаром данных" },
        { status: 500 }
      );
    }

    const product = await ExcursionProduct.findByIdAndDelete(id);
    
    if (!product) {
      console.error(`Не удалось удалить товар с ID ${id}`);
      return NextResponse.json(
        { error: "Не удалось удалить товар" },
        { status: 500 }
      );
    }

    console.log(`Товар с ID ${id} успешно удален`);
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