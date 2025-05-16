import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FilterGroup from '@/models/FilterGroup';
import FilterItem from '@/models/FilterItem';
import { FilterGroup as FilterGroupType } from '@/features/catalog/api/types';
import Tag from '@/models/Tag';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

export async function GET() {
  try {
    await connectDB();
    console.log("API: Получение фильтров - начало");

    // Получаем группы фильтров
    const groups = await FilterGroup.find({ isVisible: true }).sort({ sortOrder: 1 });
    console.log(`API: Найдено ${groups.length} групп фильтров`);

    // Получаем элементы фильтров
    const items = await FilterItem.find({ isActive: true }).sort({ sortOrder: 1 });
    console.log(`API: Найдено ${items.length} элементов фильтров`);

    // Получаем все теги для добавления в фильтры
    const tags = await Tag.find({ isActive: true }).sort({ sortOrder: 1 });
    console.log(`API: Найдено ${tags.length} тегов`);

    // Добавляем группу тегов, если их нет в имеющихся группах
    let tagGroup = groups.find(group => group.name === 'Теги');
    let tagItems = [];

    if (!tagGroup) {
      console.log("API: Создаём виртуальную группу 'Теги'");
      // Создаём виртуальную группу для тегов
      tagGroup = {
        _id: 'tags',
        name: 'Теги',
        slug: 'tags',
        sortOrder: groups.length + 1,
        isVisible: true
      };
    }

    // Трансформируем теги в элементы фильтров
    tagItems = tags.map(tag => ({
      _id: tag._id.toString(),
      name: tag.name,
      group: tagGroup._id.toString(),
      sortOrder: tag.sortOrder || 0,
      isActive: true
    }));

    // Формируем структуру данных для фронтенда
    const filters: FilterGroupType[] = groups.map((group) => {
      const groupId = group._id.toString();
      const groupItems = items
        .filter((item) => item.group.toString() === groupId)
        .map((item) => ({
          id: item._id.toString(),
          title: item.name,
          count: 0, // TODO: Добавить подсчет количества элементов
        }));
        
      return {
        id: groupId,
        title: group.name,
        options: groupItems,
      };
    });
    
    // Добавляем группу тегов, если их нет в группах
    if (tagGroup._id === 'tags' || !filters.some(f => f.title === 'Теги')) {
      console.log("API: Добавляем группу тегов в ответ");
      filters.push({
        id: tagGroup._id.toString(),
        title: tagGroup.name,
        options: tags.map(tag => ({
          id: tag._id.toString(),
          title: tag.name,
          count: 0, // TODO: Добавить подсчет
        })),
      });
    }

    console.log(`API: Сформировано ${filters.length} групп фильтров для отправки`);
    return NextResponse.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
} 