"use client";

import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const WhereToGo: React.FC = () => {
  const isMobile = useIsMobile();
  // Состояния для каждого типа билета
  const [tickets, setTickets] = useState({
    adult: 5,
    child: 2,
    pensioner: 0,
    childUnder7: 0,
  });

  // Функции для изменения количества билетов
  const handleDecrease = (type: keyof typeof tickets) => {
    setTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  };

  const handleIncrease = (type: keyof typeof tickets) => {
    setTickets((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  return (
    <div
      className={`${isMobile ? "w-full" : "w-[517px]"} h-[${
        isMobile ? "600px" : "563px"
      }] flex flex-col bg-transparent rounded-[10px] border-box overflow-hidden shadow-none p-[10px]`}
    >
      {/* Верхняя белая полоса */}
      <div className="w-[90%] h-[47px] bg-white rounded-[10px] border border-[#D0D0D3] flex items-center">
        {/* Пусто, просто фон */}
      </div>

      {/* Время и кнопки времени */}
      <div className="flex flex-col gap-[8px] pt-[22px]">
        <span className="text-[#161819] text-[14px] leading-[21px]">
          Время:
        </span>
        <div
          className={`flex flex-row ${isMobile ? "flex-wrap" : ""} gap-[11px]`}
        >
          <button className="w-[67px] h-[37px] bg-[#3171F7] rounded-[10px] text-white text-[14px] leading-[17px] flex items-center justify-center">
            10:30
          </button>
          <button className="w-[67px] h-[37px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[17px] flex items-center justify-center">
            11:30
          </button>
          <button className="w-[67px] h-[37px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[17px] flex items-center justify-center">
            12:30
          </button>
          <button className="w-[67px] h-[37px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[17px] flex items-center justify-center">
            14:30
          </button>
          <button className="w-[67px] h-[37px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[17px] flex items-center justify-center">
            15:30
          </button>
          <button className="w-[67px] h-[37px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[17px] flex items-center justify-center">
            16:30
          </button>
          <button className="w-[67px] h-[37px] bg-[#F3F4F6] rounded-[10px] text-[#161819] text-[14px] leading-[17px] flex items-center justify-center">
            17:30
          </button>
        </div>
      </div>

      {/* Пункт сбора */}
      <div className="flex flex-col gap-[4px] pt-[23px]">
        <span className="text-[#161819] text-[14px] leading-[21px]">
          Пункт сбора:
        </span>
        <span className="text-[#161819] text-[14px] leading-[21px] pl-[20px]">
          ул. Баумана, 19 в отеле Ногай (вход через Арку)
        </span>
      </div>

      {/* Счетчики билетов */}
      <div className="flex flex-col gap-[5px] ">
        {/* Взрослый */}
        <div
          className={`flex items-center ${
            isMobile ? "justify-between" : "gap-[200px]"
          }`}
        >
          <div className="text-[#161819] text-[14px] leading-[21px] w-[140px]">
            Взрослый:
          </div>
          <div className="flex items-center gap-[11px]">
            <button
              onClick={() => handleDecrease("adult")}
              className="w-[38px] h-[38px] bg-[#F3F4F6] rounded-[9px] flex items-center justify-center"
              disabled={tickets.adult === 0}
            >
              <div className="w-[11px] h-[1px] bg-[#534E4E]" />
            </button>
            <div className="w-[51px] h-[38px] bg-white rounded-[11px] border border-[#DDDDDD] flex items-center justify-center">
              <span className="text-[#161819] text-[14px] leading-[15px]">
                {tickets.adult}
              </span>
            </div>
            <button
              onClick={() => handleIncrease("adult")}
              className="w-[38px] h-[38px] bg-[#3171F7] rounded-[9px] flex items-center justify-center"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.5 0V11M0 5.5H11" stroke="white" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
        {/* Детский */}
        <div
          className={`flex items-center ${
            isMobile ? "justify-between" : "gap-[200px]"
          }`}
        >
          <div className="text-[#161819] text-[14px] leading-[21px] w-[140px]">
            Детский (7-14 лет):
          </div>
          <div className="flex items-center gap-[11px]">
            <button
              onClick={() => handleDecrease("child")}
              className="w-[38px] h-[38px] bg-[#F3F4F6] rounded-[9px] flex items-center justify-center"
              disabled={tickets.child === 0}
            >
              <div className="w-[11px] h-[1px] bg-[#534E4E]" />
            </button>
            <div className="w-[51px] h-[38px] bg-white rounded-[11px] border border-[#DDDDDD] flex items-center justify-center">
              <span className="text-[#161819] text-[14px] leading-[15px]">
                {tickets.child}
              </span>
            </div>
            <button
              onClick={() => handleIncrease("child")}
              className="w-[38px] h-[38px] bg-[#3171F7] rounded-[9px] flex items-center justify-center"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.5 0V11M0 5.5H11" stroke="white" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
        {/* Пенсионеры */}
        <div
          className={`flex items-center ${
            isMobile ? "justify-between" : "gap-[200px]"
          }`}
        >
          <div className="text-[#161819] text-[14px] leading-[21px] w-[140px]">
            Пенсионеры:
          </div>
          <div className="flex items-center gap-[11px]">
            <button
              onClick={() => handleDecrease("pensioner")}
              className="w-[38px] h-[38px] bg-[#F3F4F6] rounded-[9px] flex items-center justify-center"
              disabled={tickets.pensioner === 0}
            >
              <div className="w-[11px] h-[1px] bg-[#534E4E]" />
            </button>
            <div className="w-[51px] h-[38px] bg-white rounded-[11px] border border-[#DDDDDD] flex items-center justify-center">
              <span className="text-[#161819] text-[14px] leading-[15px]">
                {tickets.pensioner}
              </span>
            </div>
            <button
              onClick={() => handleIncrease("pensioner")}
              className="w-[38px] h-[38px] bg-[#3171F7] rounded-[9px] flex items-center justify-center"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.5 0V11M0 5.5H11" stroke="white" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
        {/* Дети до 7 лет */}
        <div
          className={`flex items-center ${
            isMobile ? "justify-between" : "gap-[200px]"
          }`}
        >
          <div className="text-[#161819] text-[14px] leading-[21px] w-[140px]">
            Дети до 7 лет:
          </div>
          <div className="flex items-center gap-[11px]">
            <button
              onClick={() => handleDecrease("childUnder7")}
              className="w-[38px] h-[38px] bg-[#F3F4F6] rounded-[9px] flex items-center justify-center"
              disabled={tickets.childUnder7 === 0}
            >
              <div className="w-[11px] h-[1px] bg-[#534E4E]" />
            </button>
            <div className="w-[51px] h-[38px] bg-white rounded-[11px] border border-[#DDDDDD] flex items-center justify-center">
              <span className="text-[#161819] text-[14px] leading-[15px]">
                {tickets.childUnder7}
              </span>
            </div>
            <button
              onClick={() => handleIncrease("childUnder7")}
              className="w-[38px] h-[38px] bg-[#3171F7] rounded-[9px] flex items-center justify-center"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.5 0V11M0 5.5H11" stroke="white" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer для выравнивания кнопки вниз */}
      <div className="flex-1" />

      {/* Кнопка добавления экскурсии */}
      <div className="flex items-center justify-center">
        <div className="w-[80%] h-[62px] bg-[#F3F4F6] rounded-[16px] border border-dashed border-[#AFB2B8] border-opacity-20 flex items-center justify-center mt-[24px] mb-[16px]">
          <div className="flex items-center gap-[15px]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 0V22M0 11H22" stroke="#AFB2B8" strokeWidth="1.5" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[#161819] text-[14px] leading-[21px]">
                Добавить экскурсию
              </span>
              <span className="text-[#161819] text-[12px] leading-[18px] opacity-50">
                Следующий день (18 марта)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhereToGo;
