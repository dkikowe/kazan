"use client";

import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Ticket {
  type: string;
  name: string;
  price: number;
}

interface WhereToGoProps {
  excursionId?: string;
  onTicketsChange?: (tickets: { [key: string]: number }) => void;
  onTimeSelect?: (time: string) => void;
}

const WhereToGo: React.FC<WhereToGoProps> = ({
  excursionId,
  onTicketsChange,
  onTimeSelect,
}) => {
  const isMobile = useIsMobile();
  const [tickets, setTickets] = useState<{ [key: string]: number }>({});
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [addressMeeting, setAddressMeeting] = useState<string>("");
  const [availableTickets, setAvailableTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (excursionId) {
      fetchExcursionData();
    }
  }, [excursionId]);

  const fetchExcursionData = async () => {
    try {
      const response = await fetch(`/api/excursions/${excursionId}`);
      if (!response.ok) throw new Error("Failed to fetch excursion data");
      const data = await response.json();

      if (data.card?.addressMeeting) {
        setAddressMeeting(data.card.addressMeeting);
      }

      if (data.card?.excursionProduct?._id) {
        const productResponse = await fetch(
          `/api/excursion-products/${data.card.excursionProduct._id}`
        );
        if (!productResponse.ok)
          throw new Error("Failed to fetch product data");
        const productData = await productResponse.json();

        if (productData.startTimes) {
          setAvailableTimes(productData.startTimes);
        }

        if (productData.tickets) {
          setAvailableTickets(productData.tickets);
          // Инициализируем счетчики для каждого типа билета
          const initialTickets = productData.tickets.reduce(
            (acc: { [key: string]: number }, ticket: Ticket) => {
              acc[ticket.type] = 0;
              return acc;
            },
            {}
          );
          setTickets(initialTickets);
        }
      }
    } catch (error) {
      console.error("Error fetching excursion data:", error);
    }
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    onTimeSelect?.(time);
  };

  const handleDecrease = (type: string) => {
    setTickets((prev) => {
      const newTickets = {
        ...prev,
        [type]: Math.max(0, prev[type] - 1),
      };
      onTicketsChange?.(newTickets);
      return newTickets;
    });
  };

  const handleIncrease = (type: string) => {
    setTickets((prev) => {
      const newTickets = {
        ...prev,
        [type]: prev[type] + 1,
      };
      onTicketsChange?.(newTickets);
      return newTickets;
    });
  };

  return (
    <div
      className={`${isMobile ? "w-full" : "w-[517px]"} h-[${
        isMobile ? "600px" : "563px"
      }] flex flex-col bg-transparent rounded-[10px] border-box overflow-hidden shadow-none p-[20px]`}
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
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              className={`w-[67px] h-[37px] ${
                selectedTime === time
                  ? "bg-[#3171F7] text-white"
                  : "bg-[#F3F4F6] text-[#161819]"
              } rounded-[10px] text-[14px] leading-[17px] flex items-center justify-center`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Пункт сбора */}
      <div className="flex flex-col gap-[4px] pt-[23px]">
        <span className="text-[#161819] text-[14px] leading-[21px]">
          Пункт сбора:
        </span>
        <span className="text-[#161819] text-[14px] leading-[21px] flex items-center gap-[10px]">
          <img src="/icons/location.svg" width={11} height={14} alt="" />
          {addressMeeting}
        </span>
      </div>

      {/* Счетчики билетов */}
      <div className="flex mt-[20px] flex-col gap-[5px]">
        {availableTickets.map((ticket) => (
          <div
            key={ticket.type}
            className={`flex items-center ${
              isMobile ? "justify-between" : "gap-[200px]"
            }`}
          >
            <div className="text-[#161819] text-[14px] leading-[21px] w-[180px] ">
              {ticket.name} ({ticket.price} ₽):
            </div>
            <div className="flex items-center gap-[11px]">
              <button
                onClick={() => handleDecrease(ticket.type)}
                className="w-[38px] h-[38px] bg-[#F3F4F6] rounded-[9px] flex items-center justify-center"
                disabled={tickets[ticket.type] === 0}
              >
                <div className="w-[11px] h-[1px] bg-[#534E4E]" />
              </button>
              <div className="w-[51px] h-[38px] bg-white rounded-[11px] border border-[#DDDDDD] flex items-center justify-center">
                <span className="text-[#161819] text-[14px] leading-[15px]">
                  {tickets[ticket.type]}
                </span>
              </div>
              <button
                onClick={() => handleIncrease(ticket.type)}
                className="w-[38px] h-[38px] bg-[#3171F7] rounded-[9px] flex items-center justify-center"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 0V11M0 5.5H11"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
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
            <span className="text-[#AFB2B8] text-[14px] leading-[17px]">
              Добавить экскурсию
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhereToGo;
