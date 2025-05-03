import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FilterGroup from '@/models/FilterGroup';
import FilterItem from '@/models/FilterItem';
import { FilterGroup as FilterGroupType } from '@/features/catalog/api/types';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

export async function GET() {
  try {
    await connectDB();

    // Получаем группы фильтров
    const groups = await FilterGroup.find({ isVisible: true }).sort({ sortOrder: 1 });

    // Получаем элементы фильтров
    const items = await FilterItem.find({ isActive: true }).sort({ sortOrder: 1 });

    // Формируем структуру данных для фронтенда
    const filters: FilterGroupType[] = groups.map((group) => ({
      id: group._id.toString(),
      title: group.name,
      options: items
        .filter((item) => item.group.toString() === group._id.toString())
        .map((item) => ({
          id: item._id.toString(),
          title: item.name,
          count: 0, // TODO: Добавить подсчет количества элементов
        })),
    }));

    return NextResponse.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
} 