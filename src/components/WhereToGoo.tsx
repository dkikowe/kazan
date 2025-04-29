"use client";

import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const WhereToGoo: React.FC = () => {
  const isMobile = useIsMobile();
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [pensionerTickets, setPensionerTickets] = useState(0);
  const [childUnder7Tickets, setChildUnder7Tickets] = useState(0);

  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setter((prev) => prev + 1);
  };

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setter((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div
      className={`${isMobile ? "w-full" : "w-[517px]"} h-[${
        isMobile ? "800px" : "600px"
      }] flex flex-col bg-white rounded-[10px] border-box overflow-hidden shadow-none`}
    >
      {/* Заголовок */}
      <div className="w-full h-[60px] bg-[#3171F7] flex items-center justify-center">
        <span className="text-white text-[18px] leading-[22px] font-medium">
          Куда сходить в Казани?
        </span>
      </div>

      {/* Кнопки выбора времени */}
      <div className="flex flex-wrap gap-[10px] p-[15px]">
        <button className="h-[40px] px-[20px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[21px]">
          Сегодня
        </button>
        <button className="h-[40px] px-[20px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[21px]">
          Завтра
        </button>
        <button className="h-[40px] px-[20px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[21px]">
          Послезавтра
        </button>
      </div>

      {/* Счетчики билетов */}
      <div className="flex flex-col gap-[10px] p-[15px]">
        {/* Взрослые */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#161819] text-[14px] leading-[21px]">
              Взрослые
            </span>
            <span className="text-[#161819] text-[12px] leading-[18px] opacity-[60%]">
              18+
            </span>
          </div>
          <div className="flex items-center gap-[15px]">
            <button
              onClick={() => handleDecrement(setAdultTickets)}
              className="w-[30px] h-[30px] bg-[#F3F4F6] rounded-[5px] text-[#161819] text-[16px] leading-[24px] flex items-center justify-center"
            >
              -
            </button>
            <span className="text-[#161819] text-[16px] leading-[24px]">
              {adultTickets}
            </span>
            <button
              onClick={() => handleIncrement(setAdultTickets)}
              className="w-[30px] h-[30px] bg-[#F3F4F6] rounded-[5px] text-[#161819] text-[16px] leading-[24px] flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Дети */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#161819] text-[14px] leading-[21px]">
              Дети
            </span>
            <span className="text-[#161819] text-[12px] leading-[18px] opacity-[60%]">
              7-17 лет
            </span>
          </div>
          <div className="flex items-center gap-[15px]">
            <button
              onClick={() => handleDecrement(setChildTickets)}
              className="w-[30px] h-[30px] bg-[#F3F4F6] rounded-[5px] text-[#161819] text-[16px] leading-[24px] flex items-center justify-center"
            >
              -
            </button>
            <span className="text-[#161819] text-[16px] leading-[24px]">
              {childTickets}
            </span>
            <button
              onClick={() => handleIncrement(setChildTickets)}
              className="w-[30px] h-[30px] bg-[#F3F4F6] rounded-[5px] text-[#161819] text-[16px] leading-[24px] flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Пенсионеры */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#161819] text-[14px] leading-[21px]">
              Пенсионеры
            </span>
            <span className="text-[#161819] text-[12px] leading-[18px] opacity-[60%]">
              60+
            </span>
          </div>
          <div className="flex items-center gap-[15px]">
            <button
              onClick={() => handleDecrement(setPensionerTickets)}
              className="w-[30px] h-[30px] bg-[#F3F4F6] rounded-[5px] text-[#161819] text-[16px] leading-[24px] flex items-center justify-center"
            >
              -
            </button>
            <span className="text-[#161819] text-[16px] leading-[24px]">
              {pensionerTickets}
            </span>
            <button
              onClick={() => handleIncrement(setPensionerTickets)}
              className="w-[30px] h-[30px] bg-[#F3F4F6] rounded-[5px] text-[#161819] text-[16px] leading-[24px] flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Дети до 7 лет */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#161819] text-[14px] leading-[21px]">
              Дети до 7 лет
            </span>
            <span className="text-[#161819] text-[12px] leading-[18px] opacity-[60%]">
              Бесплатно
            </span>
          </div>
          <div className="flex items-center gap-[15px]">
            <button
              onClick={() => handleDecrement(setChildUnder7Tickets)}
              className="w-[30px] h-[30px] bg-[#F3F4F6] rounded-[5px] text-[#161819] text-[16px] leading-[24px] flex items-center justify-center"
            >
              -
            </button>
            <span className="text-[#161819] text-[16px] leading-[24px]">
              {childUnder7Tickets}
            </span>
            <button
              onClick={() => handleIncrement(setChildUnder7Tickets)}
              className="w-[30px] h-[30px] bg-[#F3F4F6] rounded-[5px] text-[#161819] text-[16px] leading-[24px] flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Кнопка добавления экскурсии */}
      <div className="mt-auto p-[15px]">
        <button className="w-full h-[50px] bg-[#3171F7] rounded-[10px] text-white text-[16px] leading-[20px] font-medium">
          Добавить экскурсию
        </button>
      </div>
    </div>
  );
};

export default WhereToGoo;
