import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Category from '@/models/Category';
import dbConnect from '../../../lib/dbConnect';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ tagSort: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении категорий' },
      { status: 500 }
    );
  }
}

// POST /api/categories
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

    const category = await Category.create(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при создании категории:', error);
    
    // Обработка ошибки дублирования slug
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Категория с таким slug уже существует' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при создании категории' },
      { status: 500 }
    );
  }
} 