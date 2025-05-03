import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FilterGroup from '@/models/FilterGroup';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/filter-groups/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const filterGroup = await FilterGroup.findById(params.id);
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
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const filterGroup = await FilterGroup.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
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
      { status: 400 }
    );
  }
}

// DELETE /api/filter-groups/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const filterGroup = await FilterGroup.findByIdAndDelete(params.id);
    if (!filterGroup) {
      return NextResponse.json(
        { error: 'Группа фильтров не найдена' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Группа фильтров удалена' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении группы фильтров' },
      { status: 500 }
    );
  }
} 