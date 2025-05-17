"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import Photos from "./photos";

interface ExcursionDetailsProps {
  title: string;
  description: string;
  duration: {
    hours: number;
    minutes: number;
  };
  addressMeeting: string;
  rating: string;
  prices: {
    adult: string;
    child: string;
    retired: string;
    childUnder7: string;
  };
  excursionId: string;
}

export default function ExcursionDetails({
  title,
  description,
  duration,
  addressMeeting,
  rating,
  prices,
  excursionId,
}: ExcursionDetailsProps) {
  const isMobile = useIsMobile();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncatedDescription = description.slice(0, 100) + "...";

  const formatDuration = () => {
    if (!duration) return "";
    const hours = duration.hours;
    const minutes = duration.minutes;
    if (hours === 0) return `${minutes} минут`;
    if (minutes === 0) return `${hours} часа`;
    return `${hours} часа ${minutes} минут`;
  };

  const scrollToBookingForm = () => {
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[30px]">
        <div className="bg-white rounded-[20px] md:p-6 p-4">
          <div className="px-2">
            <h2 className="font-['Manrope'] font-semibold text-[42px] leading-[100%] tracking-[-0.03em] text-[#0D1723] mb-4 max-w-[500px]">
              {title}
            </h2>
            <div
              className={`flex ${isMobile ? "flex-col w-full" : "gap-3"} mb-6`}
            >
              <div
                className={`flex bg-[#F8F9FA] p-2 rounded-[10px] items-center gap-2 ${
                  isMobile ? "w-full mb-2" : ""
                }`}
              >
                <Image
                  src="/icons/star.png"
                  alt="Рейтинг"
                  width={24}
                  height={24}
                  className="text-[#3171F7]"
                />
                <span className="text-[16px] text-[#0D1723]">{rating}</span>
              </div>

              <div
                className={`bg-[#F8F9FA] flex items-center gap-2 rounded-[10px] px-2 py-2 ${
                  isMobile ? "w-full mb-2" : ""
                }`}
              >
                <Image
                  src="/icons/clocks.svg"
                  alt="clock"
                  width={14}
                  height={14}
                  className="text-[#3171F7] object-contain"
                />
                <span className="text-[16px] text-[#0D1723]">
                  {formatDuration()}
                </span>
              </div>

              <div
                className={`bg-[#F8F9FA] flex gap-2 items-center rounded-[10px] px-2 py-2 ${
                  isMobile ? "w-full" : ""
                }`}
              >
                <Image
                  src="/icons/location.png"
                  alt="Рейтинг"
                  width={14}
                  height={14}
                  className="text-[#3171F7] object-contain"
                />
                <span className="text-[16px] text-[#0D1723]">
                  {addressMeeting}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground">
                {isMobile && !showFullDescription
                  ? truncatedDescription
                  : description}
                {isMobile && !showFullDescription && (
                  <Button
                    variant="link"
                    className="text-blue-500 p-0 h-auto"
                    onClick={() => setShowFullDescription(true)}
                  >
                    Читать полностью...
                  </Button>
                )}
              </p>
            </div>
          </div>

          {isMobile && <Photos excursionId={excursionId} />}

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 hover:bg-[#F8F9FA] rounded-[15px]  p-2 transition-colors">
              <span className="text-[15px] text-[#0D1723]">Взрослый</span>
              <div className="flex-1 border-b border-dashed border-[#0D1723] mx-2" />
              <span className="text-[15px] text-[#0D1723]">{prices.adult}</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-[#F8F9FA] rounded-[15px]  p-2 transition-colors">
              <span className="text-[15px] text-[#0D1723]">Детский</span>
              <div className="flex-1 border-b border-dashed border-[#0D1723] mx-2" />
              <span className="text-[15px] text-[#0D1723]">{prices.child}</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-[#F8F9FA] rounded-[15px]  p-2 transition-colors">
              <span className="text-[15px] text-[#0D1723]">Пенсионный</span>
              <div className="flex-1 border-b border-dashed border-[#0D1723] mx-2" />
              <span className="text-[15px] text-[#0D1723]">
                {prices.retired}
              </span>
            </div>
            <div className="flex items-center gap-1 hover:bg-[#F8F9FA] rounded-[15px]  p-2 transition-colors">
              <span className="text-[15px] text-[#0D1723]">Дети до 7 лет</span>
              <div className="flex-1 border-b border-dashed border-[#0D1723] mx-2" />
              <span className="text-[15px] text-[#0D1723]">
                {prices.childUnder7}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-6">
            <button
              onClick={scrollToBookingForm}
              className="w-full h-[56px] bg-[#3171F7] text-white rounded-[119px] text-[16px] font-medium hover:bg-[#2B63E0] transition-colors cursor-pointer"
            >
              {isMobile ? "Заказать тур" : "Забронировать экскурсию"}
            </button>
            <Button
              className="w-[56px] h-[56px] hidden md:flex rounded-full aspect-square"
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
