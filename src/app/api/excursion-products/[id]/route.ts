import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ExcursionProduct from "@/models/ExcursionProduct";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const product = await ExcursionProduct.findById(context.params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

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
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const data = await request.json();

    // Преобразуем строковые даты в объекты Date
    if (data.dateRanges) {
      data.dateRanges = data.dateRanges.map((range: any) => ({
        ...range,
        startDate: new Date(range.startDate),
        endDate: new Date(range.endDate)
      }));
    }

    if (data.groups) {
      data.groups = data.groups.map((group: any) => ({
        ...group,
        date: new Date(group.date)
      }));
    }

    const product = await ExcursionProduct.findByIdAndUpdate(
      context.params.id,
      data,
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении товара" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const product = await ExcursionProduct.findByIdAndDelete(context.params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Товар успешно удален" });
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении товара" },
      { status: 500 }
    );
  }
} 