import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tag from '@/models/Tag';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/tags/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const tag = await Tag.findById(params.id);
    if (!tag) {
      return NextResponse.json(
        { error: 'Тег не найден' },
        { status: 404 }
      );
    }
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении тега' },
      { status: 500 }
    );
  }
}

// PUT /api/tags/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const tag = await Tag.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!tag) {
      return NextResponse.json(
        { error: 'Тег не найден' },
        { status: 404 }
      );
    }
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении тега' },
      { status: 400 }
    );
  }
}

// DELETE /api/tags/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const tag = await Tag.findByIdAndDelete(params.id);
    if (!tag) {
      return NextResponse.json(
        { error: 'Тег не найден' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Тег удален' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении тега' },
      { status: 500 }
    );
  }
} 