import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FilterGroup from '@/models/FilterGroup';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/filter-groups/[id]
export async function GET(request: Request) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Неверный ID группы фильтров' },
        { status: 400 }
      );
    }

    await connectDB();
    const filterGroup = await FilterGroup.findById(id);

    if (!filterGroup) {
      return NextResponse.json(
        { error: 'Группа фильтров не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(filterGroup);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении группы фильтров' },
      { status: 500 }
    );
  }
}

// PUT /api/filter-groups/[id]
export async function PUT(request: Request) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Неверный ID группы фильтров' },
        { status: 400 }
      );
    }

    const data = await request.json();
    await connectDB();
    const filterGroup = await FilterGroup.findByIdAndUpdate(id, data, { new: true });

    if (!filterGroup) {
      return NextResponse.json(
        { error: 'Группа фильтров не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(filterGroup);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении группы фильтров' },
      { status: 500 }
    );
  }
}

// DELETE /api/filter-groups/[id]
export async function DELETE(request: Request) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Неверный ID группы фильтров' },
        { status: 400 }
      );
    }

    await connectDB();
    const filterGroup = await FilterGroup.findByIdAndDelete(id);

    if (!filterGroup) {
      return NextResponse.json(
        { error: 'Группа фильтров не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении группы фильтров' },
      { status: 500 }
    );
  }
} 