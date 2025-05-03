import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ExcursionCard from '@/models/ExcursionCard';
import CommercialExcursion from '@/models/CommercialExcursion';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://dkikowe:dkikowe@project.0g2vn.mongodb.net/vostokargo');
};

// GET /api/excursions/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const excursion = await ExcursionCard.findById(params.id)
      .populate('tags')
      .populate('categories');

    if (!excursion) {
      return NextResponse.json(
        { error: 'Excursion not found' },
        { status: 404 }
      );
    }

    // Получаем коммерческие данные
    const commercial = await CommercialExcursion.findOne({
      commercialSlug: excursion.commercialSlug,
    });

    return NextResponse.json({ card: excursion, commercial });
  } catch (error) {
    console.error('Error fetching excursion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch excursion' },
      { status: 500 }
    );
  }
}

// PUT /api/excursions/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();

    // Обновляем карточку экскурсии
    const excursion = await ExcursionCard.findByIdAndUpdate(
      params.id,
      data.card,
      { new: true }
    ).populate('tags').populate('categories');

    if (!excursion) {
      return NextResponse.json(
        { error: 'Excursion not found' },
        { status: 404 }
      );
    }

    // Обновляем коммерческие данные
    if (data.commercial) {
      await CommercialExcursion.findOneAndUpdate(
        { commercialSlug: excursion.commercialSlug },
        data.commercial,
        { new: true }
      );
    }

    return NextResponse.json(excursion);
  } catch (error: any) {
    console.error('Error updating excursion:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update excursion' },
      { status: 400 }
    );
  }
}

// DELETE /api/excursions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const excursion = await ExcursionCard.findById(params.id);

    if (!excursion) {
      return NextResponse.json(
        { error: 'Excursion not found' },
        { status: 404 }
      );
    }

    // Удаляем коммерческие данные
    await CommercialExcursion.findOneAndDelete({
      commercialSlug: excursion.commercialSlug,
    });

    // Удаляем карточку экскурсии
    await excursion.deleteOne();

    return NextResponse.json({ message: 'Excursion deleted successfully' });
  } catch (error) {
    console.error('Error deleting excursion:', error);
    return NextResponse.json(
      { error: 'Failed to delete excursion' },
      { status: 500 }
    );
  }
} 