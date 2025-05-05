"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { IBooking } from "@/models/Booking";

const statusLabels = {
  new: "Новая",
  processed: "Обработана",
  archived: "В архиве",
  deleted: "Удалена",
};

const statusColors = {
  new: "bg-blue-500",
  processed: "bg-green-500",
  archived: "bg-gray-500",
  deleted: "bg-red-500",
};

const ticketTypeLabels = {
  adult: "Взрослый",
  child: "Детский",
  pensioner: "Пенсионный",
};

const paymentTypeLabels = {
  full: "Полная",
  prepayment: "Предоплата",
  onsite: "На месте",
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      const url = statusFilter
        ? `/api/bookings?status=${statusFilter}`
        : "/api/bookings";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update booking status");
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление заявками</h1>
        <Select
          value={statusFilter || ""}
          onValueChange={(value) => setStatusFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все заявки</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="processed">Обработанные</SelectItem>
            <SelectItem value="archived">Архивные</SelectItem>
            <SelectItem value="deleted">Удаленные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ФИО</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Тип билета</TableHead>
              <TableHead>Тип оплаты</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.fullName}</TableCell>
                <TableCell>{booking.phone}</TableCell>
                <TableCell>{ticketTypeLabels[booking.ticketType]}</TableCell>
                <TableCell>{paymentTypeLabels[booking.paymentType]}</TableCell>
                <TableCell>
                  <Badge
                    className={`${statusColors[booking.status]} text-white`}
                  >
                    {statusLabels[booking.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(booking.createdAt), "dd.MM.yyyy HH:mm", {
                    locale: ru,
                  })}
                </TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onValueChange={(value) =>
                      handleStatusChange(booking._id, value)
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Изменить статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новая</SelectItem>
                      <SelectItem value="processed">Обработана</SelectItem>
                      <SelectItem value="archived">В архив</SelectItem>
                      <SelectItem value="deleted">Удалить</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
