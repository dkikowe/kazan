import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FilterGroup from '@/models/FilterGroup';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/filter-groups
export async function GET() {
  try {
    await connectDB();
    const filterGroups = await FilterGroup.find().sort({ sortOrder: 1 });
    return NextResponse.json(filterGroups);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении групп фильтров' },
      { status: 500 }
    );
  }
}

// POST /api/filter-groups
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const filterGroup = await FilterGroup.create(data);
    return NextResponse.json(filterGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при создании группы фильтров' },
      { status: 400 }
    );
  }
} 