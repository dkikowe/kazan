import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FilterItem from '@/models/FilterItem';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/filter-items
export async function GET() {
  try {
    await connectDB();
    const filterItems = await FilterItem.find().sort({ sortOrder: 1 });
    return NextResponse.json(filterItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении элементов фильтров' },
      { status: 500 }
    );
  }
}

// POST /api/filter-items
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const filterItem = await FilterItem.create(data);
    return NextResponse.json(filterItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при создании элемента фильтра' },
      { status: 400 }
    );
  }
} 