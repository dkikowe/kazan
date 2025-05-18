"use client";

import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface BookingFormProps {
  excursionId: string;
  selectedTime?: string;
  selectedDate?: string;
  tickets: {
    [key: string]: number;
  };
}

const BookingForm: React.FC<BookingFormProps> = ({
  excursionId,
  selectedTime,
  selectedDate,
  tickets,
}) => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    promoCode: "",
    agreement: false,
    personalData: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreement || !formData.personalData) {
      toast.error("Необходимо согласиться с условиями");
      return;
    }

    if (!selectedTime) {
      toast.error("Выберите время экскурсии");
      return;
    }

    if (!selectedDate) {
      toast.error("Выберите дату экскурсии");
      return;
    }

    const hasTickets = Object.values(tickets).some((count) => count > 0);
    if (!hasTickets) {
      toast.error("Выберите хотя бы один билет");
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          excursionId,
          fullName: formData.name,
          phone: formData.phone,
          time: selectedTime,
          date: selectedDate,
          tickets: Object.entries(tickets)
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => ({
              type,
              count,
            })),
          promoCode: formData.promoCode || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      toast.success("Заявка успешно отправлена");
      setFormData({
        name: "",
        phone: "",
        promoCode: "",
        agreement: false,
        personalData: false,
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Ошибка при отправке заявки");
    }
  };

  if (isMobile) {
    return null;
  }

  return (
    <div
      id="booking-form"
      className="w-[607px] h-[563px] flex flex-col bg-[#f5f5f5] bg-opacity-[17%] rounded-[16px] border border-[#E9E9E9] p-[45px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[30px]">
        {/* Имя */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[#161819] text-[14px] leading-[21px]">
            Введите имя
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Иван Иванов"
            required
            className="w-[517px] h-[47px] bg-white rounded-[10px] border border-[#D0D0D3] border-opacity-[44%] px-[25px] text-[#161819] text-[14px] leading-[21px] placeholder-[#161819] placeholder-opacity-[34%]"
          />
        </div>

        {/* Телефон */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[#161819] text-[14px] leading-[21px]">
            Телефон
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+7 (---) --- -- --"
            className="w-[517px] h-[47px] bg-white rounded-[10px] border border-[#D0D0D3] border-opacity-[44%] px-[25px] text-[#161819] text-[14px] leading-[21px] placeholder-[#161819] placeholder-opacity-[34%]"
          />
        </div>

        {/* Промокод */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[#161819] text-[14px] leading-[21px]">
            Промокод
          </label>
          <input
            type="text"
            name="promoCode"
            value={formData.promoCode}
            onChange={handleChange}
            className="w-[517px] h-[47px] bg-white rounded-[10px] border border-[#D0D0D3] border-opacity-[44%] px-[25px] text-[#161819] text-[14px] leading-[21px]"
          />
        </div>

        {/* Соглашения */}
        <div className="flex flex-col gap-[15px]">
          <label className="flex items-center gap-[10px] cursor-pointer">
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleChange}
              className="w-[13px] h-[18px] rounded-[4px] border border-[#D0D0D3] border-opacity-[44%]"
            />
            <span className="text-[#161819] text-[14px] leading-[21px] opacity-[60%]">
              Согласен с Договором-офертой на оказание услуг
            </span>
          </label>

          <label className="flex items-center gap-[10px] cursor-pointer">
            <input
              type="checkbox"
              name="personalData"
              checked={formData.personalData}
              onChange={handleChange}
              className="w-[18px] h-[18px] rounded-[4px] border border-[#D0D0D3] border-opacity-[44%]"
            />
            <span className="text-[#161819] text-[14px] leading-[21px] opacity-[60%]">
              Даю согласие ООО "Лидер Майс" на хранение и обработку персональных
              данных и соглашаюсь с условиями их обработки
            </span>
          </label>
        </div>

        {/* Кнопка бронирования */}
        <button
          type="submit"
          className="w-[516px] h-[47px] bg-[#3171F7] rounded-[46px] text-white text-[14px] leading-[17px] flex items-center justify-center"
        >
          Забронировать
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
