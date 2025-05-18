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
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("Начало обработки запроса на получение товара экскурсии");
  console.log("ID товара:", params.id);

  try {
    // Проверяем валидность ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.log("Невалидный ID товара");
      return NextResponse.json(
        { error: "Невалидный ID товара" },
        { status: 400 }
      );
    }

    // Подключаемся к базе данных
    await connectToDatabase();
    console.log("Подключение к базе данных успешно");

    // Получаем товар экскурсии
    const product = await ExcursionProduct.findById(params.id)
      .populate({
        path: "excursionCard",
        select: "title description images duration addressMeeting placeMeeting whatYouWillSee",
      })
      .lean();

    console.log("Результат поиска товара:", product ? "Товар найден" : "Товар не найден");

    if (!product) {
      console.log("Товар не найден");
      return NextResponse.json(
        { error: "Товар экскурсии не найден" },
        { status: 404 }
      );
    }

    // Проверяем статус публикации
    if (!product.isPublished) {
      console.log("Товар не опубликован");
      return NextResponse.json(
        { error: "Товар не опубликован" },
        { status: 403 }
      );
    }

    console.log("Отправляем ответ с данными товара");
    return NextResponse.json(product);
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    return NextResponse.json(
      { error: "Ошибка при получении товара" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("API: Получен запрос на обновление товара экскурсии с ID:", params.id);

  try {
    await dbConnect();
    console.log("API: Подключение к базе данных успешно");

    const data = await request.json();
    console.log("API: Получены данные для обновления:", JSON.stringify(data, null, 2));

    // Проверяем и обрабатываем изображения
    let images: string[] = [];
    if (data.images && Array.isArray(data.images)) {
      console.log("API: Обработка изображений из поля images");
      const uniqueUrls = Array.from(new Set<string>(data.images));
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
      console.log("API: Обработка изображений из поля gallery");
      const uniqueUrls = Array.from(new Set<string>(data.gallery));
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
      params.id,
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
  { params }: { params: { id: string } }
) {
  console.log("API: Получен запрос на удаление товара экскурсии с ID:", params.id);

  try {
    await dbConnect();
    console.log("API: Подключение к базе данных успешно");

    const deletedProduct = await ExcursionProduct.findByIdAndDelete(params.id);

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