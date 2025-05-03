import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FilterItem from '@/models/FilterItem';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/filter-items/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const filterItem = await FilterItem.findById(params.id);
    if (!filterItem) {
      return NextResponse.json(
        { error: 'Элемент фильтра не найден' },
        { status: 404 }
      );
    }
    return NextResponse.json(filterItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении элемента фильтра' },
      { status: 500 }
    );
  }
}

// PUT /api/filter-items/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const filterItem = await FilterItem.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!filterItem) {
      return NextResponse.json(
        { error: 'Элемент фильтра не найден' },
        { status: 404 }
      );
    }
    return NextResponse.json(filterItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении элемента фильтра' },
      { status: 400 }
    );
  }
}

// DELETE /api/filter-items/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const filterItem = await FilterItem.findByIdAndDelete(params.id);
    if (!filterItem) {
      return NextResponse.json(
        { error: 'Элемент фильтра не найден' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Элемент фильтра удален' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении элемента фильтра' },
      { status: 500 }
    );
  }
} 