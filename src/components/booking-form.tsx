"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface BookingFormProps {
  className?: string;
}

export default function BookingForm({ className }: BookingFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    ticketType: "adult",
    paymentType: "full",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit booking");

      toast.success("Заявка успешно отправлена");
      setFormData({
        fullName: "",
        phone: "",
        ticketType: "adult",
        paymentType: "full",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Ошибка при отправке заявки");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium mb-1">ФИО</label>
        <Input
          type="text"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          required
          className="bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Телефон</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Тип билета</label>
        <Select
          value={formData.ticketType}
          onValueChange={(value) =>
            setFormData({ ...formData, ticketType: value })
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Выберите тип билета" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adult">Взрослый</SelectItem>
            <SelectItem value="child">Детский</SelectItem>
            <SelectItem value="pensioner">Пенсионный</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Тип оплаты</label>
        <Select
          value={formData.paymentType}
          onValueChange={(value) =>
            setFormData({ ...formData, paymentType: value })
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Выберите тип оплаты" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Полная</SelectItem>
            <SelectItem value="prepayment">Предоплата</SelectItem>
            <SelectItem value="onsite">На месте</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Отправить заявку
      </Button>
    </form>
  );
}
