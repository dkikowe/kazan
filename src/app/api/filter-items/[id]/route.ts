import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FilterItem from '@/models/FilterItem';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/filter-items/[id]
export async function GET(request: Request) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Неверный ID фильтра' },
        { status: 400 }
      );
    }

    await connectDB();
    const filterItem = await FilterItem.findById(id);

    if (!filterItem) {
      return NextResponse.json(
        { error: 'Фильтр не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(filterItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении фильтра' },
      { status: 500 }
    );
  }
}

// PUT /api/filter-items/[id]
export async function PUT(request: Request) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Неверный ID фильтра' },
        { status: 400 }
      );
    }

    const data = await request.json();
    await connectDB();
    const filterItem = await FilterItem.findByIdAndUpdate(id, data, { new: true });

    if (!filterItem) {
      return NextResponse.json(
        { error: 'Фильтр не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(filterItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении фильтра' },
      { status: 500 }
    );
  }
}

// DELETE /api/filter-items/[id]
export async function DELETE(request: Request) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Неверный ID фильтра' },
        { status: 400 }
      );
    }

    await connectDB();
    const filterItem = await FilterItem.findByIdAndDelete(id);

    if (!filterItem) {
      return NextResponse.json(
        { error: 'Фильтр не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении фильтра' },
      { status: 500 }
    );
  }
} 