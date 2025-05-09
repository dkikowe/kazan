import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import mongoose from "mongoose";
import ExcursionCard from "@/models/ExcursionCard";
import ExcursionProduct from "@/models/ExcursionProduct";

// Интерфейс для данных заявки
interface BookingData {
  fullName: string;
  phone: string;
  paymentType: string;
  status: string;
  excursionId?: string;
  date?: string;
  time?: string;
  comment?: string;
  tickets?: Array<{type: string; count: number}>;
  ticketType?: string;
  ticketCount?: number;
  [key: string]: any; // Разрешить дополнительные поля
}

// Интерфейс для типизации результата запроса экскурсии
interface ExcursionCardInfo {
  _id: string;
  title: string;
  excursionProduct?: {
    _id: string;
    title?: string;
  };
  [key: string]: any;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = status && status !== "all" ? { status } : {};
    mongoose.set('strictPopulate', false);
    
    const bookings = await Booking.find(query)
      .populate({
        path: 'excursionId',
        select: 'title',
        model: 'ExcursionCard'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заявок" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Проверяем только самые основные поля
    if (!data.fullName || !data.phone) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля: имя и телефон" },
        { status: 400 }
      );
    }

    // Создаем базовый объект данных для заявки
    const bookingData: BookingData = {
      fullName: data.fullName,
      phone: data.phone,
      paymentType: data.paymentType || "full",
      status: "new",
    };

    // Добавляем остальные поля, только если они переданы
    if (data.excursionId) {
      bookingData.excursionId = data.excursionId;
    }

    if (data.date) {
      bookingData.date = data.date;
    }

    if (data.time) {
      bookingData.time = data.time;
    }

    if (data.comment) {
      bookingData.comment = data.comment;
    }

    // Обрабатываем билеты
    if (Array.isArray(data.tickets) && data.tickets.length > 0) {
      bookingData.tickets = data.tickets;
    } else if (data.ticketType) {
      // Поддержка старого формата
      bookingData.ticketType = data.ticketType;
      bookingData.ticketCount = data.ticketCount || 1;
    }

    // Создаем запись в базе данных с минимальной валидацией
    const booking = await Booking.create(bookingData);

    // Формируем данные для email уведомления
    let emailBody = `
      Новая заявка:
      ФИО: ${data.fullName}
      Телефон: ${data.phone}
    `;

    // Получаем информацию об экскурсии, если есть
    if (data.excursionId) {
      try {
        const excursion = await ExcursionCard.findById(data.excursionId).lean();
        if (excursion && typeof excursion === 'object') {
          // Используем any для обхода проблем с типизацией mongoose
          const excursionAny = excursion as any;
          emailBody += `\nЭкскурсия: ${excursionAny.title || 'Экскурсия ' + data.excursionId}\n`;
        }
      } catch (err) {
        console.warn("Не удалось получить данные экскурсии:", err);
      }
    }

    // Добавляем информацию о билетах в письмо
    if (Array.isArray(data.tickets) && data.tickets.length > 0) {
      emailBody += "\nБилеты:\n";
      data.tickets.forEach((ticket: {type: string; count: number}) => {
        const ticketType = 
          ticket.type === 'adult' ? 'Взрослый' : 
          ticket.type === 'child' ? 'Детский' : 
          ticket.type === 'pensioner' ? 'Пенсионный' : ticket.type;
        emailBody += `${ticketType}: ${ticket.count} шт.\n`;
      });
    } else if (data.ticketType) {
      const ticketType = 
        data.ticketType === 'adult' ? 'Взрослый' : 
        data.ticketType === 'child' ? 'Детский' : 
        data.ticketType === 'pensioner' ? 'Пенсионный' : data.ticketType;
      emailBody += `\nБилет: ${ticketType}, ${data.ticketCount || 1} шт.\n`;
    }

    // Добавляем остальные данные
    emailBody += `
      Тип оплаты: ${data.paymentType === 'full' ? 'Полная оплата' : 
                    data.paymentType === 'prepayment' ? 'Предоплата' : 
                    data.paymentType === 'onsite' ? 'На месте' : data.paymentType || 'Не указан'}
      Дата: ${data.date || 'Не указана'}
      Время: ${data.time || 'Не указано'}
      Комментарий: ${data.comment || 'Нет комментария'}
    `;

    // Пытаемся отправить уведомление на email
    try {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.default.createTransport({
        service: "gmail",
        auth: {
          user: "dkikowe@gmail.com",
          pass: "ewqheweyshubgrth"
        },
      });

      await transporter.sendMail({
        from: '"Сайт" <dkikowe@gmail.com>',
        to: "kzn.land@yandex.ru",
        subject: "Новая заявка с сайта",
        text: emailBody,
      });
    } catch (emailError) {
      console.error("Ошибка отправки email-уведомления:", emailError);
      // Не возвращаем ошибку клиенту, т.к. заявка уже создана
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заявки", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 