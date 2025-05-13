import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ExcursionCard from "@/models/ExcursionCard";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const urlParts = request.url.split("/");
    const id = urlParts[urlParts.length - 2];

    if (!id) {
      return NextResponse.json(
        { error: "Не указан ID экскурсии" },
        { status: 400 }
      );
    }

    const { images } = await request.json();

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: "Неверный формат данных" },
        { status: 400 }
      );
    }

    await dbConnect();
    const result = await ExcursionCard.findByIdAndUpdate(
      id,
      { $set: { images } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ошибка при обновлении изображений:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении изображений" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const urlParts = request.url.split("/");
    const imageUrl = urlParts.pop();
    const id = urlParts[urlParts.length - 2];

    if (!id || !imageUrl) {
      return NextResponse.json(
        { error: "Не указан ID экскурсии или URL изображения" },
        { status: 400 }
      );
    }

    await dbConnect();
    const result = await ExcursionCard.findByIdAndUpdate(
      id,
      { $pull: { images: imageUrl } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Экскурсия не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ошибка при удалении изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении изображения" },
      { status: 500 }
    );
  }
} 