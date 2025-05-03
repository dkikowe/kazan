import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import models from '@/lib/models';

// Сначала импортируем базовые модели
import Category from '@/models/Category';
import Tag from '@/models/Tag';

// Затем импортируем модели, которые зависят от базовых
import ExcursionCard from '@/models/ExcursionCard';
import CommercialExcursion from '@/models/CommercialExcursion';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/excursions
export async function GET() {
  try {
    await connectDB();
    const excursions = await models.ExcursionCard.find()
      .populate('tags')
      .populate('categories')
      .sort({ createdAt: -1 });
    return NextResponse.json(excursions);
  } catch (error) {
    console.error('Error fetching excursions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch excursions' },
      { status: 500 }
    );
  }
}

// POST /api/excursions
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Создаем карточку экскурсии
    const excursionCard = await models.ExcursionCard.create(data.card);

    // Если есть коммерческие данные, создаем их
    if (data.commercial) {
      await models.CommercialExcursion.create({
        ...data.commercial,
        commercialSlug: excursionCard.commercialSlug,
      });
    }

    return NextResponse.json(excursionCard, { status: 201 });
  } catch (error: any) {
    console.error('Error creating excursion:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create excursion' },
      { status: 400 }
    );
  }
} 