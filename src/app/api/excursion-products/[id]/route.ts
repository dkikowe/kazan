import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ExcursionProduct } from "@/models/excursion-product";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const product = await ExcursionProduct.findById(params.id).populate(
      "excursionCard"
    );

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching excursion product:", error);
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
  try {
    await connectToDatabase();
    const data = await request.json();

    // Преобразуем даты из строк в объекты Date
    const formattedData = {
      ...data,
      dateRanges: data.dateRanges.map((range: any) => ({
        start: new Date(range.start),
        end: new Date(range.end),
      })),
    };

    const product = await ExcursionProduct.findByIdAndUpdate(
      params.id,
      {
        $set: {
          tickets: formattedData.tickets,
          dateRanges: formattedData.dateRanges,
          meetingPoints: formattedData.meetingPoints,
          paymentOptions: formattedData.paymentOptions,
          groups: formattedData.groups,
          isPublished: formattedData.isPublished,
        },
      },
      { new: true }
    ).populate("excursionCard");

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating excursion product:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении товара" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const product = await ExcursionProduct.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Товар успешно удален" });
  } catch (error) {
    console.error("Error deleting excursion product:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении товара" },
      { status: 500 }
    );
  }
} 