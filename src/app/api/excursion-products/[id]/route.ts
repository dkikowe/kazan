import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
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

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  console.log("API: Получен запрос для товара экскурсии с ID:", id);

  try {
    await dbConnect();
    console.log("API: Подключение к базе данных успешно");

    const excursionProduct = await ExcursionProduct.findById(id)
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
        start: range.start instanceof Date ? range.start.toISOString() : range.start,
        end: range.end instanceof Date ? range.end.toISOString() : range.end,
        excludedDates: range.excludedDates?.map(date => 
          date instanceof Date ? date.toISOString() : date
        )
      })),
      groups: excursionProduct.groups?.map(group => ({
        ...group,
        date: group.date instanceof Date ? group.date.toISOString() : group.date
      }))
    };

    console.log("API: Товар экскурсии найден, отправляем ответ");
    return NextResponse.json(formattedProduct);
  } catch (error: any) {
    console.error("API: Ошибка при получении товара экскурсии:", error);
    return NextResponse.json(
      { error: error.message || "Не удалось получить товар экскурсии" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  console.log("API: Получен запрос на обновление товара экскурсии с ID:", id);

  try {
    await dbConnect();
    console.log("API: Подключение к базе данных успешно");

    const data = await request.json();
    console.log("API: Получены данные для обновления:", JSON.stringify(data, null, 2));

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

    const updatedProduct = await ExcursionProduct.findByIdAndUpdate(
      id,
      { ...data, images },
      { new: true }
    ).populate('excursionCard', 'title description images');

    if (!updatedProduct) {
      console.log("API: Товар экскурсии не найден");
      return NextResponse.json(
        { error: "Товар экскурсии не найден" },
        { status: 404 }
      );
    }

    console.log("API: Товар экскурсии успешно обновлен");
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("API: Ошибка при обновлении товара экскурсии:", error);
    return NextResponse.json(
      { error: error.message || "Не удалось обновить товар экскурсии" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  console.log("API: Получен запрос на удаление товара экскурсии с ID:", id);

  try {
    await dbConnect();
    console.log("API: Подключение к базе данных успешно");

    const deletedProduct = await ExcursionProduct.findByIdAndDelete(id);

    if (!deletedProduct) {
      console.log("API: Товар экскурсии не найден");
      return NextResponse.json(
        { error: "Товар экскурсии не найден" },
        { status: 404 }
      );
    }

    console.log("API: Товар экскурсии успешно удален");
    return NextResponse.json({ message: "Товар экскурсии успешно удален" });
  } catch (error: any) {
    console.error("API: Ошибка при удалении товара экскурсии:", error);
    return NextResponse.json(
      { error: error.message || "Не удалось удалить товар экскурсии" },
      { status: 500 }
    );
  }
} 