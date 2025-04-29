"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface ExcursionDetailsProps {
  title: string;
  description: string;
  duration: string;
  location: string;
  rating: string;
  prices: {
    adult: string;
    child: string;
    retired: string;
    childUnder7: string;
  };
}

export default function ExcursionDetails({
  title,
  description,
  duration,
  location,
  rating,
  prices,
}: ExcursionDetailsProps) {
  const scrollToBookingForm = () => {
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[30px]">
        <div className="bg-white rounded-[20px] p-6">
          <h2 className="font-['Manrope'] font-semibold text-[42px] leading-[100%] tracking-[-0.03em] text-[#0D1723] mb-4 max-w-[500px]">
            {title}
          </h2>
          <div className="flex   gap-3 mb-6">
            <div className="flex bg-[#F8F9FA] p-4  rounded-[10px] items-center gap-2">
              <Image
                src="/icons/star.png"
                alt="Рейтинг"
                width={24}
                height={24}
                className="text-[#3171F7]"
              />
              <span className="text-[16px] text-[#0D1723]">{rating}</span>
            </div>

            <div className="bg-[#F8F9FA] flex items-center gap-2 rounded-[10px] px-4 py-2">
              <Image
                src="/icons/clocks.svg"
                alt="clock"
                width={14}
                height={14}
                className="text-[#3171F7] object-contain"
              />
              <span className="text-[16px] text-[#0D1723]">{duration}</span>
            </div>

            <div className="bg-[#F8F9FA] flex gap-2 items-center rounded-[10px] px-4 py-2">
              <Image
                src="/icons/location.png"
                alt="Рейтинг"
                width={14}
                height={14}
                className="text-[#3171F7] object-contain"
              />
              <span className="text-[16px] text-[#0D1723]">{location}</span>
            </div>
          </div>
          <p className="text-[16px] w-[95%] text-[#0D1723] mb-6">
            {description}
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 hover:bg-[#F8F9FA] rounded-[15px] px-6 py-4 transition-colors">
              <span className="text-[16px] text-[#0D1723]">Взрослый</span>
              <div className="flex-1 border-b border-dashed border-[#0D1723] mx-2" />
              <span className="text-[16px] text-[#0D1723]">{prices.adult}</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#F8F9FA] rounded-[15px] px-6 py-4 transition-colors">
              <span className="text-[16px] text-[#0D1723]">Детский</span>
              <div className="flex-1 border-b border-dashed border-[#0D1723] mx-2" />
              <span className="text-[16px] text-[#0D1723]">{prices.child}</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#F8F9FA] rounded-[15px] px-6 py-4 transition-colors">
              <span className="text-[16px] text-[#0D1723]">Пенсионный</span>
              <div className="flex-1 border-b border-dashed border-[#0D1723] mx-2" />
              <span className="text-[16px] text-[#0D1723]">
                {prices.retired}
              </span>
            </div>
            <div className="flex items-center gap-2 hover:bg-[#F8F9FA] rounded-[15px] px-6 py-4 transition-colors">
              <span className="text-[16px] text-[#0D1723]">Дети до 7 лет</span>
              <div className="flex-1 border-b border-dashed border-[#0D1723] mx-2" />
              <span className="text-[16px] text-[#0D1723]">
                {prices.childUnder7}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-6">
            <button
              onClick={scrollToBookingForm}
              className="w-[253px] h-[56px] bg-[#3171F7] text-white rounded-[119px] text-[16px] font-medium hover:bg-[#2B63E0] transition-colors cursor-pointer"
            >
              Забронировать экскурсию
            </button>
            <Button
              className="w-[56px] h-[56px] rounded-full aspect-square"
              variant="black"
            >
              <ArrowUpRight className="size-[15px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
