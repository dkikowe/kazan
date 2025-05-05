import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const booking = await Booking.findById(context.params.id);

    if (!booking) {
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Ошибка при получении заявки:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заявки" },
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
    const booking = await Booking.findByIdAndUpdate(
      context.params.id,
      data,
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Ошибка при обновлении заявки:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении заявки" },
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
    const booking = await Booking.findByIdAndDelete(context.params.id);

    if (!booking) {
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Заявка успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении заявки" },
      { status: 500 }
    );
  }
} 