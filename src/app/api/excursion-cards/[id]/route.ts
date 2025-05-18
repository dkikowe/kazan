import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ExcursionCard from "@/models/ExcursionCard";
import ExcursionProduct from "@/models/ExcursionProduct";
import Tag from "@/models/Tag";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("Начало обработки запроса на получение карточки экскурсии");
  console.log("ID карточки:", params.id);

  try {
    // Проверяем валидность ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.log("Невалидный ID карточки");
      return NextResponse.json(
        { error: "Невалидный ID карточки" },
        { status: 400 }
      );
    }

    // Подключаемся к базе данных
    await connectToDatabase();
    console.log("Подключение к базе данных успешно");

    // Получаем карточку экскурсии
    const card = await ExcursionCard.findById(params.id)
      .populate({
        path: "excursionProduct",
        select: "_id title startTimes tickets addressMeeting",
      })
      .lean();

    console.log("Результат поиска карточки:", card ? "Карточка найдена" : "Карточка не найдена");

    if (!card) {
      console.log("Карточка не найдена");
      return NextResponse.json(
        { error: "Карточка экскурсии не найдена" },
        { status: 404 }
      );
    }

    // Проверяем статус публикации
    if (!card.isPublished) {
      console.log("Карточка не опубликована");
      return NextResponse.json(
        { error: "Карточка не опубликована" },
        { status: 403 }
      );
    }

    console.log("Отправляем ответ с данными карточки");
    return NextResponse.json(card);
  } catch (error) {
    console.error("Ошибка при получении карточки:", error);
    return NextResponse.json(
      { error: "Ошибка при получении карточки" },
      { status: 500 }
    );
  }
} 