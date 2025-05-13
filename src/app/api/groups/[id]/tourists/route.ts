import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Group } from "@/models/Group";
import { Tourist } from "@/models/Tourist";
import { IExcursionProduct } from "@/models/ExcursionProduct";
import mongoose from "mongoose";

interface Ticket {
  type: string;
  count: number;
}

// GET /api/groups/[id]/tourists
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;

  try {
    await dbConnect();
    const group = await Group.findById(params.id);
    
    if (!group) {
      return NextResponse.json(
        { error: "Группа не найдена" },
        { status: 404 }
      );
    }
    
    const tourists = await Tourist.find({ group: params.id }).sort({ createdAt: -1 });
    return NextResponse.json(tourists);
  } catch (error) {
    console.error("Ошибка при получении туристов:", error);
    return NextResponse.json(
      { error: "Ошибка при получении туристов" },
      { status: 500 }
    );
  }
}

// POST /api/groups/[id]/tourists
export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const groupId = context.params.id;

  try {
    await dbConnect();
    const body = await request.json();
    console.log("Полученные данные:", body);

    // Проверка обязательных полей
    if (!body.name) {
      return NextResponse.json(
        { error: "Имя туриста обязательно" },
        { status: 400 }
      );
    }

    if (!body.tickets || body.tickets.length === 0) {
      return NextResponse.json(
        { error: "Необходимо выбрать хотя бы один билет" },
        { status: 400 }
      );
    }

    const group = await Group.findById(groupId)
      .populate({
        path: 'excursion',
        populate: {
          path: 'excursionProduct',
          select: 'tickets'
        }
      });
    
    if (!group) {
      return NextResponse.json(
        { error: "Группа не найдена" },
        { status: 404 }
      );
    }

    // Получаем билеты из товара экскурсии
    const excursionProduct = await mongoose.model<IExcursionProduct>('ExcursionProduct').findById(group.excursion?.excursionProduct?._id);
    if (!excursionProduct) {
      return NextResponse.json(
        { error: "Товар экскурсии не найден" },
        { status: 404 }
      );
    }

    // Проверяем, что все указанные типы билетов существуют в товаре экскурсии
    const ticketTypes = excursionProduct.tickets.map((t) => t.type);
    console.log("Доступные типы билетов:", ticketTypes);
    console.log("Полученные билеты:", body.tickets);

    const invalidTickets = body.tickets.filter((t: Ticket) => !ticketTypes.includes(t.type));
    
    if (invalidTickets.length > 0) {
      return NextResponse.json(
        { error: "Указаны несуществующие типы билетов" },
        { status: 400 }
      );
    }
    
    // Подсчитываем общее количество билетов
    const totalTickets = body.tickets.reduce((sum: number, ticket: Ticket) => sum + ticket.count, 0);
    
    // Проверка свободных мест
    if (group.bookedSeats + totalTickets > group.totalSeats) {
      return NextResponse.json(
        { error: "Недостаточно свободных мест" },
        { status: 400 }
      );
    }
    
    // Создаем туриста
    const tourist = new Tourist({
      name: body.name,
      phone: body.phone,
      tickets: body.tickets,
      group: groupId,
      notes: body.notes
    });
    
    await tourist.save();
    
    // Обновляем количество забронированных мест
    await Group.findByIdAndUpdate(groupId, {
      $inc: { bookedSeats: totalTickets }
    });
    
    return NextResponse.json(tourist);
  } catch (error) {
    console.error("Ошибка при добавлении туриста:", error);
    return NextResponse.json(
      { error: "Ошибка при добавлении туриста" },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id]/tourists
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { searchParams } = new URL(request.url);
  const touristId = searchParams.get('touristId');
  
  if (!touristId) {
    return NextResponse.json(
      { error: "Не указан ID туриста" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const group = await Group.findById(params.id);
    
    if (!group) {
      return NextResponse.json(
        { error: "Группа не найдена" },
        { status: 404 }
      );
    }
    
    const tourist = await Tourist.findById(touristId);
    
    if (!tourist) {
      return NextResponse.json(
        { error: "Турист не найден" },
        { status: 404 }
      );
    }
    
    // Подсчитываем общее количество билетов туриста
    const totalTickets = tourist.tickets.reduce((sum: number, ticket: { count: number }) => sum + ticket.count, 0);
    
    // Удаляем туриста
    await Tourist.findByIdAndDelete(touristId);
    
    // Обновляем количество забронированных мест
    await Group.findByIdAndUpdate(params.id, {
      $inc: { bookedSeats: -totalTickets }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении туриста:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении туриста" },
      { status: 500 }
    );
  }
} 