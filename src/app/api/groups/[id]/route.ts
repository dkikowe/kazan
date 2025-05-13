import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Group } from "@/models/Group";
import { Tourist } from "@/models/Tourist";
import { IExcursionProduct } from "@/models/ExcursionProduct";
import mongoose from "mongoose";

// GET /api/groups/[id]
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;

  try {
    await dbConnect();
    const group = await Group.findById(params.id)
      .populate({
        path: 'excursion',
        populate: {
          path: 'excursionProduct',
          select: 'tickets title'
        }
      });
    
    if (!group) {
      return NextResponse.json(
        { error: "Группа не найдена" },
        { status: 404 }
      );
    }

    // Получаем билеты из товара экскурсии
    if (group.excursion?.excursionProduct) {
      const excursionProduct = await mongoose.model<IExcursionProduct>('ExcursionProduct').findById(group.excursion.excursionProduct._id);
      if (excursionProduct) {
        group.excursion.excursionProduct.tickets = excursionProduct.tickets;
      }
    }

    console.log("Данные группы:", JSON.stringify(group, null, 2));
    return NextResponse.json(group);
  } catch (error) {
    console.error("Ошибка при получении группы:", error);
    return NextResponse.json(
      { error: "Ошибка при получении группы" },
      { status: 500 }
    );
  }
}

// PUT /api/groups/[id]
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;

  try {
    await dbConnect();
    const body = await request.json();
    
    const group = await Group.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('excursion', 'title');
    
    if (!group) {
      return NextResponse.json(
        { error: "Группа не найдена" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(group);
  } catch (error) {
    console.error("Ошибка при обновлении группы:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении группы" },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id]
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;

  try {
    await dbConnect();
    
    // Удаляем всех туристов группы
    await Tourist.deleteMany({ group: params.id });
    
    // Удаляем группу
    const group = await Group.findByIdAndDelete(params.id);
    
    if (!group) {
      return NextResponse.json(
        { error: "Группа не найдена" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении группы:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении группы" },
      { status: 500 }
    );
  }
} 