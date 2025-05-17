import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import mongoose from "mongoose";
import ExcursionCard from "@/models/ExcursionCard";
import ExcursionProduct from "@/models/ExcursionProduct";
import nodemailer from "nodemailer";

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
  promoCode?: string;
  [key: string]: any;
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

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = {};
    if (status && status !== "all") {
      query = { status };
    }

    const bookings = await Booking.find(query)
      .populate("excursionId", "title")
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

    if (data.promoCode) {
      bookingData.promoCode = data.promoCode;
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

    // Добавляем информацию о билетах
    if (data.tickets && data.tickets.length > 0) {
      emailBody += "\nБилеты:\n";
      data.tickets.forEach((ticket: any) => {
        const ticketType = ticket.type === "adult" ? "Взрослый" :
                         ticket.type === "child" ? "Детский" :
                         ticket.type === "pensioner" ? "Пенсионный" :
                         ticket.type === "childUnder7" ? "Детский до 7 лет" : ticket.type;
        emailBody += `${ticketType}: ${ticket.count} шт.\n`;
      });
    }

    // Добавляем остальные данные
    emailBody += `
      Время: ${data.time || 'Не указано'}
      Промокод: ${data.promoCode || 'Не указан'}
    `;

    // Отправляем уведомление на email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "Новая заявка на бронирование",
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