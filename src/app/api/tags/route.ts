import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tag from '@/models/Tag';
import dbConnect from '../../../lib/dbConnect';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/tags
export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find({ isActive: true }).sort({ sortOrder: 1 });
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении тегов' },
      { status: 500 }
    );
  }
}

// POST /api/tags
export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Проверяем обязательные поля
    if (!data.name) {
      return NextResponse.json(
        { error: 'Название обязательно' },
        { status: 400 }
      );
    }

    // Создаем slug из названия, если он не указан
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Устанавливаем значения по умолчанию
    const tagData = {
      name: data.name,
      slug: data.slug,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription
    };

    const tag = await Tag.create(tagData);
    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при создании тега:', error);
    
    // Обработка ошибки дублирования slug
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Тег с таким slug уже существует' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при создании тега' },
      { status: 500 }
    );
  }
} 