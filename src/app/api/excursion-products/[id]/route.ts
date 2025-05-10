import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ExcursionProduct from "@/models/ExcursionProduct";
import ExcursionCard from "@/models/ExcursionCard";
import mongoose from "mongoose";
// Импортируем связанные модели для регистрации в Mongoose
import Tag from "@/models/Tag";
import FilterItem from "@/models/FilterItem";
import FilterGroup from "@/models/FilterGroup";
// Регистрируем модель Excursion в mongoose
// @ts-ignore: игнорируем ошибку для этого импорта
import excursionModel from "../../../models/Excursion";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    console.log(`Запрос информации о товаре с ID: ${id}`);
    await connectToDatabase();
    const product = await ExcursionProduct.findById(id);
    
    if (!product) {
      console.error(`Товар с ID ${id} не найден`);
      return NextResponse.json(
        { error: `Товар с ID ${id} не найден` },
        { status: 404 }
      );
    }

    console.log(`Информация о товаре ${id} успешно получена`);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Ошибка при получении информации о товаре:", error);
    return NextResponse.json(
      { error: "Не удалось получить информацию о товаре" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    console.log(`Обновление товара с ID: ${id}`);
    
    const data = await request.json();
    console.log("Полученные данные для обновления:", JSON.stringify(data, null, 2));
    
    await connectToDatabase();
    
    // Проверяем существование товара перед обновлением
    const existingProduct = await ExcursionProduct.findById(id);
    if (!existingProduct) {
      console.error(`Товар с ID ${id} не найден`);
      return NextResponse.json(
        { message: `Товар с ID ${id} не найден` },
        { status: 404 }
      );
    }

    // Подготавливаем данные для обновления
    const updateData = { ...data };
    
    // Если excursionCard пустая строка, заменяем на null
    if (updateData.excursionCard === "") {
      updateData.excursionCard = null;
    }

    console.log("Подготовленные данные для обновления:", JSON.stringify(updateData, null, 2));
    
    const updatedProduct = await ExcursionProduct.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    
    if (!updatedProduct) {
      console.error(`Не удалось обновить товар с ID ${id}`);
      return NextResponse.json(
        { message: "Не удалось обновить товар" },
        { status: 500 }
      );
    }

    console.log(`Товар ${id} успешно обновлен:`, JSON.stringify(updatedProduct, null, 2));
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Ошибка при обновлении товара:", error);
    return NextResponse.json(
      { message: error.message || "Не удалось обновить товар" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    console.log(`Запрос на удаление товара с ID: ${id}`);
    await connectToDatabase();
    
    // Проверяем существование товара перед удалением
    const existingProduct = await ExcursionProduct.findById(id);
    if (!existingProduct) {
      console.error(`Товар с ID ${id} не найден`);
      return NextResponse.json(
        { error: `Товар с ID ${id} не найден` },
        { status: 404 }
      );
    }
    
    console.log(`Найден товар для удаления: ${existingProduct._id} - экскурсия: ${existingProduct.excursionCard}`);

    // Проверяем, есть ли связанные сущности
    try {
      // Здесь можно добавить проверку на связанные бронирования и т.д.
      // Например: const bookings = await Booking.find({ product: id });
      // if (bookings.length > 0) { throw new Error('Невозможно удалить товар с бронированиями'); }
    } catch (err) {
      console.error("Ошибка при проверке связанных сущностей:", err);
      return NextResponse.json(
        { error: "Ошибка при проверке связанных с товаром данных" },
        { status: 500 }
      );
    }

    const product = await ExcursionProduct.findByIdAndDelete(id);
    
    if (!product) {
      console.error(`Не удалось удалить товар с ID ${id}`);
      return NextResponse.json(
        { error: "Не удалось удалить товар" },
        { status: 500 }
      );
    }

    console.log(`Товар с ID ${id} успешно удален`);
    return NextResponse.json({ 
      message: "Товар успешно удален",
      deletedProduct: product 
    });
  } catch (error: any) {
    console.error("Ошибка при удалении товара:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при удалении товара" },
      { status: 500 }
    );
  }
} 